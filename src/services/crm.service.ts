import Lead from '../models/Lead';
import Contact from '../models/Contact';
import Account from '../models/Account';
import Deal from '../models/Deal';
import DealContact from '../models/DealContact';
import Activity from '../models/Activity';
import AppError from '../utils/appError';
import { paginateQuery, buildMeta, buildSearchQuery } from '../utils/helpers';

interface QueryParams {
  page?: string;
  limit?: string;
  search?: string;
  status?: string;
  source?: string;
  ownerId?: string;
  tag?: string;
  stage?: string;
  accountId?: string;
  type?: string;
  leadId?: string;
  dealId?: string;
  contactId?: string;
  assignedToId?: string;
  isCompleted?: string;
  industry?: string;
}

const getDashboard = async (companyId: string, from: string | undefined, to: string | undefined) => {
  const dateFilter: Record<string, unknown> = {};
  if (from || to) {
    dateFilter.createdAt = {};
    if (from) (dateFilter.createdAt as Record<string, unknown>).$gte = new Date(from);
    if (to) (dateFilter.createdAt as Record<string, unknown>).$lte = new Date(to);
  }

  const baseFilter = { companyId, ...dateFilter };
  const pipelineFilter = { companyId };

  const [
    totalLeads,
    totalContacts,
    totalAccounts,
    totalDeals,
    wonDeals,
    lostDeals,
    openDeals,
    dealStages,
    recentActivities,
    recentLeads,
  ] = await Promise.all([
    Lead.countDocuments(baseFilter),
    Contact.countDocuments(baseFilter),
    Account.countDocuments(baseFilter),
    Deal.countDocuments(pipelineFilter),
    Deal.countDocuments({ companyId, status: 'WON', ...(from || to ? { ...dateFilter } : {}) }),
    Deal.countDocuments({ companyId, status: 'LOST', ...(from || to ? { ...dateFilter } : {}) }),
    Deal.countDocuments({ companyId, status: 'OPEN' }),
    Deal.aggregate([
      { $match: { companyId: companyId, status: { $ne: 'LOST' } } },
      { $group: { _id: '$stage', count: { $sum: 1 }, totalValue: { $sum: '$value' } } },
      { $sort: { _id: 1 } },
    ]),
    Activity.find({ companyId }).sort({ createdAt: -1 }).limit(10).lean(),
    Lead.find(baseFilter).sort({ createdAt: -1 }).limit(5).lean(),
  ]);

  return {
    stats: {
      leads: totalLeads,
      contacts: totalContacts,
      accounts: totalAccounts,
      deals: totalDeals,
      wonDeals,
      lostDeals,
      openDeals,
    },
    pipeline: (dealStages as { _id: string; count: number; totalValue: number }[]).map(s => ({ stage: s._id, count: s.count, totalValue: s.totalValue })),
    recentActivities,
    recentLeads,
  };
};

const listLeads = async (companyId: string, query: QueryParams) => {
  const { page, limit, skip } = paginateQuery(query.page, Number(query.limit));
  const filter: Record<string, unknown> = { companyId };

  if (query.status) filter.status = query.status;
  if (query.source) filter.source = query.source;
  if (query.ownerId) filter.ownerId = query.ownerId;
  if (query.search) Object.assign(filter, buildSearchQuery(query.search, ['title', 'firstName', 'lastName', 'email', 'company', 'phone']));
  if (query.tag) filter.tags = query.tag;

  const [data, total] = await Promise.all([
    Lead.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Lead.countDocuments(filter),
  ]);

  return { data, meta: buildMeta(total, page, limit) };
};

const createLead = async (companyId: string, body: Record<string, unknown>) => {
  const lead = await Lead.create({ ...body, companyId });
  return lead.toJSON();
};

const getLeadById = async (companyId: string, id: string): Promise<any> => {
  const lead = await Lead.findOne({ _id: id, companyId }).lean();
  if (!lead) throw new AppError(404, 'NOT_FOUND', 'Lead not found');

  const activities = await Activity.find({ leadId: id }).sort({ createdAt: -1 }).lean();
  const deal = (lead as Record<string, unknown>).dealId ? await Deal.findById((lead as Record<string, unknown>).dealId).lean() : null;

  return { ...lead, activities, deal };
};

const updateLead = async (companyId: string, id: string, body: Record<string, unknown>) => {
  const lead = await Lead.findOneAndUpdate({ _id: id, companyId }, body, { new: true, runValidators: true });
  if (!lead) throw new AppError(404, 'NOT_FOUND', 'Lead not found');
  return lead.toJSON();
};

const removeLead = async (companyId: string, id: string) => {
  const lead = await Lead.findOneAndDelete({ _id: id, companyId });
  if (!lead) throw new AppError(404, 'NOT_FOUND', 'Lead not found');
  return lead;
};

const changeLeadStage = async (companyId: string, id: string, status: string) => {
  const update: Record<string, unknown> = { status };
  if (status === 'CONVERTED') update.convertedAt = new Date();
  const lead = await Lead.findOneAndUpdate({ _id: id, companyId }, update, { new: true, runValidators: true });
  if (!lead) throw new AppError(404, 'NOT_FOUND', 'Lead not found');
  return lead.toJSON();
};

const convertLead = async (companyId: string, _userId: string, leadId: string, body: Record<string, unknown>) => {
  const lead = await Lead.findOne({ _id: leadId, companyId });
  if (!lead) throw new AppError(404, 'NOT_FOUND', 'Lead not found');
  if (lead.status === 'CONVERTED') throw new AppError(400, 'BAD_REQUEST', 'Lead already converted');

  let contactId: string | null = null;
  if (body.createContact && lead.email) {
    const contact = await Contact.create({
      firstName: lead.firstName || lead.title,
      lastName: lead.lastName,
      email: lead.email,
      phone: lead.phone,
      jobTitle: lead.jobTitle,
      companyId,
      accountId: (body.accountId as string) || null,
      ownerId: lead.ownerId,
    });
    contactId = String(contact._id);
  }

  const deal = await Deal.create({
    title: (body.dealTitle as string) || `Deal - ${lead.title}`,
    value: (body.dealValue as number) || 0,
    expectedCloseDate: (body.expectedCloseDate as Date) || null,
    accountId: (body.accountId as string) || null,
    leadId: lead._id,
    companyId,
    ownerId: lead.ownerId,
    stage: 'QUALIFICATION',
  });

  if (contactId) {
    await DealContact.create({ dealId: deal._id, contactId });
  }

  lead.status = 'CONVERTED';
  lead.convertedAt = new Date();
  lead.dealId = deal._id;
  await lead.save();

  return { lead: lead.toJSON(), deal: deal.toJSON() };
};

const addLeadActivity = async (companyId: string, userId: string, leadId: string, body: Record<string, unknown>) => {
  const lead = await Lead.findOne({ _id: leadId, companyId });
  if (!lead) throw new AppError(404, 'NOT_FOUND', 'Lead not found');

  const activity = await Activity.create({ ...body, leadId, companyId, createdBy: userId });
  return activity.toJSON();
};

const listContacts = async (companyId: string, query: QueryParams) => {
  const { page, limit, skip } = paginateQuery(query.page, Number(query.limit));
  const filter: Record<string, unknown> = { companyId };

  if (query.accountId) filter.accountId = query.accountId;
  if (query.ownerId) filter.ownerId = query.ownerId;
  if (query.search) Object.assign(filter, buildSearchQuery(query.search, ['firstName', 'lastName', 'email', 'phone']));
  if (query.tag) filter.tags = query.tag;

  const [data, total] = await Promise.all([
    Contact.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Contact.countDocuments(filter),
  ]);

  return { data, meta: buildMeta(total, page, limit) };
};

const createContact = async (companyId: string, body: Record<string, unknown>) => {
  const contact = await Contact.create({ ...body, companyId });
  return contact.toJSON();
};

const getContactById = async (companyId: string, id: string): Promise<any> => {
  const contact = await Contact.findOne({ _id: id, companyId }).lean();
  if (!contact) throw new AppError(404, 'NOT_FOUND', 'Contact not found');

  const dealIds = await DealContact.find({ contactId: id }).distinct('dealId');
  const [deals, activities] = await Promise.all([
    Deal.find({ _id: { $in: dealIds }, companyId }).sort({ createdAt: -1 }).lean(),
    Activity.find({ contactId: id }).sort({ createdAt: -1 }).lean(),
  ]);

  return { ...contact, deals, activities };
};

const updateContact = async (companyId: string, id: string, body: Record<string, unknown>) => {
  const contact = await Contact.findOneAndUpdate({ _id: id, companyId }, body, { new: true, runValidators: true });
  if (!contact) throw new AppError(404, 'NOT_FOUND', 'Contact not found');
  return contact.toJSON();
};

const removeContact = async (companyId: string, id: string) => {
  await Activity.updateMany({ contactId: id }, { $set: { contactId: null } });
  const contact = await Contact.findOneAndDelete({ _id: id, companyId });
  if (!contact) throw new AppError(404, 'NOT_FOUND', 'Contact not found');
  return contact;
};

const mergeContacts = async (companyId: string, primaryId: string, duplicateIds: string[]) => {
  const primary = await Contact.findOne({ _id: primaryId, companyId });
  if (!primary) throw new AppError(404, 'NOT_FOUND', 'Primary contact not found');

  const duplicates = await Contact.find({ _id: { $in: duplicateIds }, companyId });
  if (duplicates.length !== duplicateIds.length) throw new AppError(404, 'NOT_FOUND', 'One or more duplicate contacts not found');

  for (const dup of duplicates) {
    if (!primary.email && dup.email) primary.email = dup.email;
    if (!primary.phone && dup.phone) primary.phone = dup.phone;
    if (!primary.mobile && dup.mobile) primary.mobile = dup.mobile;
    if (!primary.jobTitle && dup.jobTitle) primary.jobTitle = dup.jobTitle;
    if (!primary.department && dup.department) primary.department = dup.department;
    if (dup.tags && dup.tags.length) {
    primary.tags = [...new Set([...(primary.tags || []), ...(dup.tags || [])])];
    }
    if (dup.notes) primary.notes = primary.notes ? `${primary.notes}\n---\n${dup.notes}` : dup.notes;

    primary.tags = [...new Set([...(primary.tags || []), ...(dup.tags || [])])];

    await DealContact.updateMany({ contactId: dup._id }, { $set: { contactId: primary._id } });
    await Activity.updateMany({ contactId: dup._id }, { $set: { contactId: primary._id } });
    await dup.deleteOne();
  }

  await primary.save();
  return primary.toJSON();
};

const listAccounts = async (companyId: string, query: QueryParams) => {
  const { page, limit, skip } = paginateQuery(query.page, Number(query.limit));
  const filter: Record<string, unknown> = { companyId };

  if (query.industry) filter.industry = query.industry;
  if (query.ownerId) filter.ownerId = query.ownerId;
  if (query.search) Object.assign(filter, buildSearchQuery(query.search, ['name', 'email', 'phone', 'website']));
  if (query.tag) filter.tags = query.tag;

  const [data, total] = await Promise.all([
    Account.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Account.countDocuments(filter),
  ]);

  return { data, meta: buildMeta(total, page, limit) };
};

const createAccount = async (companyId: string, body: Record<string, unknown>) => {
  const account = await Account.create({ ...body, companyId });
  return account.toJSON();
};

const getAccountById = async (companyId: string, id: string): Promise<any> => {
  const account = await Account.findOne({ _id: id, companyId }).lean();
  if (!account) throw new AppError(404, 'NOT_FOUND', 'Account not found');

  const [contacts, deals] = await Promise.all([
    Contact.find({ accountId: id }).sort({ createdAt: -1 }).lean(),
    Deal.find({ accountId: id }).sort({ createdAt: -1 }).lean(),
  ]);

  return { ...account, contacts, deals };
};

const updateAccount = async (companyId: string, id: string, body: Record<string, unknown>) => {
  const account = await Account.findOneAndUpdate({ _id: id, companyId }, body, { new: true, runValidators: true });
  if (!account) throw new AppError(404, 'NOT_FOUND', 'Account not found');
  return account.toJSON();
};

const removeAccount = async (companyId: string, id: string) => {
  await Contact.updateMany({ accountId: id }, { $set: { accountId: null } });
  await Deal.updateMany({ accountId: id }, { $set: { accountId: null } });
  const account = await Account.findOneAndDelete({ _id: id, companyId });
  if (!account) throw new AppError(404, 'NOT_FOUND', 'Account not found');
  return account;
};

const listDeals = async (companyId: string, query: QueryParams) => {
  const { page, limit, skip } = paginateQuery(query.page, Number(query.limit));
  const filter: Record<string, unknown> = { companyId };

  if (query.stage) filter.stage = query.stage;
  if (query.status) filter.status = query.status;
  if (query.accountId) filter.accountId = query.accountId;
  if (query.ownerId) filter.ownerId = query.ownerId;
  if (query.search) Object.assign(filter, buildSearchQuery(query.search, ['title', 'notes']));
  if (query.tag) filter.tags = query.tag;

  const [data, total] = await Promise.all([
    Deal.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Deal.countDocuments(filter),
  ]);

  return { data, meta: buildMeta(total, page, limit) };
};

const createDeal = async (companyId: string, body: Record<string, unknown>) => {
  const deal = await Deal.create({ ...body, companyId });
  return deal.toJSON();
};

const getDealById = async (companyId: string, id: string): Promise<any> => {
  const deal = await Deal.findOne({ _id: id, companyId }).lean();
  if (!deal) throw new AppError(404, 'NOT_FOUND', 'Deal not found');

  const [contacts, activities] = await Promise.all([
    DealContact.find({ dealId: id }).populate('contactId').lean(),
    Activity.find({ dealId: id }).sort({ createdAt: -1 }).lean(),
  ]);

  return { ...deal, contacts, activities };
};

const updateDeal = async (companyId: string, id: string, body: Record<string, unknown>) => {
  const deal = await Deal.findOneAndUpdate({ _id: id, companyId }, body, { new: true, runValidators: true });
  if (!deal) throw new AppError(404, 'NOT_FOUND', 'Deal not found');
  return deal.toJSON();
};

const removeDeal = async (companyId: string, id: string) => {
  const deal = await Deal.findOne({ _id: id, companyId });
  if (!deal) throw new AppError(404, 'NOT_FOUND', 'Deal not found');
  deal.status = 'LOST';
  deal.stage = 'LOST';
  await deal.save();
  return deal.toJSON();
};

const changeDealStage = async (companyId: string, id: string, stage: string) => {
  const probabilityMap: Record<string, number> = { QUALIFICATION: 10, DEMO: 25, PROPOSAL: 50, NEGOTIATION: 75, WON: 100, LOST: 0 };
  const update: Record<string, unknown> = { stage, probability: probabilityMap[stage] || 0 };
  if (stage === 'WON') {
    update.status = 'WON';
    update.actualCloseDate = new Date();
  }
  if (stage === 'LOST') update.status = 'LOST';

  const deal = await Deal.findOneAndUpdate({ _id: id, companyId }, update, { new: true, runValidators: true });
  if (!deal) throw new AppError(404, 'NOT_FOUND', 'Deal not found');
  return deal.toJSON();
};

const closeWonDeal = async (companyId: string, id: string, body: Record<string, unknown>) => {
  const deal = await Deal.findOne({ _id: id, companyId });
  if (!deal) throw new AppError(404, 'NOT_FOUND', 'Deal not found');
  if (deal.status === 'WON') throw new AppError(400, 'BAD_REQUEST', 'Deal already won');
  if (deal.status === 'LOST') throw new AppError(400, 'BAD_REQUEST', 'Deal already lost');

  deal.status = 'WON';
  deal.stage = 'WON';
  deal.probability = 100;
  deal.actualCloseDate = (body.actualCloseDate as Date) || new Date();
  deal.finalValue = (body.finalValue as number) ?? deal.value;
  if (body.notes) deal.notes = body.notes as string;
  await deal.save();
  return deal.toJSON();
};

const closeLostDeal = async (companyId: string, id: string, body: Record<string, unknown>) => {
  const deal = await Deal.findOne({ _id: id, companyId });
  if (!deal) throw new AppError(404, 'NOT_FOUND', 'Deal not found');
  if (deal.status === 'LOST') throw new AppError(400, 'BAD_REQUEST', 'Deal already lost');
  if (deal.status === 'WON') throw new AppError(400, 'BAD_REQUEST', 'Deal already won');

  deal.status = 'LOST';
  deal.stage = 'LOST';
  deal.probability = 0;
  deal.lostReason = (body.reason as string) || '';
  if (body.notes) deal.notes = body.notes as string;
  await deal.save();
  return deal.toJSON();
};

const getPipeline = async (companyId: string) => {
  const stages = ['QUALIFICATION', 'DEMO', 'PROPOSAL', 'NEGOTIATION', 'WON', 'LOST'];

  const deals = await Deal.find({ companyId }).sort({ position: 1 }).lean();

  const pipeline = stages.map(stage => ({
    stage,
    deals: deals.filter(d => d.stage === stage),
    totalValue: deals.filter(d => d.stage === stage).reduce((sum, d) => sum + (d.value || 0), 0),
    count: deals.filter(d => d.stage === stage).length,
  }));

  const summary = {
    totalDeals: deals.length,
    totalValue: deals.reduce((sum, d) => sum + (d.value || 0), 0),
    wonValue: deals.filter(d => d.status === 'WON').reduce((sum, d) => sum + ((d as Record<string, unknown>).finalValue as number || d.value || 0), 0),
  };

  return { pipeline, summary };
};

const reorderPipeline = async (companyId: string, dealId: string, stage: string, position: number) => {
  const deal = await Deal.findOne({ _id: dealId, companyId });
  if (!deal) throw new AppError(404, 'NOT_FOUND', 'Deal not found');

  deal.stage = stage;
  deal.position = position;
  await deal.save();
  return deal.toJSON();
};

const listActivities = async (companyId: string, query: QueryParams) => {
  const { page, limit, skip } = paginateQuery(query.page, Number(query.limit));
  const filter: Record<string, unknown> = { companyId };

  if (query.type) filter.type = query.type;
  if (query.leadId) filter.leadId = query.leadId;
  if (query.dealId) filter.dealId = query.dealId;
  if (query.contactId) filter.contactId = query.contactId;
  if (query.assignedToId) filter.assignedToId = query.assignedToId;
  if (query.isCompleted !== undefined) filter.isCompleted = query.isCompleted === 'true';

  const [data, total] = await Promise.all([
    Activity.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Activity.countDocuments(filter),
  ]);

  return { data, meta: buildMeta(total, page, limit) };
};

const createActivity = async (companyId: string, userId: string, body: Record<string, unknown>) => {
  const activity = await Activity.create({ ...body, companyId, createdBy: userId });
  return activity.toJSON();
};

const updateActivity = async (companyId: string, id: string, body: Record<string, unknown>) => {
  const activity = await Activity.findOneAndUpdate({ _id: id, companyId }, body, { new: true, runValidators: true });
  if (!activity) throw new AppError(404, 'NOT_FOUND', 'Activity not found');
  return activity.toJSON();
};

const removeActivity = async (companyId: string, id: string) => {
  const activity = await Activity.findOneAndDelete({ _id: id, companyId });
  if (!activity) throw new AppError(404, 'NOT_FOUND', 'Activity not found');
  return activity;
};

export {
  getDashboard,
  listLeads,
  createLead,
  getLeadById,
  updateLead,
  removeLead,
  changeLeadStage,
  convertLead,
  addLeadActivity,
  listContacts,
  createContact,
  getContactById,
  updateContact,
  removeContact,
  mergeContacts,
  listAccounts,
  createAccount,
  getAccountById,
  updateAccount,
  removeAccount,
  listDeals,
  createDeal,
  getDealById,
  updateDeal,
  removeDeal,
  changeDealStage,
  closeWonDeal,
  closeLostDeal,
  getPipeline,
  reorderPipeline,
  listActivities,
  createActivity,
  updateActivity,
  removeActivity,
};
