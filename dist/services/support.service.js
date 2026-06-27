"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAgentPerformance = exports.getSLA = exports.getSummary = exports.removeCategory = exports.updateCategory = exports.createCategory = exports.listCategories = exports.getAISummary = exports.close = exports.changePriority = exports.changeStatus = exports.assign = exports.reply = exports.remove = exports.update = exports.getById = exports.create = exports.list = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Ticket_1 = __importDefault(require("../models/Ticket"));
const TicketReply_1 = __importDefault(require("../models/TicketReply"));
const TicketCategory_1 = __importDefault(require("../models/TicketCategory"));
const Activity_1 = __importDefault(require("../models/Activity"));
const appError_1 = __importDefault(require("../utils/appError"));
const User_1 = __importDefault(require("../models/User"));
const helpers_1 = require("../utils/helpers");
const toObjectId = (id) => mongoose_1.default.Types.ObjectId.createFromHexString(id);
const getNextTicketNumber = async (companyId) => {
    const lastTicket = await Ticket_1.default.findOne({ companyId }).sort({ createdAt: -1 }).select('ticketNumber');
    const lastNum = lastTicket ? parseInt(lastTicket.ticketNumber.split('-').pop() || '0', 10) || 0 : 0;
    return (0, helpers_1.generateCode)('TCK', lastNum + 1);
};
const calculateSLADeadline = async (categoryId, priority) => {
    if (!categoryId) {
        const slaMap = { LOW: 72, MEDIUM: 48, HIGH: 24, CRITICAL: 8 };
        const hours = slaMap[priority] || 48;
        return new Date(Date.now() + hours * 60 * 60 * 1000);
    }
    const category = await TicketCategory_1.default.findById(categoryId);
    if (category && category.slaHours) {
        return new Date(Date.now() + category.slaHours * 60 * 60 * 1000);
    }
    return null;
};
const logActivity = async ({ companyId, userId, action, details }) => {
    return Activity_1.default.create({
        type: 'NOTE',
        subject: `Ticket ${action}`,
        description: typeof details === 'string' ? details : JSON.stringify(details),
        companyId,
        createdBy: userId,
    });
};
const list = async (companyId, query = {}) => {
    const { status, priority, categoryId, assigneeId, reporterId, fromDate, toDate, search } = query;
    const filter = { companyId };
    if (status)
        filter.status = status;
    if (priority)
        filter.priority = priority;
    if (categoryId)
        filter.categoryId = categoryId;
    if (assigneeId)
        filter.assigneeId = assigneeId;
    if (reporterId)
        filter.reporterId = reporterId;
    if (fromDate || toDate) {
        filter.createdAt = {};
        if (fromDate)
            filter.createdAt.$gte = new Date(fromDate);
        if (toDate)
            filter.createdAt.$lte = new Date(toDate);
    }
    if (search) {
        const regex = new RegExp(search, 'i');
        filter.$or = [
            { title: regex },
            { ticketNumber: regex },
            { description: regex },
        ];
    }
    const { skip, limit: lim, page: p } = (0, helpers_1.paginateQuery)(query.page || "1", Number(query.limit || "20"));
    const [tickets, total] = await Promise.all([
        Ticket_1.default.find(filter)
            .populate('categoryId', 'name color')
            .populate('reporterId', 'name email avatar')
            .populate('assigneeId', 'name email avatar')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(lim),
        Ticket_1.default.countDocuments(filter),
    ]);
    return { data: tickets, meta: (0, helpers_1.buildMeta)(total, p, lim) };
};
exports.list = list;
const create = async (companyId, userId, data) => {
    const ticketNumber = await getNextTicketNumber(companyId);
    const slaDeadline = await calculateSLADeadline(data.categoryId, data.priority);
    const ticket = await Ticket_1.default.create({
        ...data,
        ticketNumber,
        slaDeadline,
        companyId,
        reporterId: userId,
    });
    return Ticket_1.default.findById(ticket._id)
        .populate('categoryId', 'name color')
        .populate('reporterId', 'name email avatar');
};
exports.create = create;
const getById = async (companyId, ticketId) => {
    const ticket = await Ticket_1.default.findOne({ _id: ticketId, companyId })
        .populate('categoryId', 'name color slaHours')
        .populate('reporterId', 'name email avatar')
        .populate('assigneeId', 'name email avatar');
    if (!ticket)
        throw new appError_1.default(404, 'NOT_FOUND', 'Ticket not found');
    const [replies, activities] = await Promise.all([
        TicketReply_1.default.find({ ticketId }).populate('userId', 'name email avatar').sort({ createdAt: 1 }),
        Activity_1.default.find({ companyId, $or: [{ ticketId: ticketId }, { description: new RegExp(ticketId, 'i') }] })
            .sort({ createdAt: -1 }).limit(50),
    ]);
    return { ...ticket.toJSON(), replies, activities };
};
exports.getById = getById;
const update = async (companyId, ticketId, data) => {
    const ticket = await Ticket_1.default.findOneAndUpdate({ _id: ticketId, companyId }, { $set: data }, { new: true, runValidators: true })
        .populate('categoryId', 'name color')
        .populate('reporterId', 'name email avatar')
        .populate('assigneeId', 'name email avatar');
    if (!ticket)
        throw new appError_1.default(404, 'NOT_FOUND', 'Ticket not found');
    return ticket;
};
exports.update = update;
const remove = async (companyId, ticketId) => {
    const ticket = await Ticket_1.default.findOneAndDelete({ _id: ticketId, companyId });
    if (!ticket)
        throw new appError_1.default(404, 'NOT_FOUND', 'Ticket not found');
    await TicketReply_1.default.deleteMany({ ticketId });
    return { success: true };
};
exports.remove = remove;
const reply = async (companyId, userId, ticketId, data) => {
    const ticket = await Ticket_1.default.findOne({ _id: ticketId, companyId });
    if (!ticket)
        throw new appError_1.default(404, 'NOT_FOUND', 'Ticket not found');
    if (!ticket.firstResponseAt && !data.isInternal) {
        await Ticket_1.default.findByIdAndUpdate(ticketId, { firstResponseAt: new Date() });
    }
    const replyDoc = await TicketReply_1.default.create({
        ...data,
        ticketId,
        userId,
    });
    return replyDoc.populate('userId', 'name email avatar');
};
exports.reply = reply;
const assign = async (companyId, userId, ticketId, assigneeId) => {
    const ticket = await Ticket_1.default.findOneAndUpdate({ _id: ticketId, companyId }, { assigneeId, status: 'ASSIGNED' }, { new: true, runValidators: true })
        .populate('assigneeId', 'name email avatar')
        .populate('reporterId', 'name email avatar');
    if (!ticket)
        throw new appError_1.default(404, 'NOT_FOUND', 'Ticket not found');
    await logActivity({
        ticketId,
        companyId,
        userId,
        action: 'ASSIGNED',
        details: `Ticket assigned to user ${assigneeId}`,
    });
    return ticket;
};
exports.assign = assign;
const changeStatus = async (companyId, userId, ticketId, status, resolution) => {
    const updateData = { status };
    if (resolution)
        updateData.resolution = resolution;
    if (status === 'RESOLVED')
        updateData.resolvedAt = new Date();
    if (status === 'CLOSED')
        updateData.closedAt = new Date();
    const ticket = await Ticket_1.default.findOneAndUpdate({ _id: ticketId, companyId }, { $set: updateData }, { new: true, runValidators: true })
        .populate('assigneeId', 'name email avatar')
        .populate('reporterId', 'name email avatar');
    if (!ticket)
        throw new appError_1.default(404, 'NOT_FOUND', 'Ticket not found');
    await logActivity({
        ticketId,
        companyId,
        userId,
        action: `STATUS_CHANGED_TO_${status}`,
        details: `Status changed to ${status}${resolution ? `: ${resolution}` : ''}`,
    });
    return ticket;
};
exports.changeStatus = changeStatus;
const changePriority = async (companyId, userId, ticketId, priority) => {
    const ticket = await Ticket_1.default.findOneAndUpdate({ _id: ticketId, companyId }, { priority }, { new: true, runValidators: true })
        .populate('assigneeId', 'name email avatar')
        .populate('reporterId', 'name email avatar');
    if (!ticket)
        throw new appError_1.default(404, 'NOT_FOUND', 'Ticket not found');
    await logActivity({
        ticketId,
        companyId,
        userId,
        action: 'PRIORITY_CHANGED',
        details: `Priority changed to ${priority}`,
    });
    return ticket;
};
exports.changePriority = changePriority;
const close = async (companyId, userId, ticketId, resolution) => {
    const updateData = { status: 'CLOSED', closedAt: new Date() };
    if (resolution)
        updateData.resolution = resolution;
    const ticket = await Ticket_1.default.findOneAndUpdate({ _id: ticketId, companyId }, { $set: updateData }, { new: true, runValidators: true })
        .populate('assigneeId', 'name email avatar')
        .populate('reporterId', 'name email avatar');
    if (!ticket)
        throw new appError_1.default(404, 'NOT_FOUND', 'Ticket not found');
    await logActivity({
        ticketId,
        companyId,
        userId,
        action: 'CLOSED',
        details: `Ticket closed${resolution ? `: ${resolution}` : ''}`,
    });
    return ticket;
};
exports.close = close;
const getAISummary = async (companyId, ticketId) => {
    const ticket = await Ticket_1.default.findOne({ _id: ticketId, companyId })
        .populate('categoryId', 'name')
        .populate('reporterId', 'name email')
        .populate('assigneeId', 'name email');
    if (!ticket)
        throw new appError_1.default(404, 'NOT_FOUND', 'Ticket not found');
    const replies = await TicketReply_1.default.find({ ticketId })
        .populate('userId', 'name email')
        .sort({ createdAt: 1 });
    const internalNotes = replies.filter(r => r.isInternal);
    const publicReplies = replies.filter(r => !r.isInternal);
    const summary = {
        overview: {
            ticketNumber: ticket.ticketNumber,
            title: ticket.title,
            status: ticket.status,
            priority: ticket.priority,
            category: ticket.categoryId?.name || 'Uncategorized',
            reporter: ticket.reporterId?.name || 'Unknown',
            assignee: ticket.assigneeId?.name || 'Unassigned',
            created: ticket.createdAt,
            slaDeadline: ticket.slaDeadline,
            slaBreached: ticket.slaDeadline && new Date() > ticket.slaDeadline,
        },
        conversation: {
            totalReplies: replies.length,
            publicReplies: publicReplies.length,
            internalNotes: internalNotes.length,
            lastActivity: replies.length > 0 ? replies[replies.length - 1].createdAt : ticket.createdAt,
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
exports.getAISummary = getAISummary;
const listCategories = async (companyId) => {
    return TicketCategory_1.default.find({ companyId }).sort({ name: 1 });
};
exports.listCategories = listCategories;
const createCategory = async (companyId, data) => {
    const existing = await TicketCategory_1.default.findOne({ companyId, name: data.name });
    if (existing)
        throw new appError_1.default(409, 'CONFLICT', 'Category name already exists for this company');
    const category = await TicketCategory_1.default.create({ ...data, companyId });
    return category;
};
exports.createCategory = createCategory;
const updateCategory = async (companyId, categoryId, data) => {
    const category = await TicketCategory_1.default.findOneAndUpdate({ _id: categoryId, companyId }, { $set: data }, { new: true, runValidators: true });
    if (!category)
        throw new appError_1.default(404, 'NOT_FOUND', 'Category not found');
    return category;
};
exports.updateCategory = updateCategory;
const removeCategory = async (companyId, categoryId) => {
    const ticketsUsing = await Ticket_1.default.countDocuments({ companyId, categoryId });
    if (ticketsUsing > 0) {
        throw new appError_1.default(400, 'BAD_REQUEST', `Cannot delete category: ${ticketsUsing} ticket(s) are using it`);
    }
    const category = await TicketCategory_1.default.findOneAndDelete({ _id: categoryId, companyId });
    if (!category)
        throw new appError_1.default(404, 'NOT_FOUND', 'Category not found');
    return { success: true };
};
exports.removeCategory = removeCategory;
const getSummary = async (companyId) => {
    const [totals, byPriority, byCategory, slaStats] = await Promise.all([
        Ticket_1.default.aggregate([
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
        Ticket_1.default.aggregate([
            { $match: { companyId: toObjectId(companyId) } },
            { $group: { _id: '$priority', count: { $sum: 1 } } },
        ]),
        Ticket_1.default.aggregate([
            { $match: { companyId: toObjectId(companyId) } },
            { $group: { _id: '$categoryId', count: { $sum: 1 } } },
        ]),
        Ticket_1.default.aggregate([
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
    const total = totals[0] || { total: 0, open: 0, resolved: 0, closed: 0 };
    const sla = slaStats[0] || { total: 0, breached: 0, avgResolutionMins: null };
    return {
        totals: {
            total: total.total,
            open: total.open,
            resolved: total.resolved,
            closed: total.closed,
        },
        byPriority: byPriority.reduce((acc, p) => ({ ...acc, [p._id]: p.count }), {}),
        byCategory: byCategory.reduce((acc, c) => ({ ...acc, [c._id]: c.count }), {}),
        sla: {
            total: sla.total,
            breached: sla.breached,
            complianceRate: sla.total > 0 ? Math.round(((sla.total - sla.breached) / sla.total) * 100) : null,
            avgResolutionMins: sla.avgResolutionMins ? Math.round(sla.avgResolutionMins) : null,
        },
    };
};
exports.getSummary = getSummary;
const getSLA = async (companyId) => {
    const [slaData, byPriority, byCategory] = await Promise.all([
        Ticket_1.default.aggregate([
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
        Ticket_1.default.aggregate([
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
        Ticket_1.default.aggregate([
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
    const overall = slaData[0] || { total: 0, breached: 0, met: 0 };
    return {
        overall: {
            total: overall.total,
            breached: overall.breached,
            met: overall.met,
            complianceRate: overall.total > 0 ? Math.round((overall.met / overall.total) * 100) : null,
        },
        byPriority: byPriority.map(p => ({
            priority: p._id,
            total: p.total,
            breached: p.breached,
            complianceRate: p.total > 0 ? Math.round(((p.total - p.breached) / p.total) * 100) : null,
        })),
        byCategory: byCategory.map(c => ({
            categoryId: c._id,
            total: c.total,
            breached: c.breached,
            complianceRate: c.total > 0 ? Math.round(((c.total - c.breached) / c.total) * 100) : null,
        })),
    };
};
exports.getSLA = getSLA;
const getAgentPerformance = async (companyId) => {
    const performance = await Ticket_1.default.aggregate([
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
    const userIds = performance.map(p => p._id);
    const users = await User_1.default.find({ _id: { $in: userIds } }).select('name email avatar');
    const userMap = users.reduce((acc, u) => {
        const id = String(u._id);
        acc[id] = { name: `${u.firstName} ${u.lastName}`.trim(), email: u.email, avatar: u.avatar };
        return acc;
    }, {});
    return performance.map(p => ({
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
exports.getAgentPerformance = getAgentPerformance;
//# sourceMappingURL=support.service.js.map