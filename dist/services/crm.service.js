"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeActivity = exports.updateActivity = exports.createActivity = exports.listActivities = exports.reorderPipeline = exports.getPipeline = exports.closeLostDeal = exports.closeWonDeal = exports.changeDealStage = exports.removeDeal = exports.updateDeal = exports.getDealById = exports.createDeal = exports.listDeals = exports.removeAccount = exports.updateAccount = exports.getAccountById = exports.createAccount = exports.listAccounts = exports.mergeContacts = exports.removeContact = exports.updateContact = exports.getContactById = exports.createContact = exports.listContacts = exports.addLeadActivity = exports.convertLead = exports.changeLeadStage = exports.removeLead = exports.updateLead = exports.getLeadById = exports.createLead = exports.listLeads = exports.getDashboard = void 0;
const Lead_1 = __importDefault(require("../models/Lead"));
const Contact_1 = __importDefault(require("../models/Contact"));
const Account_1 = __importDefault(require("../models/Account"));
const Deal_1 = __importDefault(require("../models/Deal"));
const DealContact_1 = __importDefault(require("../models/DealContact"));
const Activity_1 = __importDefault(require("../models/Activity"));
const appError_1 = __importDefault(require("../utils/appError"));
const helpers_1 = require("../utils/helpers");
const getDashboard = async (companyId, from, to) => {
    const dateFilter = {};
    if (from || to) {
        dateFilter.createdAt = {};
        if (from)
            dateFilter.createdAt.$gte = new Date(from);
        if (to)
            dateFilter.createdAt.$lte = new Date(to);
    }
    const baseFilter = { companyId, ...dateFilter };
    const pipelineFilter = { companyId };
    const [totalLeads, totalContacts, totalAccounts, totalDeals, wonDeals, lostDeals, openDeals, dealStages, recentActivities, recentLeads,] = await Promise.all([
        Lead_1.default.countDocuments(baseFilter),
        Contact_1.default.countDocuments(baseFilter),
        Account_1.default.countDocuments(baseFilter),
        Deal_1.default.countDocuments(pipelineFilter),
        Deal_1.default.countDocuments({ companyId, status: 'WON', ...(from || to ? { ...dateFilter } : {}) }),
        Deal_1.default.countDocuments({ companyId, status: 'LOST', ...(from || to ? { ...dateFilter } : {}) }),
        Deal_1.default.countDocuments({ companyId, status: 'OPEN' }),
        Deal_1.default.aggregate([
            { $match: { companyId: companyId, status: { $ne: 'LOST' } } },
            { $group: { _id: '$stage', count: { $sum: 1 }, totalValue: { $sum: '$value' } } },
            { $sort: { _id: 1 } },
        ]),
        Activity_1.default.find({ companyId }).sort({ createdAt: -1 }).limit(10).lean(),
        Lead_1.default.find(baseFilter).sort({ createdAt: -1 }).limit(5).lean(),
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
exports.getDashboard = getDashboard;
const listLeads = async (companyId, query) => {
    const { page, limit, skip } = (0, helpers_1.paginateQuery)(query.page, Number(query.limit));
    const filter = { companyId };
    if (query.status)
        filter.status = query.status;
    if (query.source)
        filter.source = query.source;
    if (query.ownerId)
        filter.ownerId = query.ownerId;
    if (query.search)
        Object.assign(filter, (0, helpers_1.buildSearchQuery)(query.search, ['title', 'firstName', 'lastName', 'email', 'company', 'phone']));
    if (query.tag)
        filter.tags = query.tag;
    const [data, total] = await Promise.all([
        Lead_1.default.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
        Lead_1.default.countDocuments(filter),
    ]);
    return { data, meta: (0, helpers_1.buildMeta)(total, page, limit) };
};
exports.listLeads = listLeads;
const createLead = async (companyId, body) => {
    const lead = await Lead_1.default.create({ ...body, companyId });
    return lead.toJSON();
};
exports.createLead = createLead;
const getLeadById = async (companyId, id) => {
    const lead = await Lead_1.default.findOne({ _id: id, companyId }).lean();
    if (!lead)
        throw new appError_1.default(404, 'NOT_FOUND', 'Lead not found');
    const activities = await Activity_1.default.find({ leadId: id }).sort({ createdAt: -1 }).lean();
    const deal = lead.dealId ? await Deal_1.default.findById(lead.dealId).lean() : null;
    return { ...lead, activities, deal };
};
exports.getLeadById = getLeadById;
const updateLead = async (companyId, id, body) => {
    const lead = await Lead_1.default.findOneAndUpdate({ _id: id, companyId }, body, { new: true, runValidators: true });
    if (!lead)
        throw new appError_1.default(404, 'NOT_FOUND', 'Lead not found');
    return lead.toJSON();
};
exports.updateLead = updateLead;
const removeLead = async (companyId, id) => {
    const lead = await Lead_1.default.findOneAndDelete({ _id: id, companyId });
    if (!lead)
        throw new appError_1.default(404, 'NOT_FOUND', 'Lead not found');
    return lead;
};
exports.removeLead = removeLead;
const changeLeadStage = async (companyId, id, status) => {
    const update = { status };
    if (status === 'CONVERTED')
        update.convertedAt = new Date();
    const lead = await Lead_1.default.findOneAndUpdate({ _id: id, companyId }, update, { new: true, runValidators: true });
    if (!lead)
        throw new appError_1.default(404, 'NOT_FOUND', 'Lead not found');
    return lead.toJSON();
};
exports.changeLeadStage = changeLeadStage;
const convertLead = async (companyId, _userId, leadId, body) => {
    const lead = await Lead_1.default.findOne({ _id: leadId, companyId });
    if (!lead)
        throw new appError_1.default(404, 'NOT_FOUND', 'Lead not found');
    if (lead.status === 'CONVERTED')
        throw new appError_1.default(400, 'BAD_REQUEST', 'Lead already converted');
    let contactId = null;
    if (body.createContact && lead.email) {
        const contact = await Contact_1.default.create({
            firstName: lead.firstName || lead.title,
            lastName: lead.lastName,
            email: lead.email,
            phone: lead.phone,
            jobTitle: lead.jobTitle,
            companyId,
            accountId: body.accountId || null,
            ownerId: lead.ownerId,
        });
        contactId = String(contact._id);
    }
    const deal = await Deal_1.default.create({
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
        await DealContact_1.default.create({ dealId: deal._id, contactId });
    }
    lead.status = 'CONVERTED';
    lead.convertedAt = new Date();
    lead.dealId = deal._id;
    await lead.save();
    return { lead: lead.toJSON(), deal: deal.toJSON() };
};
exports.convertLead = convertLead;
const addLeadActivity = async (companyId, userId, leadId, body) => {
    const lead = await Lead_1.default.findOne({ _id: leadId, companyId });
    if (!lead)
        throw new appError_1.default(404, 'NOT_FOUND', 'Lead not found');
    const activity = await Activity_1.default.create({ ...body, leadId, companyId, createdBy: userId });
    return activity.toJSON();
};
exports.addLeadActivity = addLeadActivity;
const listContacts = async (companyId, query) => {
    const { page, limit, skip } = (0, helpers_1.paginateQuery)(query.page, Number(query.limit));
    const filter = { companyId };
    if (query.accountId)
        filter.accountId = query.accountId;
    if (query.ownerId)
        filter.ownerId = query.ownerId;
    if (query.search)
        Object.assign(filter, (0, helpers_1.buildSearchQuery)(query.search, ['firstName', 'lastName', 'email', 'phone']));
    if (query.tag)
        filter.tags = query.tag;
    const [data, total] = await Promise.all([
        Contact_1.default.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
        Contact_1.default.countDocuments(filter),
    ]);
    return { data, meta: (0, helpers_1.buildMeta)(total, page, limit) };
};
exports.listContacts = listContacts;
const createContact = async (companyId, body) => {
    const contact = await Contact_1.default.create({ ...body, companyId });
    return contact.toJSON();
};
exports.createContact = createContact;
const getContactById = async (companyId, id) => {
    const contact = await Contact_1.default.findOne({ _id: id, companyId }).lean();
    if (!contact)
        throw new appError_1.default(404, 'NOT_FOUND', 'Contact not found');
    const dealIds = await DealContact_1.default.find({ contactId: id }).distinct('dealId');
    const [deals, activities] = await Promise.all([
        Deal_1.default.find({ _id: { $in: dealIds }, companyId }).sort({ createdAt: -1 }).lean(),
        Activity_1.default.find({ contactId: id }).sort({ createdAt: -1 }).lean(),
    ]);
    return { ...contact, deals, activities };
};
exports.getContactById = getContactById;
const updateContact = async (companyId, id, body) => {
    const contact = await Contact_1.default.findOneAndUpdate({ _id: id, companyId }, body, { new: true, runValidators: true });
    if (!contact)
        throw new appError_1.default(404, 'NOT_FOUND', 'Contact not found');
    return contact.toJSON();
};
exports.updateContact = updateContact;
const removeContact = async (companyId, id) => {
    await Activity_1.default.updateMany({ contactId: id }, { $set: { contactId: null } });
    const contact = await Contact_1.default.findOneAndDelete({ _id: id, companyId });
    if (!contact)
        throw new appError_1.default(404, 'NOT_FOUND', 'Contact not found');
    return contact;
};
exports.removeContact = removeContact;
const mergeContacts = async (companyId, primaryId, duplicateIds) => {
    const primary = await Contact_1.default.findOne({ _id: primaryId, companyId });
    if (!primary)
        throw new appError_1.default(404, 'NOT_FOUND', 'Primary contact not found');
    const duplicates = await Contact_1.default.find({ _id: { $in: duplicateIds }, companyId });
    if (duplicates.length !== duplicateIds.length)
        throw new appError_1.default(404, 'NOT_FOUND', 'One or more duplicate contacts not found');
    for (const dup of duplicates) {
        if (!primary.email && dup.email)
            primary.email = dup.email;
        if (!primary.phone && dup.phone)
            primary.phone = dup.phone;
        if (!primary.mobile && dup.mobile)
            primary.mobile = dup.mobile;
        if (!primary.jobTitle && dup.jobTitle)
            primary.jobTitle = dup.jobTitle;
        if (!primary.department && dup.department)
            primary.department = dup.department;
        if (dup.tags && dup.tags.length) {
            primary.tags = [...new Set([...(primary.tags || []), ...(dup.tags || [])])];
        }
        if (dup.notes)
            primary.notes = primary.notes ? `${primary.notes}\n---\n${dup.notes}` : dup.notes;
        primary.tags = [...new Set([...(primary.tags || []), ...(dup.tags || [])])];
        await DealContact_1.default.updateMany({ contactId: dup._id }, { $set: { contactId: primary._id } });
        await Activity_1.default.updateMany({ contactId: dup._id }, { $set: { contactId: primary._id } });
        await dup.deleteOne();
    }
    await primary.save();
    return primary.toJSON();
};
exports.mergeContacts = mergeContacts;
const listAccounts = async (companyId, query) => {
    const { page, limit, skip } = (0, helpers_1.paginateQuery)(query.page, Number(query.limit));
    const filter = { companyId };
    if (query.industry)
        filter.industry = query.industry;
    if (query.ownerId)
        filter.ownerId = query.ownerId;
    if (query.search)
        Object.assign(filter, (0, helpers_1.buildSearchQuery)(query.search, ['name', 'email', 'phone', 'website']));
    if (query.tag)
        filter.tags = query.tag;
    const [data, total] = await Promise.all([
        Account_1.default.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
        Account_1.default.countDocuments(filter),
    ]);
    return { data, meta: (0, helpers_1.buildMeta)(total, page, limit) };
};
exports.listAccounts = listAccounts;
const createAccount = async (companyId, body) => {
    const account = await Account_1.default.create({ ...body, companyId });
    return account.toJSON();
};
exports.createAccount = createAccount;
const getAccountById = async (companyId, id) => {
    const account = await Account_1.default.findOne({ _id: id, companyId }).lean();
    if (!account)
        throw new appError_1.default(404, 'NOT_FOUND', 'Account not found');
    const [contacts, deals] = await Promise.all([
        Contact_1.default.find({ accountId: id }).sort({ createdAt: -1 }).lean(),
        Deal_1.default.find({ accountId: id }).sort({ createdAt: -1 }).lean(),
    ]);
    return { ...account, contacts, deals };
};
exports.getAccountById = getAccountById;
const updateAccount = async (companyId, id, body) => {
    const account = await Account_1.default.findOneAndUpdate({ _id: id, companyId }, body, { new: true, runValidators: true });
    if (!account)
        throw new appError_1.default(404, 'NOT_FOUND', 'Account not found');
    return account.toJSON();
};
exports.updateAccount = updateAccount;
const removeAccount = async (companyId, id) => {
    await Contact_1.default.updateMany({ accountId: id }, { $set: { accountId: null } });
    await Deal_1.default.updateMany({ accountId: id }, { $set: { accountId: null } });
    const account = await Account_1.default.findOneAndDelete({ _id: id, companyId });
    if (!account)
        throw new appError_1.default(404, 'NOT_FOUND', 'Account not found');
    return account;
};
exports.removeAccount = removeAccount;
const listDeals = async (companyId, query) => {
    const { page, limit, skip } = (0, helpers_1.paginateQuery)(query.page, Number(query.limit));
    const filter = { companyId };
    if (query.stage)
        filter.stage = query.stage;
    if (query.status)
        filter.status = query.status;
    if (query.accountId)
        filter.accountId = query.accountId;
    if (query.ownerId)
        filter.ownerId = query.ownerId;
    if (query.search)
        Object.assign(filter, (0, helpers_1.buildSearchQuery)(query.search, ['title', 'notes']));
    if (query.tag)
        filter.tags = query.tag;
    const [data, total] = await Promise.all([
        Deal_1.default.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
        Deal_1.default.countDocuments(filter),
    ]);
    return { data, meta: (0, helpers_1.buildMeta)(total, page, limit) };
};
exports.listDeals = listDeals;
const createDeal = async (companyId, body) => {
    const deal = await Deal_1.default.create({ ...body, companyId });
    return deal.toJSON();
};
exports.createDeal = createDeal;
const getDealById = async (companyId, id) => {
    const deal = await Deal_1.default.findOne({ _id: id, companyId }).lean();
    if (!deal)
        throw new appError_1.default(404, 'NOT_FOUND', 'Deal not found');
    const [contacts, activities] = await Promise.all([
        DealContact_1.default.find({ dealId: id }).populate('contactId').lean(),
        Activity_1.default.find({ dealId: id }).sort({ createdAt: -1 }).lean(),
    ]);
    return { ...deal, contacts, activities };
};
exports.getDealById = getDealById;
const updateDeal = async (companyId, id, body) => {
    const deal = await Deal_1.default.findOneAndUpdate({ _id: id, companyId }, body, { new: true, runValidators: true });
    if (!deal)
        throw new appError_1.default(404, 'NOT_FOUND', 'Deal not found');
    return deal.toJSON();
};
exports.updateDeal = updateDeal;
const removeDeal = async (companyId, id) => {
    const deal = await Deal_1.default.findOne({ _id: id, companyId });
    if (!deal)
        throw new appError_1.default(404, 'NOT_FOUND', 'Deal not found');
    deal.status = 'LOST';
    deal.stage = 'LOST';
    await deal.save();
    return deal.toJSON();
};
exports.removeDeal = removeDeal;
const changeDealStage = async (companyId, id, stage) => {
    const probabilityMap = { QUALIFICATION: 10, DEMO: 25, PROPOSAL: 50, NEGOTIATION: 75, WON: 100, LOST: 0 };
    const update = { stage, probability: probabilityMap[stage] || 0 };
    if (stage === 'WON') {
        update.status = 'WON';
        update.actualCloseDate = new Date();
    }
    if (stage === 'LOST')
        update.status = 'LOST';
    const deal = await Deal_1.default.findOneAndUpdate({ _id: id, companyId }, update, { new: true, runValidators: true });
    if (!deal)
        throw new appError_1.default(404, 'NOT_FOUND', 'Deal not found');
    return deal.toJSON();
};
exports.changeDealStage = changeDealStage;
const closeWonDeal = async (companyId, id, body) => {
    const deal = await Deal_1.default.findOne({ _id: id, companyId });
    if (!deal)
        throw new appError_1.default(404, 'NOT_FOUND', 'Deal not found');
    if (deal.status === 'WON')
        throw new appError_1.default(400, 'BAD_REQUEST', 'Deal already won');
    if (deal.status === 'LOST')
        throw new appError_1.default(400, 'BAD_REQUEST', 'Deal already lost');
    deal.status = 'WON';
    deal.stage = 'WON';
    deal.probability = 100;
    deal.actualCloseDate = body.actualCloseDate || new Date();
    deal.finalValue = body.finalValue ?? deal.value;
    if (body.notes)
        deal.notes = body.notes;
    await deal.save();
    return deal.toJSON();
};
exports.closeWonDeal = closeWonDeal;
const closeLostDeal = async (companyId, id, body) => {
    const deal = await Deal_1.default.findOne({ _id: id, companyId });
    if (!deal)
        throw new appError_1.default(404, 'NOT_FOUND', 'Deal not found');
    if (deal.status === 'LOST')
        throw new appError_1.default(400, 'BAD_REQUEST', 'Deal already lost');
    if (deal.status === 'WON')
        throw new appError_1.default(400, 'BAD_REQUEST', 'Deal already won');
    deal.status = 'LOST';
    deal.stage = 'LOST';
    deal.probability = 0;
    deal.lostReason = body.reason || '';
    if (body.notes)
        deal.notes = body.notes;
    await deal.save();
    return deal.toJSON();
};
exports.closeLostDeal = closeLostDeal;
const getPipeline = async (companyId) => {
    const stages = ['QUALIFICATION', 'DEMO', 'PROPOSAL', 'NEGOTIATION', 'WON', 'LOST'];
    const deals = await Deal_1.default.find({ companyId }).sort({ position: 1 }).lean();
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
exports.getPipeline = getPipeline;
const reorderPipeline = async (companyId, dealId, stage, position) => {
    const deal = await Deal_1.default.findOne({ _id: dealId, companyId });
    if (!deal)
        throw new appError_1.default(404, 'NOT_FOUND', 'Deal not found');
    deal.stage = stage;
    deal.position = position;
    await deal.save();
    return deal.toJSON();
};
exports.reorderPipeline = reorderPipeline;
const listActivities = async (companyId, query) => {
    const { page, limit, skip } = (0, helpers_1.paginateQuery)(query.page, Number(query.limit));
    const filter = { companyId };
    if (query.type)
        filter.type = query.type;
    if (query.leadId)
        filter.leadId = query.leadId;
    if (query.dealId)
        filter.dealId = query.dealId;
    if (query.contactId)
        filter.contactId = query.contactId;
    if (query.assignedToId)
        filter.assignedToId = query.assignedToId;
    if (query.isCompleted !== undefined)
        filter.isCompleted = query.isCompleted === 'true';
    const [data, total] = await Promise.all([
        Activity_1.default.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
        Activity_1.default.countDocuments(filter),
    ]);
    return { data, meta: (0, helpers_1.buildMeta)(total, page, limit) };
};
exports.listActivities = listActivities;
const createActivity = async (companyId, userId, body) => {
    const activity = await Activity_1.default.create({ ...body, companyId, createdBy: userId });
    return activity.toJSON();
};
exports.createActivity = createActivity;
const updateActivity = async (companyId, id, body) => {
    const activity = await Activity_1.default.findOneAndUpdate({ _id: id, companyId }, body, { new: true, runValidators: true });
    if (!activity)
        throw new appError_1.default(404, 'NOT_FOUND', 'Activity not found');
    return activity.toJSON();
};
exports.updateActivity = updateActivity;
const removeActivity = async (companyId, id) => {
    const activity = await Activity_1.default.findOneAndDelete({ _id: id, companyId });
    if (!activity)
        throw new appError_1.default(404, 'NOT_FOUND', 'Activity not found');
    return activity;
};
exports.removeActivity = removeActivity;
//# sourceMappingURL=crm.service.js.map