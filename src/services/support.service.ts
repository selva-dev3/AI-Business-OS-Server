import mongoose from 'mongoose';
import Ticket from '../models/Ticket';
import TicketReply from '../models/TicketReply';
import TicketCategory from '../models/TicketCategory';
import Activity from '../models/Activity';
import AppError from '../utils/appError';
import User from '../models/User';
import { generateCode, paginateQuery, buildMeta } from '../utils/helpers';

interface QueryParams {
  status?: string;
  priority?: string;
  categoryId?: string;
  assigneeId?: string;
  reporterId?: string;
  fromDate?: string;
  toDate?: string;
  search?: string;
  page?: string;
  limit?: string;
}

const toObjectId = (id: string) => mongoose.Types.ObjectId.createFromHexString(id);

const getNextTicketNumber = async (companyId: string) => {
  const lastTicket = await Ticket.findOne({ companyId }).sort({ createdAt: -1 }).select('ticketNumber');
  const lastNum = lastTicket ? parseInt((lastTicket.ticketNumber as string).split('-').pop() || '0', 10) || 0 : 0;
  return generateCode('TCK', lastNum + 1);
};

const calculateSLADeadline = async (categoryId: string | undefined, priority: string) => {
  if (!categoryId) {
    const slaMap: Record<string, number> = { LOW: 72, MEDIUM: 48, HIGH: 24, CRITICAL: 8 };
    const hours = slaMap[priority] || 48;
    return new Date(Date.now() + hours * 60 * 60 * 1000);
  }

  const category = await TicketCategory.findById(categoryId);
  if (category && (category as unknown as Record<string, unknown>).slaHours) {
    return new Date(Date.now() + ((category as unknown as Record<string, unknown>).slaHours as number) * 60 * 60 * 1000);
  }

  return null;
};

const logActivity = async ({ companyId, userId, action, details }: Record<string, unknown>) => {
  return Activity.create({
    type: 'NOTE',
    subject: `Ticket ${action as string}`,
    description: typeof details === 'string' ? details : JSON.stringify(details),
    companyId,
    createdBy: userId,
  });
};

const list = async (companyId: string, query: QueryParams = {}) => {
  const { status, priority, categoryId, assigneeId, reporterId, fromDate, toDate, search } = query;
  const filter: Record<string, unknown> = { companyId };

  if (status) filter.status = status;
  if (priority) filter.priority = priority;
  if (categoryId) filter.categoryId = categoryId;
  if (assigneeId) filter.assigneeId = assigneeId;
  if (reporterId) filter.reporterId = reporterId;
  if (fromDate || toDate) {
    filter.createdAt = {};
    if (fromDate) (filter.createdAt as Record<string, unknown>).$gte = new Date(fromDate);
    if (toDate) (filter.createdAt as Record<string, unknown>).$lte = new Date(toDate);
  }
  if (search) {
    const regex = new RegExp(search, 'i');
    filter.$or = [
      { title: regex },
      { ticketNumber: regex },
      { description: regex },
    ];
  }

  const { skip, limit: lim, page: p } = paginateQuery(query.page || "1", Number(query.limit || "20"));
  const [tickets, total] = await Promise.all([
    Ticket.find(filter)
      .populate('categoryId', 'name color')
      .populate('reporterId', 'name email avatar')
      .populate('assigneeId', 'name email avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(lim),
    Ticket.countDocuments(filter),
  ]);

  return { data: tickets, meta: buildMeta(total, p, lim) };
};

const create = async (companyId: string, userId: string, data: Record<string, unknown>) => {
  const ticketNumber = await getNextTicketNumber(companyId);
  const slaDeadline = await calculateSLADeadline(data.categoryId as string | undefined, data.priority as string);

  const ticket = await Ticket.create({
    ...data,
    ticketNumber,
    slaDeadline,
    companyId,
    reporterId: userId,
  });

  return Ticket.findById(ticket._id)
    .populate('categoryId', 'name color')
    .populate('reporterId', 'name email avatar');
};

const getById = async (companyId: string, ticketId: string): Promise<any> => {
  const ticket = await Ticket.findOne({ _id: ticketId, companyId })
    .populate('categoryId', 'name color slaHours')
    .populate('reporterId', 'name email avatar')
    .populate('assigneeId', 'name email avatar');

  if (!ticket) throw new AppError(404, 'NOT_FOUND', 'Ticket not found');

  const [replies, activities] = await Promise.all([
    TicketReply.find({ ticketId }).populate('userId', 'name email avatar').sort({ createdAt: 1 }),
    Activity.find({ companyId, $or: [{ ticketId: ticketId }, { description: new RegExp(ticketId, 'i') }] })
      .sort({ createdAt: -1 }).limit(50),
  ]);

  return { ...ticket.toJSON(), replies, activities };
};

const update = async (companyId: string, ticketId: string, data: Record<string, unknown>) => {
  const ticket = await Ticket.findOneAndUpdate(
    { _id: ticketId, companyId },
    { $set: data },
    { new: true, runValidators: true }
  )
    .populate('categoryId', 'name color')
    .populate('reporterId', 'name email avatar')
    .populate('assigneeId', 'name email avatar');

  if (!ticket) throw new AppError(404, 'NOT_FOUND', 'Ticket not found');
  return ticket;
};

const remove = async (companyId: string, ticketId: string) => {
  const ticket = await Ticket.findOneAndDelete({ _id: ticketId, companyId });
  if (!ticket) throw new AppError(404, 'NOT_FOUND', 'Ticket not found');
  await TicketReply.deleteMany({ ticketId });
  return { success: true };
};

const reply = async (companyId: string, userId: string, ticketId: string, data: Record<string, unknown>) => {
  const ticket = await Ticket.findOne({ _id: ticketId, companyId });
  if (!ticket) throw new AppError(404, 'NOT_FOUND', 'Ticket not found');

  if (!ticket.firstResponseAt && !data.isInternal) {
    await Ticket.findByIdAndUpdate(ticketId, { firstResponseAt: new Date() });
  }

  const replyDoc = await TicketReply.create({
    ...data,
    ticketId,
    userId,
  });

  return replyDoc.populate('userId', 'name email avatar');
};

const assign = async (companyId: string, userId: string, ticketId: string, assigneeId: string) => {
  const ticket = await Ticket.findOneAndUpdate(
    { _id: ticketId, companyId },
    { assigneeId, status: 'ASSIGNED' },
    { new: true, runValidators: true }
  )
    .populate('assigneeId', 'name email avatar')
    .populate('reporterId', 'name email avatar');

  if (!ticket) throw new AppError(404, 'NOT_FOUND', 'Ticket not found');

  await logActivity({
    ticketId,
    companyId,
    userId,
    action: 'ASSIGNED',
    details: `Ticket assigned to user ${assigneeId}`,
  });

  return ticket;
};

const changeStatus = async (companyId: string, userId: string, ticketId: string, status: string, resolution: string | undefined) => {
  const updateData: Record<string, unknown> = { status };
  if (resolution) updateData.resolution = resolution;
  if (status === 'RESOLVED') updateData.resolvedAt = new Date();
  if (status === 'CLOSED') updateData.closedAt = new Date();

  const ticket = await Ticket.findOneAndUpdate(
    { _id: ticketId, companyId },
    { $set: updateData },
    { new: true, runValidators: true }
  )
    .populate('assigneeId', 'name email avatar')
    .populate('reporterId', 'name email avatar');

  if (!ticket) throw new AppError(404, 'NOT_FOUND', 'Ticket not found');

  await logActivity({
    ticketId,
    companyId,
    userId,
    action: `STATUS_CHANGED_TO_${status}`,
    details: `Status changed to ${status}${resolution ? `: ${resolution}` : ''}`,
  });

  return ticket;
};

const changePriority = async (companyId: string, userId: string, ticketId: string, priority: string) => {
  const ticket = await Ticket.findOneAndUpdate(
    { _id: ticketId, companyId },
    { priority },
    { new: true, runValidators: true }
  )
    .populate('assigneeId', 'name email avatar')
    .populate('reporterId', 'name email avatar');

  if (!ticket) throw new AppError(404, 'NOT_FOUND', 'Ticket not found');

  await logActivity({
    ticketId,
    companyId,
    userId,
    action: 'PRIORITY_CHANGED',
    details: `Priority changed to ${priority}`,
  });

  return ticket;
};

const close = async (companyId: string, userId: string, ticketId: string, resolution: string | undefined) => {
  const updateData: Record<string, unknown> = { status: 'CLOSED', closedAt: new Date() };
  if (resolution) updateData.resolution = resolution;

  const ticket = await Ticket.findOneAndUpdate(
    { _id: ticketId, companyId },
    { $set: updateData },
    { new: true, runValidators: true }
  )
    .populate('assigneeId', 'name email avatar')
    .populate('reporterId', 'name email avatar');

  if (!ticket) throw new AppError(404, 'NOT_FOUND', 'Ticket not found');

  await logActivity({
    ticketId,
    companyId,
    userId,
    action: 'CLOSED',
    details: `Ticket closed${resolution ? `: ${resolution}` : ''}`,
  });

  return ticket;
};

const getAISummary = async (companyId: string, ticketId: string) => {
  const ticket = await Ticket.findOne({ _id: ticketId, companyId })
    .populate('categoryId', 'name')
    .populate('reporterId', 'name email')
    .populate('assigneeId', 'name email');

  if (!ticket) throw new AppError(404, 'NOT_FOUND', 'Ticket not found');

  const replies = await TicketReply.find({ ticketId })
    .populate('userId', 'name email')
    .sort({ createdAt: 1 });

  const internalNotes = replies.filter(r => (r as unknown as Record<string, unknown>).isInternal);
  const publicReplies = replies.filter(r => !(r as unknown as Record<string, unknown>).isInternal);

  const summary = {
    overview: {
      ticketNumber: ticket.ticketNumber,
      title: ticket.title,
      status: ticket.status,
      priority: ticket.priority,
      category: (ticket.categoryId as unknown as Record<string, unknown> | undefined)?.name || 'Uncategorized',
      reporter: (ticket.reporterId as unknown as Record<string, unknown> | undefined)?.name || 'Unknown',
      assignee: (ticket.assigneeId as unknown as Record<string, unknown> | undefined)?.name || 'Unassigned',
      created: ticket.createdAt,
      slaDeadline: ticket.slaDeadline,
      slaBreached: ticket.slaDeadline && new Date() > ticket.slaDeadline,
    },
    conversation: {
      totalReplies: replies.length,
      publicReplies: publicReplies.length,
      internalNotes: internalNotes.length,
      lastActivity: replies.length > 0 ? replies[replies.length - 1]!.createdAt : ticket.createdAt,
    },
    metrics: {
      responseTime: ticket.firstResponseAt
        ? Math.round((new Date(ticket.firstResponseAt).getTime() - new Date(ticket.createdAt).getTime()) / (1000 * 60))
        : null,
      resolutionTime: ticket.resolvedAt
        ? Math.round((new Date(ticket.resolvedAt).getTime() - new Date(ticket.createdAt).getTime()) / (1000 * 60 * 60))
        : null,
    },
  };

  return summary;
};

const listCategories = async (companyId: string) => {
  return TicketCategory.find({ companyId }).sort({ name: 1 });
};

const createCategory = async (companyId: string, data: Record<string, unknown>) => {
  const existing = await TicketCategory.findOne({ companyId, name: data.name as string });
  if (existing) throw new AppError(409, 'CONFLICT', 'Category name already exists for this company');

  const category = await TicketCategory.create({ ...data, companyId });
  return category;
};

const updateCategory = async (companyId: string, categoryId: string, data: Record<string, unknown>) => {
  const category = await TicketCategory.findOneAndUpdate(
    { _id: categoryId, companyId },
    { $set: data },
    { new: true, runValidators: true }
  );
  if (!category) throw new AppError(404, 'NOT_FOUND', 'Category not found');
  return category;
};

const removeCategory = async (companyId: string, categoryId: string) => {
  const ticketsUsing = await Ticket.countDocuments({ companyId, categoryId });
  if (ticketsUsing > 0) {
    throw new AppError(400, 'BAD_REQUEST', `Cannot delete category: ${ticketsUsing} ticket(s) are using it`);
  }

  const category = await TicketCategory.findOneAndDelete({ _id: categoryId, companyId });
  if (!category) throw new AppError(404, 'NOT_FOUND', 'Category not found');
  return { success: true };
};

const getSummary = async (companyId: string) => {
  const [totals, byPriority, byCategory, slaStats] = await Promise.all([
    Ticket.aggregate([
      { $match: { companyId: toObjectId(companyId) } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          open: { $sum: { $cond: [{ $in: ['$status', ['OPEN', 'ASSIGNED', 'IN_PROGRESS']] }, 1, 0] } },
          resolved: { $sum: { $cond: [{ $eq: ['$status', 'RESOLVED'] }, 1, 0] } },
          closed: { $sum: { $cond: [{ $eq: ['$status', 'CLOSED'] }, 1, 0] } },
        },
      },
    ]),
    Ticket.aggregate([
      { $match: { companyId: toObjectId(companyId) } },
      { $group: { _id: '$priority', count: { $sum: 1 } } },
    ]),
    Ticket.aggregate([
      { $match: { companyId: toObjectId(companyId) } },
      { $group: { _id: '$categoryId', count: { $sum: 1 } } },
    ]),
    Ticket.aggregate([
      { $match: { companyId: toObjectId(companyId), slaDeadline: { $ne: null } } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          breached: {
            $sum: {
              $cond: [
                { $or: [{ $and: [{ $ne: ['$resolvedAt', null] }, { $gt: ['$resolvedAt', '$slaDeadline'] }] }, { $and: [{ $eq: ['$resolvedAt', null] }, { $lt: ['$slaDeadline', new Date()] }] }] },
                1,
                0,
              ],
            },
          },
          avgResolutionMins: { $avg: { $cond: [{ $ne: ['$resolvedAt', null] }, { $divide: [{ $subtract: ['$resolvedAt', '$createdAt'] }, 60000] }, null] } },
        },
      },
    ]),
  ]);

  const total = (totals[0] as { total: number; open: number; resolved: number; closed: number }) || { total: 0, open: 0, resolved: 0, closed: 0 };
  const sla = (slaStats[0] as { total: number; breached: number; avgResolutionMins: number | null }) || { total: 0, breached: 0, avgResolutionMins: null };

  return {
    totals: {
      total: total.total,
      open: total.open,
      resolved: total.resolved,
      closed: total.closed,
    },
    byPriority: (byPriority as { _id: string; count: number }[]).reduce((acc: Record<string, number>, p) => ({ ...acc, [p._id]: p.count }), {}),
    byCategory: (byCategory as { _id: string; count: number }[]).reduce((acc: Record<string, number>, c) => ({ ...acc, [c._id]: c.count }), {}),
    sla: {
      total: sla.total,
      breached: sla.breached,
      complianceRate: sla.total > 0 ? Math.round(((sla.total - sla.breached) / sla.total) * 100) : null,
      avgResolutionMins: sla.avgResolutionMins ? Math.round(sla.avgResolutionMins) : null,
    },
  };
};

const getSLA = async (companyId: string) => {
  const [slaData, byPriority, byCategory] = await Promise.all([
    Ticket.aggregate([
      {
        $match: {
          companyId: toObjectId(companyId),
          slaDeadline: { $ne: null },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          breached: {
            $sum: {
              $cond: [
                { $or: [{ $and: [{ $ne: ['$resolvedAt', null] }, { $gt: ['$resolvedAt', '$slaDeadline'] }] }, { $and: [{ $eq: ['$resolvedAt', null] }, { $lt: ['$slaDeadline', new Date()] }] }] },
                1,
                0,
              ],
            },
          },
          met: {
            $sum: {
              $cond: [
                { $or: [{ $and: [{ $ne: ['$resolvedAt', null] }, { $lte: ['$resolvedAt', '$slaDeadline'] }] }, { $and: [{ $eq: ['$resolvedAt', null] }, { $gte: ['$slaDeadline', new Date()] }] }] },
                1,
                0,
              ],
            },
          },
        },
      },
    ]),
    Ticket.aggregate([
      {
        $match: {
          companyId: toObjectId(companyId),
          slaDeadline: { $ne: null },
        },
      },
      {
        $group: {
          _id: '$priority',
          total: { $sum: 1 },
          breached: {
            $sum: {
              $cond: [
                { $or: [{ $and: [{ $ne: ['$resolvedAt', null] }, { $gt: ['$resolvedAt', '$slaDeadline'] }] }, { $and: [{ $eq: ['$resolvedAt', null] }, { $lt: ['$slaDeadline', new Date()] }] }] },
                1,
                0,
              ],
            },
          },
        },
      },
    ]),
    Ticket.aggregate([
      {
        $match: {
          companyId: toObjectId(companyId),
          slaDeadline: { $ne: null },
        },
      },
      {
        $group: {
          _id: '$categoryId',
          total: { $sum: 1 },
          breached: {
            $sum: {
              $cond: [
                { $or: [{ $and: [{ $ne: ['$resolvedAt', null] }, { $gt: ['$resolvedAt', '$slaDeadline'] }] }, { $and: [{ $eq: ['$resolvedAt', null] }, { $lt: ['$slaDeadline', new Date()] }] }] },
                1,
                0,
              ],
            },
          },
        },
      },
    ]),
  ]);

  const overall = (slaData[0] as { total: number; breached: number; met: number }) || { total: 0, breached: 0, met: 0 };

  return {
    overall: {
      total: overall.total,
      breached: overall.breached,
      met: overall.met,
      complianceRate: overall.total > 0 ? Math.round((overall.met / overall.total) * 100) : null,
    },
    byPriority: (byPriority as { _id: string; total: number; breached: number }[]).map(p => ({
      priority: p._id,
      total: p.total,
      breached: p.breached,
      complianceRate: p.total > 0 ? Math.round(((p.total - p.breached) / p.total) * 100) : null,
    })),
    byCategory: (byCategory as { _id: string; total: number; breached: number }[]).map(c => ({
      categoryId: c._id,
      total: c.total,
      breached: c.breached,
      complianceRate: c.total > 0 ? Math.round(((c.total - c.breached) / c.total) * 100) : null,
    })),
  };
};

const getAgentPerformance = async (companyId: string) => {
  const performance = await Ticket.aggregate([
    { $match: { companyId: toObjectId(companyId), assigneeId: { $ne: null } } },
    {
      $group: {
        _id: '$assigneeId',
        totalTickets: { $sum: 1 },
        openTickets: { $sum: { $cond: [{ $in: ['$status', ['OPEN', 'ASSIGNED', 'IN_PROGRESS']] }, 1, 0] } },
        resolvedTickets: { $sum: { $cond: [{ $eq: ['$status', 'RESOLVED'] }, 1, 0] } },
        closedTickets: { $sum: { $cond: [{ $eq: ['$status', 'CLOSED'] }, 1, 0] } },
        avgResolutionMins: { $avg: { $cond: [{ $ne: ['$resolvedAt', null] }, { $divide: [{ $subtract: ['$resolvedAt', '$createdAt'] }, 60000] }, null] } },
        firstResponseMins: { $avg: { $cond: [{ $ne: ['$firstResponseAt', null] }, { $divide: [{ $subtract: ['$firstResponseAt', '$createdAt'] }, 60000] }, null] } },
      },
    },
    { $sort: { totalTickets: -1 } },
  ]);

  const userIds = (performance as { _id: string }[]).map(p => p._id);
  const users = await User.find({ _id: { $in: userIds } }).select('name email avatar');

  const userMap = users.reduce((acc: Record<string, { name: string; email: string; avatar: unknown }>, u) => {
    const id = String(u._id);
    acc[id] = { name: `${(u as any).firstName} ${(u as any).lastName}`.trim(), email: u.email as string, avatar: u.avatar };
    return acc;
  }, {});

  return (performance as { _id: string; totalTickets: number; openTickets: number; resolvedTickets: number; closedTickets: number; avgResolutionMins: number | null; firstResponseMins: number | null }[]).map(p => ({
    agent: userMap[p._id.toString()] || { name: 'Unknown', email: null, avatar: null },
    metrics: {
      totalTickets: p.totalTickets,
      openTickets: p.openTickets,
      resolvedTickets: p.resolvedTickets,
      closedTickets: p.closedTickets,
      avgResolutionHours: p.avgResolutionMins ? Math.round((p.avgResolutionMins / 60) * 100) / 100 : null,
      avgFirstResponseMins: p.firstResponseMins ? Math.round(p.firstResponseMins) : null,
    },
  }));
};

export {
  list,
  create,
  getById,
  update,
  remove,
  reply,
  assign,
  changeStatus,
  changePriority,
  close,
  getAISummary,
  listCategories,
  createCategory,
  updateCategory,
  removeCategory,
  getSummary,
  getSLA,
  getAgentPerformance,
};
