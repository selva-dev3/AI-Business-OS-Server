const express = require('express');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Settings
 *   description: Application and System Settings
 */


const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const auditLog = require('../middleware/auditLogger');
const settingsController = require('../controllers/settings.controller');
const {
  createRoleSchema,
  updateRoleSchema,
  updateEmailSchema,
  testEmailSchema,
  updateTemplateSchema,
  connectIntegrationSchema,
  createApiKeySchema,
  upgradePlanSchema,
} = require('../validators/settings.validator');

/**
 * @swagger
 * /settings/roles:
 *   get:
 *     summary: Get Roles
 *     tags: [Settings]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.get('/roles', authenticate, settingsController.listRoles);
/**
 * @swagger
 * /settings/roles:
 *   post:
 *     summary: Create Roles
 *     tags: [Settings]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.post('/roles', authenticate, validate(createRoleSchema), auditLog('settings', 'CREATE', 'role'), settingsController.createRole);
/**
 * @swagger
 * /settings/roles/{id}:
 *   get:
 *     summary: Get Roles
 *     tags: [Settings]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The id parameter
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.get('/roles/:id', authenticate, settingsController.getRoleById);
/**
 * @swagger
 * /settings/roles/{id}:
 *   patch:
 *     summary: Update Roles
 *     tags: [Settings]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The id parameter
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.patch('/roles/:id', authenticate, validate(updateRoleSchema), auditLog('settings', 'UPDATE', 'role'), settingsController.updateRole);
/**
 * @swagger
 * /settings/roles/{id}:
 *   delete:
 *     summary: Delete Roles
 *     tags: [Settings]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The id parameter
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.delete('/roles/:id', authenticate, auditLog('settings', 'DELETE', 'role'), settingsController.removeRole);

/**
 * @swagger
 * /settings/permissions:
 *   get:
 *     summary: Get Permissions
 *     tags: [Settings]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.get('/permissions', authenticate, settingsController.listPermissions);

/**
 * @swagger
 * /settings/email:
 *   get:
 *     summary: Get Email
 *     tags: [Settings]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.get('/email', authenticate, settingsController.getEmailSettings);
/**
 * @swagger
 * /settings/email:
 *   patch:
 *     summary: Update Email
 *     tags: [Settings]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.patch('/email', authenticate, validate(updateEmailSchema), settingsController.updateEmailSettings);
/**
 * @swagger
 * /settings/email/test:
 *   post:
 *     summary: Create Email Test
 *     tags: [Settings]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.post('/email/test', authenticate, validate(testEmailSchema), settingsController.testEmail);

/**
 * @swagger
 * /settings/email/templates:
 *   get:
 *     summary: Get Email Templates
 *     tags: [Settings]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.get('/email/templates', authenticate, settingsController.listTemplates);
/**
 * @swagger
 * /settings/email/templates/{type}:
 *   patch:
 *     summary: Update Email Templates
 *     tags: [Settings]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *         description: The type parameter
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.patch('/email/templates/:type', authenticate, validate(updateTemplateSchema), settingsController.updateTemplate);

/**
 * @swagger
 * /settings/integrations:
 *   get:
 *     summary: Get Integrations
 *     tags: [Settings]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.get('/integrations', authenticate, settingsController.listIntegrations);
/**
 * @swagger
 * /settings/integrations/{type}/connect:
 *   post:
 *     summary: Create Integrations Connect
 *     tags: [Settings]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *         description: The type parameter
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.post('/integrations/:type/connect', authenticate, validate(connectIntegrationSchema), settingsController.connectIntegration);
/**
 * @swagger
 * /settings/integrations/{type}/disconnect:
 *   delete:
 *     summary: Delete Integrations Disconnect
 *     tags: [Settings]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *         description: The type parameter
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.delete('/integrations/:type/disconnect', authenticate, settingsController.disconnectIntegration);

/**
 * @swagger
 * /settings/api-keys:
 *   get:
 *     summary: Get Api-keys
 *     tags: [Settings]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.get('/api-keys', authenticate, settingsController.listApiKeys);
/**
 * @swagger
 * /settings/api-keys:
 *   post:
 *     summary: Create Api-keys
 *     tags: [Settings]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.post('/api-keys', authenticate, validate(createApiKeySchema), settingsController.createApiKey);
/**
 * @swagger
 * /settings/api-keys/{id}:
 *   delete:
 *     summary: Delete Api-keys
 *     tags: [Settings]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The id parameter
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.delete('/api-keys/:id', authenticate, auditLog('settings', 'DELETE', 'apiKey'), settingsController.removeApiKey);

/**
 * @swagger
 * /settings/audit-logs:
 *   get:
 *     summary: Get Audit-logs
 *     tags: [Settings]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.get('/audit-logs', authenticate, settingsController.listAuditLogs);
/**
 * @swagger
 * /settings/audit-logs/export:
 *   get:
 *     summary: Export Audit-logs Export
 *     tags: [Settings]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.get('/audit-logs/export', authenticate, settingsController.exportAuditLogs);

/**
 * @swagger
 * /settings/billing/plan:
 *   get:
 *     summary: Get Billing Plan
 *     tags: [Settings]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.get('/billing/plan', authenticate, settingsController.getPlan);
/**
 * @swagger
 * /settings/billing/usage:
 *   get:
 *     summary: Get Billing Usage
 *     tags: [Settings]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.get('/billing/usage', authenticate, settingsController.getUsage);
/**
 * @swagger
 * /settings/billing/invoices:
 *   get:
 *     summary: Get Billing Invoices
 *     tags: [Settings]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.get('/billing/invoices', authenticate, settingsController.getInvoices);
/**
 * @swagger
 * /settings/billing/upgrade:
 *   post:
 *     summary: Create Billing Upgrade
 *     tags: [Settings]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.post('/billing/upgrade', authenticate, validate(upgradePlanSchema), settingsController.upgradePlan);

module.exports = router;
