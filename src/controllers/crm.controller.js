const crmService = require('../services/crm.service');
const ApiResponse = require('../utils/apiResponse');
const catchAsync = require('../utils/catchAsync');

// ─── Dashboard ────────────────────────────────────────────────────────────────
const getDashboard = catchAsync(async (req, res) => {
  const { from, to } = req.query;
  const data = await crmService.getDashboard(req.companyId, from, to);
  ApiResponse.success(res, data);
});

// ─── Leads ────────────────────────────────────────────────────────────────────
const listLeads = catchAsync(async (req, res) => {
  const result = await crmService.listLeads(req.companyId, req.query);
  ApiResponse.paginated(res, result.data, result.meta);
});

const createLead = catchAsync(async (req, res) => {
  const lead = await crmService.createLead(req.companyId, req.body);
  ApiResponse.created(res, lead);
});

const getLead = catchAsync(async (req, res) => {
  const lead = await crmService.getLeadById(req.companyId, req.params.id);
  ApiResponse.success(res, lead);
});

const updateLead = catchAsync(async (req, res) => {
  const lead = await crmService.updateLead(req.companyId, req.params.id, req.body);
  ApiResponse.success(res, lead);
});

const deleteLead = catchAsync(async (req, res) => {
  await crmService.removeLead(req.companyId, req.params.id);
  ApiResponse.success(res, null, 204);
});

const changeLeadStage = catchAsync(async (req, res) => {
  const lead = await crmService.changeLeadStage(req.companyId, req.params.id, req.body.status);
  ApiResponse.success(res, lead);
});

const convertLead = catchAsync(async (req, res) => {
  const result = await crmService.convertLead(req.companyId, req.user._id, req.params.id, req.body);
  ApiResponse.success(res, result);
});

const addLeadActivity = catchAsync(async (req, res) => {
  const activity = await crmService.addLeadActivity(req.companyId, req.user._id, req.params.id, req.body);
  ApiResponse.created(res, activity);
});

// ─── Contacts ─────────────────────────────────────────────────────────────────
const listContacts = catchAsync(async (req, res) => {
  const result = await crmService.listContacts(req.companyId, req.query);
  ApiResponse.paginated(res, result.data, result.meta);
});

const createContact = catchAsync(async (req, res) => {
  const contact = await crmService.createContact(req.companyId, req.body);
  ApiResponse.created(res, contact);
});

const getContact = catchAsync(async (req, res) => {
  const contact = await crmService.getContactById(req.companyId, req.params.id);
  ApiResponse.success(res, contact);
});

const updateContact = catchAsync(async (req, res) => {
  const contact = await crmService.updateContact(req.companyId, req.params.id, req.body);
  ApiResponse.success(res, contact);
});

const deleteContact = catchAsync(async (req, res) => {
  await crmService.removeContact(req.companyId, req.params.id);
  ApiResponse.success(res, null, 204);
});

const mergeContacts = catchAsync(async (req, res) => {
  const { primaryContactId, duplicateContactIds } = req.body;
  const contact = await crmService.mergeContacts(req.companyId, primaryContactId, duplicateContactIds);
  ApiResponse.success(res, contact);
});

// ─── Accounts ─────────────────────────────────────────────────────────────────
const listAccounts = catchAsync(async (req, res) => {
  const result = await crmService.listAccounts(req.companyId, req.query);
  ApiResponse.paginated(res, result.data, result.meta);
});

const createAccount = catchAsync(async (req, res) => {
  const account = await crmService.createAccount(req.companyId, req.body);
  ApiResponse.created(res, account);
});

const getAccount = catchAsync(async (req, res) => {
  const account = await crmService.getAccountById(req.companyId, req.params.id);
  ApiResponse.success(res, account);
});

const updateAccount = catchAsync(async (req, res) => {
  const account = await crmService.updateAccount(req.companyId, req.params.id, req.body);
  ApiResponse.success(res, account);
});

const deleteAccount = catchAsync(async (req, res) => {
  await crmService.removeAccount(req.companyId, req.params.id);
  ApiResponse.success(res, null, 204);
});

// ─── Deals ────────────────────────────────────────────────────────────────────
const listDeals = catchAsync(async (req, res) => {
  const result = await crmService.listDeals(req.companyId, req.query);
  ApiResponse.paginated(res, result.data, result.meta);
});

const createDeal = catchAsync(async (req, res) => {
  const deal = await crmService.createDeal(req.companyId, req.body);
  ApiResponse.created(res, deal);
});

const getDeal = catchAsync(async (req, res) => {
  const deal = await crmService.getDealById(req.companyId, req.params.id);
  ApiResponse.success(res, deal);
});

const updateDeal = catchAsync(async (req, res) => {
  const deal = await crmService.updateDeal(req.companyId, req.params.id, req.body);
  ApiResponse.success(res, deal);
});

const deleteDeal = catchAsync(async (req, res) => {
  await crmService.removeDeal(req.companyId, req.params.id);
  ApiResponse.success(res, null, 204);
});

const changeDealStage = catchAsync(async (req, res) => {
  const deal = await crmService.changeDealStage(req.companyId, req.params.id, req.body.stage);
  ApiResponse.success(res, deal);
});

const closeWonDeal = catchAsync(async (req, res) => {
  const deal = await crmService.closeWonDeal(req.companyId, req.params.id, req.body);
  ApiResponse.success(res, deal);
});

const closeLostDeal = catchAsync(async (req, res) => {
  const deal = await crmService.closeLostDeal(req.companyId, req.params.id, req.body);
  ApiResponse.success(res, deal);
});

// ─── Pipeline ─────────────────────────────────────────────────────────────────
const getPipeline = catchAsync(async (req, res) => {
  const data = await crmService.getPipeline(req.companyId);
  ApiResponse.success(res, data);
});

const reorderPipeline = catchAsync(async (req, res) => {
  const { dealId, stage, position } = req.body;
  const deal = await crmService.reorderPipeline(req.companyId, dealId, stage, position);
  ApiResponse.success(res, deal);
});

// ─── Activities ───────────────────────────────────────────────────────────────
const listActivities = catchAsync(async (req, res) => {
  const result = await crmService.listActivities(req.companyId, req.query);
  ApiResponse.paginated(res, result.data, result.meta);
});

const createActivity = catchAsync(async (req, res) => {
  const activity = await crmService.createActivity(req.companyId, req.user._id, req.body);
  ApiResponse.created(res, activity);
});

const updateActivity = catchAsync(async (req, res) => {
  const activity = await crmService.updateActivity(req.companyId, req.params.id, req.body);
  ApiResponse.success(res, activity);
});

const deleteActivity = catchAsync(async (req, res) => {
  await crmService.removeActivity(req.companyId, req.params.id);
  ApiResponse.success(res, null, 204);
});

module.exports = {
  getDashboard,
  listLeads,
  createLead,
  getLead,
  updateLead,
  deleteLead,
  changeLeadStage,
  convertLead,
  addLeadActivity,
  listContacts,
  createContact,
  getContact,
  updateContact,
  deleteContact,
  mergeContacts,
  listAccounts,
  createAccount,
  getAccount,
  updateAccount,
  deleteAccount,
  listDeals,
  createDeal,
  getDeal,
  updateDeal,
  deleteDeal,
  changeDealStage,
  closeWonDeal,
  closeLostDeal,
  getPipeline,
  reorderPipeline,
  listActivities,
  createActivity,
  updateActivity,
  deleteActivity,
};
