const Lead = require('../models/Lead');
const Contact = require('../models/Contact');
const Account = require('../models/Account');
const Deal = require('../models/Deal');
const DealContact = require('../models/DealContact');
const Activity = require('../models/Activity');
const AppError = require('../utils/appError');
const { paginateQuery, buildMeta, buildSearchQuery } = require('../utils/helpers');

// ─── Dashboard ────────────────────────────────────────────────────────────────
const getDashboard = async (companyId, from, to) => {
  const dateFilter = {};
  if (from || to) {
    dateFilter.createdAt = {};
    if (from) dateFilter.createdAt.$gte = new Date(from);
    if (to) dateFilter.createdAt.$lte = new Date(to);
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
    pipeline: dealStages.map(s => ({ stage: s._id, count: s.count, totalValue: s.totalValue })),
    recentActivities,
    recentLeads,
  };
};

// ─── Leads ────────────────────────────────────────────────────────────────────
const listLeads = async (companyId, query) => {
  const { page, limit, skip } = paginateQuery(query.page, query.limit);
  const filter = { companyId };

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

const createLead = async (companyId, body) => {
  const lead = await Lead.create({ ...body, companyId });
  return lead.toJSON();
};

const getLeadById = async (companyId, id) => {
  const lead = await Lead.findOne({ _id: id, companyId }).lean();
  if (!lead) throw new AppError(404, 'NOT_FOUND', 'Lead not found');

  const activities = await Activity.find({ leadId: id }).sort({ createdAt: -1 }).lean();
  const deal = lead.dealId ? await Deal.findById(lead.dealId).lean() : null;

  return { ...lead, activities, deal };
};

const updateLead = async (companyId, id, body) => {
  const lead = await Lead.findOneAndUpdate({ _id: id, companyId }, body, { new: true, runValidators: true });
  if (!lead) throw new AppError(404, 'NOT_FOUND', 'Lead not found');
  return lead.toJSON();
};

const removeLead = async (companyId, id) => {
  const lead = await Lead.findOneAndDelete({ _id: id, companyId });
  if (!lead) throw new AppError(404, 'NOT_FOUND', 'Lead not found');
  return lead;
};

const changeLeadStage = async (companyId, id, status) => {
  const update = { status };
  if (status === 'CONVERTED') update.convertedAt = new Date();
  const lead = await Lead.findOneAndUpdate({ _id: id, companyId }, update, { new: true, runValidators: true });
  if (!lead) throw new AppError(404, 'NOT_FOUND', 'Lead not found');
  return lead.toJSON();
};

const convertLead = async (companyId, userId, leadId, body) => {
  const lead = await Lead.findOne({ _id: leadId, companyId });
  if (!lead) throw new AppError(404, 'NOT_FOUND', 'Lead not found');
  if (lead.status === 'CONVERTED') throw new AppError(400, 'BAD_REQUEST', 'Lead already converted');

  let contactId = null;
  if (body.createContact && lead.email) {
    const contact = await Contact.create({
      firstName: lead.firstName || lead.title,
      lastName: lead.lastName,
      email: lead.email,
      phone: lead.phone,
      jobTitle: lead.jobTitle,
      companyId,
      accountId: body.accountId || null,
      ownerId: lead.ownerId,
    });
    contactId = contact._id;
  }

  const deal = await Deal.create({
    title: body.dealTitle || `Deal - ${lead.title}`,
    value: body.dealValue || 0,
    expectedCloseDate: body.expectedCloseDate || null,
    accountId: body.accountId || null,
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

const addLeadActivity = async (companyId, userId, leadId, body) => {
  const lead = await Lead.findOne({ _id: leadId, companyId });
  if (!lead) throw new AppError(404, 'NOT_FOUND', 'Lead not found');

  const activity = await Activity.create({ ...body, leadId, companyId, createdBy: userId });
  return activity.toJSON();
};

// ─── Contacts ─────────────────────────────────────────────────────────────────
const listContacts = async (companyId, query) => {
  const { page, limit, skip } = paginateQuery(query.page, query.limit);
  const filter = { companyId };

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

const createContact = async (companyId, body) => {
  const contact = await Contact.create({ ...body, companyId });
  return contact.toJSON();
};

const getContactById = async (companyId, id) => {
  const contact = await Contact.findOne({ _id: id, companyId }).lean();
  if (!contact) throw new AppError(404, 'NOT_FOUND', 'Contact not found');

  const dealIds = await DealContact.find({ contactId: id }).distinct('dealId');
const [deals, activities] = await Promise.all([
    Deal.find({ _id: { $in: dealIds }, companyId }).sort({ createdAt: -1 }).lean(),
    Activity.find({ contactId: id }).sort({ createdAt: -1 }).lean(),
  ]);

  return { ...contact, deals, activities };
};

const updateContact = async (companyId, id, body) => {
  const contact = await Contact.findOneAndUpdate({ _id: id, companyId }, body, { new: true, runValidators: true });
  if (!contact) throw new AppError(404, 'NOT_FOUND', 'Contact not found');
  return contact.toJSON();
};

const removeContact = async (companyId, id) => {
  await Activity.updateMany({ contactId: id }, { $set: { contactId: null } });
  const contact = await Contact.findOneAndDelete({ _id: id, companyId });
  if (!contact) throw new AppError(404, 'NOT_FOUND', 'Contact not found');
  return contact;
};

const mergeContacts = async (companyId, primaryId, duplicateIds) => {
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
      primary.tags = [...new Set([...primary.tags, ...dup.tags])];
    }
    if (dup.notes) primary.notes = primary.notes ? `${primary.notes}\n---\n${dup.notes}` : dup.notes;

    primary.tags = [...new Set([...primary.tags, ...dup.tags])];

    await DealContact.updateMany({ contactId: dup._id }, { $set: { contactId: primary._id } });
    await Activity.updateMany({ contactId: dup._id }, { $set: { contactId: primary._id } });
    await dup.deleteOne();
  }

  await primary.save();
  return primary.toJSON();
};

// ─── Accounts ─────────────────────────────────────────────────────────────────
const listAccounts = async (companyId, query) => {
  const { page, limit, skip } = paginateQuery(query.page, query.limit);
  const filter = { companyId };

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

const createAccount = async (companyId, body) => {
  const account = await Account.create({ ...body, companyId });
  return account.toJSON();
};

const getAccountById = async (companyId, id) => {
  const account = await Account.findOne({ _id: id, companyId }).lean();
  if (!account) throw new AppError(404, 'NOT_FOUND', 'Account not found');

  const [contacts, deals] = await Promise.all([
    Contact.find({ accountId: id }).sort({ createdAt: -1 }).lean(),
    Deal.find({ accountId: id }).sort({ createdAt: -1 }).lean(),
  ]);

  return { ...account, contacts, deals };
};

const updateAccount = async (companyId, id, body) => {
  const account = await Account.findOneAndUpdate({ _id: id, companyId }, body, { new: true, runValidators: true });
  if (!account) throw new AppError(404, 'NOT_FOUND', 'Account not found');
  return account.toJSON();
};

const removeAccount = async (companyId, id) => {
  await Contact.updateMany({ accountId: id }, { $set: { accountId: null } });
  await Deal.updateMany({ accountId: id }, { $set: { accountId: null } });
  const account = await Account.findOneAndDelete({ _id: id, companyId });
  if (!account) throw new AppError(404, 'NOT_FOUND', 'Account not found');
  return account;
};

// ─── Deals ────────────────────────────────────────────────────────────────────
const listDeals = async (companyId, query) => {
  const { page, limit, skip } = paginateQuery(query.page, query.limit);
  const filter = { companyId };

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

const createDeal = async (companyId, body) => {
  const deal = await Deal.create({ ...body, companyId });
  return deal.toJSON();
};

const getDealById = async (companyId, id) => {
  const deal = await Deal.findOne({ _id: id, companyId }).lean();
  if (!deal) throw new AppError(404, 'NOT_FOUND', 'Deal not found');

  const [contacts, activities] = await Promise.all([
    DealContact.find({ dealId: id }).populate('contactId').lean(),
    Activity.find({ dealId: id }).sort({ createdAt: -1 }).lean(),
  ]);

  return { ...deal, contacts, activities };
};

const updateDeal = async (companyId, id, body) => {
  const deal = await Deal.findOneAndUpdate({ _id: id, companyId }, body, { new: true, runValidators: true });
  if (!deal) throw new AppError(404, 'NOT_FOUND', 'Deal not found');
  return deal.toJSON();
};

const removeDeal = async (companyId, id) => {
  const deal = await Deal.findOne({ _id: id, companyId });
  if (!deal) throw new AppError(404, 'NOT_FOUND', 'Deal not found');
  deal.status = 'LOST';
  deal.stage = 'LOST';
  await deal.save();
  return deal.toJSON();
};

const changeDealStage = async (companyId, id, stage) => {
  const probabilityMap = { QUALIFICATION: 10, DEMO: 25, PROPOSAL: 50, NEGOTIATION: 75, WON: 100, LOST: 0 };
  const update = { stage, probability: probabilityMap[stage] || 0 };
  if (stage === 'WON') {
    update.status = 'WON';
    update.actualCloseDate = new Date();
  }
  if (stage === 'LOST') update.status = 'LOST';

  const deal = await Deal.findOneAndUpdate({ _id: id, companyId }, update, { new: true, runValidators: true });
  if (!deal) throw new AppError(404, 'NOT_FOUND', 'Deal not found');
  return deal.toJSON();
};

const closeWonDeal = async (companyId, id, body) => {
  const deal = await Deal.findOne({ _id: id, companyId });
  if (!deal) throw new AppError(404, 'NOT_FOUND', 'Deal not found');
  if (deal.status === 'WON') throw new AppError(400, 'BAD_REQUEST', 'Deal already won');
  if (deal.status === 'LOST') throw new AppError(400, 'BAD_REQUEST', 'Deal already lost');

  deal.status = 'WON';
  deal.stage = 'WON';
  deal.probability = 100;
  deal.actualCloseDate = body.actualCloseDate || new Date();
  deal.finalValue = body.finalValue ?? deal.value;
  if (body.notes) deal.notes = body.notes;
  await deal.save();
  return deal.toJSON();
};

const closeLostDeal = async (companyId, id, body) => {
  const deal = await Deal.findOne({ _id: id, companyId });
  if (!deal) throw new AppError(404, 'NOT_FOUND', 'Deal not found');
  if (deal.status === 'LOST') throw new AppError(400, 'BAD_REQUEST', 'Deal already lost');
  if (deal.status === 'WON') throw new AppError(400, 'BAD_REQUEST', 'Deal already won');

  deal.status = 'LOST';
  deal.stage = 'LOST';
  deal.probability = 0;
  deal.lostReason = body.reason || '';
  if (body.notes) deal.notes = body.notes;
  await deal.save();
  return deal.toJSON();
};

// ─── Pipeline ─────────────────────────────────────────────────────────────────
const getPipeline = async (companyId) => {
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
    wonValue: deals.filter(d => d.status === 'WON').reduce((sum, d) => sum + (d.finalValue || d.value || 0), 0),
  };

  return { pipeline, summary };
};

const reorderPipeline = async (companyId, dealId, stage, position) => {
  const deal = await Deal.findOne({ _id: dealId, companyId });
  if (!deal) throw new AppError(404, 'NOT_FOUND', 'Deal not found');

  deal.stage = stage;
  deal.position = position;
  await deal.save();
  return deal.toJSON();
};

// ─── Activities ───────────────────────────────────────────────────────────────
const listActivities = async (companyId, query) => {
  const { page, limit, skip } = paginateQuery(query.page, query.limit);
  const filter = { companyId };

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

const createActivity = async (companyId, userId, body) => {
  const activity = await Activity.create({ ...body, companyId, createdBy: userId });
  return activity.toJSON();
};

const updateActivity = async (companyId, id, body) => {
  const activity = await Activity.findOneAndUpdate({ _id: id, companyId }, body, { new: true, runValidators: true });
  if (!activity) throw new AppError(404, 'NOT_FOUND', 'Activity not found');
  return activity.toJSON();
};

const removeActivity = async (companyId, id) => {
  const activity = await Activity.findOneAndDelete({ _id: id, companyId });
  if (!activity) throw new AppError(404, 'NOT_FOUND', 'Activity not found');
  return activity;
};

module.exports = {
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
