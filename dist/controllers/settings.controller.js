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
exports.upgradePlan = exports.getInvoices = exports.getUsage = exports.getPlan = exports.exportAuditLogs = exports.listAuditLogs = exports.removeApiKey = exports.createApiKey = exports.listApiKeys = exports.disconnectIntegration = exports.connectIntegration = exports.listIntegrations = exports.updateTemplate = exports.listTemplates = exports.testEmail = exports.updateEmailSettings = exports.getEmailSettings = exports.listPermissions = exports.removeRole = exports.updateRole = exports.getRoleById = exports.createRole = exports.listRoles = void 0;
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const settingsService = __importStar(require("../services/settings.service"));
const apiResponse_1 = __importDefault(require("../utils/apiResponse"));
exports.listRoles = (0, catchAsync_1.default)(async (req, res, _next) => {
    const roles = await settingsService.listRoles(req.companyId);
    apiResponse_1.default.success(res, roles);
});
exports.createRole = (0, catchAsync_1.default)(async (req, res, _next) => {
    const role = await settingsService.createRole(req.companyId, req.body);
    apiResponse_1.default.created(res, role);
});
exports.getRoleById = (0, catchAsync_1.default)(async (req, res, _next) => {
    const role = await settingsService.getRoleById(req.companyId, req.params.id);
    apiResponse_1.default.success(res, role);
});
exports.updateRole = (0, catchAsync_1.default)(async (req, res, _next) => {
    req.originalBody = req.body;
    const role = await settingsService.updateRole(req.companyId, req.params.id, req.body);
    apiResponse_1.default.success(res, role);
});
exports.removeRole = (0, catchAsync_1.default)(async (req, res, _next) => {
    const result = await settingsService.removeRole(req.companyId, req.params.id);
    apiResponse_1.default.success(res, result);
});
exports.listPermissions = (0, catchAsync_1.default)(async (_req, res, _next) => {
    const permissions = await settingsService.listPermissions();
    apiResponse_1.default.success(res, permissions);
});
exports.getEmailSettings = (0, catchAsync_1.default)(async (req, res, _next) => {
    const settings = await settingsService.getEmailSettings(req.companyId);
    apiResponse_1.default.success(res, settings);
});
exports.updateEmailSettings = (0, catchAsync_1.default)(async (req, res, _next) => {
    const result = await settingsService.updateEmailSettings(req.companyId, req.body);
    apiResponse_1.default.success(res, result);
});
exports.testEmail = (0, catchAsync_1.default)(async (req, res, _next) => {
    const result = await settingsService.testEmail(req.body);
    apiResponse_1.default.success(res, result);
});
exports.listTemplates = (0, catchAsync_1.default)(async (req, res, _next) => {
    const templates = await settingsService.listTemplates(req.companyId);
    apiResponse_1.default.success(res, templates);
});
exports.updateTemplate = (0, catchAsync_1.default)(async (req, res, _next) => {
    const template = await settingsService.updateTemplate(req.companyId, req.params.type, req.body);
    apiResponse_1.default.success(res, template);
});
exports.listIntegrations = (0, catchAsync_1.default)(async (req, res, _next) => {
    const integrations = await settingsService.listIntegrations(req.companyId);
    apiResponse_1.default.success(res, integrations);
});
exports.connectIntegration = (0, catchAsync_1.default)(async (req, res, _next) => {
    const integration = await settingsService.connectIntegration(req.companyId, req.params.type, req.body);
    apiResponse_1.default.success(res, integration);
});
exports.disconnectIntegration = (0, catchAsync_1.default)(async (req, res, _next) => {
    const result = await settingsService.disconnectIntegration(req.companyId, req.params.type);
    apiResponse_1.default.success(res, result);
});
exports.listApiKeys = (0, catchAsync_1.default)(async (req, res, _next) => {
    const keys = await settingsService.listApiKeys(req.companyId);
    apiResponse_1.default.success(res, keys);
});
exports.createApiKey = (0, catchAsync_1.default)(async (req, res, _next) => {
    const apiKey = await settingsService.createApiKey(req.companyId, req.body);
    apiResponse_1.default.created(res, apiKey);
});
exports.removeApiKey = (0, catchAsync_1.default)(async (req, res, _next) => {
    const result = await settingsService.removeApiKey(req.companyId, req.params.id);
    apiResponse_1.default.success(res, result);
});
exports.listAuditLogs = (0, catchAsync_1.default)(async (req, res, _next) => {
    const result = await settingsService.listAuditLogs(req.companyId, req.query);
    apiResponse_1.default.paginated(res, result.data, result.meta);
});
exports.exportAuditLogs = (0, catchAsync_1.default)(async (req, res, _next) => {
    const logs = await settingsService.exportAuditLogs(req.companyId, req.query);
    apiResponse_1.default.success(res, logs);
});
exports.getPlan = (0, catchAsync_1.default)(async (req, res, _next) => {
    const plan = await settingsService.getPlan(req.companyId);
    apiResponse_1.default.success(res, plan);
});
exports.getUsage = (0, catchAsync_1.default)(async (req, res, _next) => {
    const usage = await settingsService.getUsage(req.companyId);
    apiResponse_1.default.success(res, usage);
});
exports.getInvoices = (0, catchAsync_1.default)(async (req, res, _next) => {
    const invoices = await settingsService.getInvoices(req.companyId);
    apiResponse_1.default.success(res, invoices);
});
exports.upgradePlan = (0, catchAsync_1.default)(async (req, res, _next) => {
    const result = await settingsService.upgradePlan(req.companyId, req.body);
    apiResponse_1.default.success(res, result);
});
//# sourceMappingURL=settings.controller.js.map