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
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const auth_1 = require("../middleware/auth");
const validate_1 = require("../middleware/validate");
const auditLogger_1 = __importDefault(require("../middleware/auditLogger"));
const settingsController = __importStar(require("../controllers/settings.controller"));
const settings_validator_1 = require("../validators/settings.validator");
router.use(auth_1.authenticate);
// Roles & Permissions
router.get('/roles', settingsController.listRoles);
router.post('/roles', (0, validate_1.validate)(settings_validator_1.createRoleSchema), (0, auditLogger_1.default)('settings', 'CREATE', 'role'), settingsController.createRole);
router.get('/roles/:id', settingsController.getRoleById);
router.patch('/roles/:id', (0, validate_1.validate)(settings_validator_1.updateRoleSchema), settingsController.updateRole);
router.delete('/roles/:id', (0, auditLogger_1.default)('settings', 'DELETE', 'role'), settingsController.removeRole);
router.get('/permissions', settingsController.listPermissions);
// Email Settings
router.get('/email', settingsController.getEmailSettings);
router.patch('/email', (0, validate_1.validate)(settings_validator_1.updateEmailSchema), (0, auditLogger_1.default)('settings', 'UPDATE', 'email_settings'), settingsController.updateEmailSettings);
router.post('/email/test', (0, validate_1.validate)(settings_validator_1.testEmailSchema), settingsController.testEmail);
// Templates
router.get('/templates', settingsController.listTemplates);
router.patch('/templates/:type', (0, validate_1.validate)(settings_validator_1.updateTemplateSchema), settingsController.updateTemplate);
// Integrations
router.get('/integrations', settingsController.listIntegrations);
router.post('/integrations/:type/connect', (0, validate_1.validate)(settings_validator_1.connectIntegrationSchema), (0, auditLogger_1.default)('settings', 'CONNECT', 'integration'), settingsController.connectIntegration);
router.post('/integrations/:type/disconnect', (0, auditLogger_1.default)('settings', 'DISCONNECT', 'integration'), settingsController.disconnectIntegration);
// API Keys
router.get('/api-keys', settingsController.listApiKeys);
router.post('/api-keys', (0, validate_1.validate)(settings_validator_1.createApiKeySchema), (0, auditLogger_1.default)('settings', 'CREATE', 'api_key'), settingsController.createApiKey);
router.delete('/api-keys/:id', (0, auditLogger_1.default)('settings', 'DELETE', 'api_key'), settingsController.removeApiKey);
// Audit Logs
router.get('/audit-logs', settingsController.listAuditLogs);
router.get('/audit-logs/export', settingsController.exportAuditLogs);
// Billing & Plan
router.get('/plan', settingsController.getPlan);
router.get('/usage', settingsController.getUsage);
router.get('/invoices', settingsController.getInvoices);
router.post('/upgrade', (0, validate_1.validate)(settings_validator_1.upgradePlanSchema), (0, auditLogger_1.default)('settings', 'UPGRADE', 'plan'), settingsController.upgradePlan);
exports.default = router;
//# sourceMappingURL=settings.routes.js.map