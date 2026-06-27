import express from 'express';
const router = express.Router();
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import auditLog from '../middleware/auditLogger';
import * as settingsController from '../controllers/settings.controller';
import {
  createRoleSchema,
  updateRoleSchema,
  updateEmailSchema,
  testEmailSchema,
  updateTemplateSchema,
  connectIntegrationSchema,
  createApiKeySchema,
  upgradePlanSchema,
} from '../validators/settings.validator';

router.use(authenticate);

// Roles & Permissions
router.get('/roles', settingsController.listRoles);
router.post('/roles', validate(createRoleSchema), auditLog('settings', 'CREATE', 'role'), settingsController.createRole);
router.get('/roles/:id', settingsController.getRoleById);
router.patch('/roles/:id', validate(updateRoleSchema), settingsController.updateRole);
router.delete('/roles/:id', auditLog('settings', 'DELETE', 'role'), settingsController.removeRole);
router.get('/permissions', settingsController.listPermissions);

// Email Settings
router.get('/email', settingsController.getEmailSettings);
router.patch('/email', validate(updateEmailSchema), auditLog('settings', 'UPDATE', 'email_settings'), settingsController.updateEmailSettings);
router.post('/email/test', validate(testEmailSchema), settingsController.testEmail);

// Templates
router.get('/templates', settingsController.listTemplates);
router.patch('/templates/:type', validate(updateTemplateSchema), settingsController.updateTemplate);

// Integrations
router.get('/integrations', settingsController.listIntegrations);
router.post('/integrations/:type/connect', validate(connectIntegrationSchema), auditLog('settings', 'CONNECT', 'integration'), settingsController.connectIntegration);
router.post('/integrations/:type/disconnect', auditLog('settings', 'DISCONNECT', 'integration'), settingsController.disconnectIntegration);

// API Keys
router.get('/api-keys', settingsController.listApiKeys);
router.post('/api-keys', validate(createApiKeySchema), auditLog('settings', 'CREATE', 'api_key'), settingsController.createApiKey);
router.delete('/api-keys/:id', auditLog('settings', 'DELETE', 'api_key'), settingsController.removeApiKey);

// Audit Logs
router.get('/audit-logs', settingsController.listAuditLogs);
router.get('/audit-logs/export', settingsController.exportAuditLogs);

// Billing & Plan
router.get('/plan', settingsController.getPlan);
router.get('/usage', settingsController.getUsage);
router.get('/invoices', settingsController.getInvoices);
router.post('/upgrade', validate(upgradePlanSchema), auditLog('settings', 'UPGRADE', 'plan'), settingsController.upgradePlan);

export default router;
