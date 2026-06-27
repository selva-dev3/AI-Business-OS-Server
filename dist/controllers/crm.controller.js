"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteActivity = exports.updateActivity = exports.createActivity = exports.listActivities = exports.reorderPipeline = exports.getPipeline = exports.closeLostDeal = exports.closeWonDeal = exports.changeDealStage = exports.deleteDeal = exports.updateDeal = exports.getDeal = exports.createDeal = exports.listDeals = exports.deleteAccount = exports.updateAccount = exports.getAccount = exports.createAccount = exports.listAccounts = exports.mergeContacts = exports.deleteContact = exports.updateContact = exports.getContact = exports.createContact = exports.listContacts = exports.addLeadActivity = exports.convertLead = exports.changeLeadStage = exports.deleteLead = exports.updateLead = exports.getLead = exports.createLead = exports.listLeads = exports.getDashboard = void 0;
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const crmService = __importStar(require("../services/crm.service"));
const apiResponse_1 = __importDefault(require("../utils/apiResponse"));
// ─── Dashboard ────────────────────────────────────────────────────────────────
exports.getDashboard = (0, catchAsync_1.default)(async (req, res) => {
    const from = req.query.from;
    const to = req.query.to;
    const data = await crmService.getDashboard(req.companyId, from, to);
    apiResponse_1.default.success(res, data);
});
// ─── Leads ────────────────────────────────────────────────────────────────────
exports.listLeads = (0, catchAsync_1.default)(async (req, res) => {
    const result = await crmService.listLeads(req.companyId, req.query);
    apiResponse_1.default.paginated(res, result.data, result.meta);
});
exports.createLead = (0, catchAsync_1.default)(async (req, res) => {
    const lead = await crmService.createLead(req.companyId, req.body);
    apiResponse_1.default.created(res, lead);
});
exports.getLead = (0, catchAsync_1.default)(async (req, res) => {
    const lead = await crmService.getLeadById(req.companyId, req.params.id);
    apiResponse_1.default.success(res, lead);
});
exports.updateLead = (0, catchAsync_1.default)(async (req, res) => {
    const lead = await crmService.updateLead(req.companyId, req.params.id, req.body);
    apiResponse_1.default.success(res, lead);
});
exports.deleteLead = (0, catchAsync_1.default)(async (req, res) => {
    await crmService.removeLead(req.companyId, req.params.id);
    apiResponse_1.default.success(res, null, 204);
});
exports.changeLeadStage = (0, catchAsync_1.default)(async (req, res) => {
    const lead = await crmService.changeLeadStage(req.companyId, req.params.id, req.body.status);
    apiResponse_1.default.success(res, lead);
});
exports.convertLead = (0, catchAsync_1.default)(async (req, res) => {
    const result = await crmService.convertLead(req.companyId, req.user._id.toString(), req.params.id, req.body);
    apiResponse_1.default.success(res, result);
});
exports.addLeadActivity = (0, catchAsync_1.default)(async (req, res) => {
    const activity = await crmService.addLeadActivity(req.companyId, req.user._id.toString(), req.params.id, req.body);
    apiResponse_1.default.created(res, activity);
});
// ─── Contacts ─────────────────────────────────────────────────────────────────
exports.listContacts = (0, catchAsync_1.default)(async (req, res) => {
    const result = await crmService.listContacts(req.companyId, req.query);
    apiResponse_1.default.paginated(res, result.data, result.meta);
});
exports.createContact = (0, catchAsync_1.default)(async (req, res) => {
    const contact = await crmService.createContact(req.companyId, req.body);
    apiResponse_1.default.created(res, contact);
});
exports.getContact = (0, catchAsync_1.default)(async (req, res) => {
    const contact = await crmService.getContactById(req.companyId, req.params.id);
    apiResponse_1.default.success(res, contact);
});
exports.updateContact = (0, catchAsync_1.default)(async (req, res) => {
    const contact = await crmService.updateContact(req.companyId, req.params.id, req.body);
    apiResponse_1.default.success(res, contact);
});
exports.deleteContact = (0, catchAsync_1.default)(async (req, res) => {
    await crmService.removeContact(req.companyId, req.params.id);
    apiResponse_1.default.success(res, null, 204);
});
exports.mergeContacts = (0, catchAsync_1.default)(async (req, res) => {
    const { primaryContactId, duplicateContactIds } = req.body;
    const contact = await crmService.mergeContacts(req.companyId, primaryContactId, duplicateContactIds);
    apiResponse_1.default.success(res, contact);
});
// ─── Accounts ─────────────────────────────────────────────────────────────────
exports.listAccounts = (0, catchAsync_1.default)(async (req, res) => {
    const result = await crmService.listAccounts(req.companyId, req.query);
    apiResponse_1.default.paginated(res, result.data, result.meta);
});
exports.createAccount = (0, catchAsync_1.default)(async (req, res) => {
    const account = await crmService.createAccount(req.companyId, req.body);
    apiResponse_1.default.created(res, account);
});
exports.getAccount = (0, catchAsync_1.default)(async (req, res) => {
    const account = await crmService.getAccountById(req.companyId, req.params.id);
    apiResponse_1.default.success(res, account);
});
exports.updateAccount = (0, catchAsync_1.default)(async (req, res) => {
    const account = await crmService.updateAccount(req.companyId, req.params.id, req.body);
    apiResponse_1.default.success(res, account);
});
exports.deleteAccount = (0, catchAsync_1.default)(async (req, res) => {
    await crmService.removeAccount(req.companyId, req.params.id);
    apiResponse_1.default.success(res, null, 204);
});
// ─── Deals ────────────────────────────────────────────────────────────────────
exports.listDeals = (0, catchAsync_1.default)(async (req, res) => {
    const result = await crmService.listDeals(req.companyId, req.query);
    apiResponse_1.default.paginated(res, result.data, result.meta);
});
exports.createDeal = (0, catchAsync_1.default)(async (req, res) => {
    const deal = await crmService.createDeal(req.companyId, req.body);
    apiResponse_1.default.created(res, deal);
});
exports.getDeal = (0, catchAsync_1.default)(async (req, res) => {
    const deal = await crmService.getDealById(req.companyId, req.params.id);
    apiResponse_1.default.success(res, deal);
});
exports.updateDeal = (0, catchAsync_1.default)(async (req, res) => {
    const deal = await crmService.updateDeal(req.companyId, req.params.id, req.body);
    apiResponse_1.default.success(res, deal);
});
exports.deleteDeal = (0, catchAsync_1.default)(async (req, res) => {
    await crmService.removeDeal(req.companyId, req.params.id);
    apiResponse_1.default.success(res, null, 204);
});
exports.changeDealStage = (0, catchAsync_1.default)(async (req, res) => {
    const deal = await crmService.changeDealStage(req.companyId, req.params.id, req.body.stage);
    apiResponse_1.default.success(res, deal);
});
exports.closeWonDeal = (0, catchAsync_1.default)(async (req, res) => {
    const deal = await crmService.closeWonDeal(req.companyId, req.params.id, req.body);
    apiResponse_1.default.success(res, deal);
});
exports.closeLostDeal = (0, catchAsync_1.default)(async (req, res) => {
    const deal = await crmService.closeLostDeal(req.companyId, req.params.id, req.body);
    apiResponse_1.default.success(res, deal);
});
// ─── Pipeline ─────────────────────────────────────────────────────────────────
exports.getPipeline = (0, catchAsync_1.default)(async (req, res) => {
    const data = await crmService.getPipeline(req.companyId);
    apiResponse_1.default.success(res, data);
});
exports.reorderPipeline = (0, catchAsync_1.default)(async (req, res) => {
    const { dealId, stage, position } = req.body;
    const deal = await crmService.reorderPipeline(req.companyId, dealId, stage, position);
    apiResponse_1.default.success(res, deal);
});
// ─── Activities ───────────────────────────────────────────────────────────────
exports.listActivities = (0, catchAsync_1.default)(async (req, res) => {
    const result = await crmService.listActivities(req.companyId, req.query);
    apiResponse_1.default.paginated(res, result.data, result.meta);
});
exports.createActivity = (0, catchAsync_1.default)(async (req, res) => {
    const activity = await crmService.createActivity(req.companyId, req.user._id.toString(), req.body);
    apiResponse_1.default.created(res, activity);
});
exports.updateActivity = (0, catchAsync_1.default)(async (req, res) => {
    const activity = await crmService.updateActivity(req.companyId, req.params.id, req.body);
    apiResponse_1.default.success(res, activity);
});
exports.deleteActivity = (0, catchAsync_1.default)(async (req, res) => {
    await crmService.removeActivity(req.companyId, req.params.id);
    apiResponse_1.default.success(res, null, 204);
});
//# sourceMappingURL=crm.controller.js.map