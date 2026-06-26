const express = require('express');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Analytics
 *   description: System-wide and Module-specific Analytics
 */


const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const analyticsController = require('../controllers/analytics.controller');
const {
  aiInsightsSchema,
  scheduleReportSchema,
} = require('../validators/analytics.validator');

/**
 * @swagger
 * /analytics/overview:
 *   get:
 *     summary: Get Overview
 *     tags: [Analytics]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.get('/overview', authenticate, analyticsController.getOverview);
/**
 * @swagger
 * /analytics/revenue:
 *   get:
 *     summary: Get Revenue
 *     tags: [Analytics]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.get('/revenue', authenticate, analyticsController.getRevenue);
/**
 * @swagger
 * /analytics/hrms:
 *   get:
 *     summary: Get Hrms
 *     tags: [Analytics]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.get('/hrms', authenticate, analyticsController.getHRMS);
/**
 * @swagger
 * /analytics/crm:
 *   get:
 *     summary: Get Crm
 *     tags: [Analytics]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.get('/crm', authenticate, analyticsController.getCRM);
/**
 * @swagger
 * /analytics/inventory:
 *   get:
 *     summary: Get Inventory
 *     tags: [Analytics]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.get('/inventory', authenticate, analyticsController.getInventory);
/**
 * @swagger
 * /analytics/support:
 *   get:
 *     summary: Get Support
 *     tags: [Analytics]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.get('/support', authenticate, analyticsController.getSupport);
/**
 * @swagger
 * /analytics/finance:
 *   get:
 *     summary: Get Finance
 *     tags: [Analytics]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.get('/finance', authenticate, analyticsController.getFinance);
/**
 * @swagger
 * /analytics/ai-insights:
 *   post:
 *     summary: Create Ai-insights
 *     tags: [Analytics]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.post('/ai-insights', authenticate, validate(aiInsightsSchema), analyticsController.getAIInsights);
/**
 * @swagger
 * /analytics/schedule-report:
 *   post:
 *     summary: Create Schedule-report
 *     tags: [Analytics]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.post('/schedule-report', authenticate, validate(scheduleReportSchema), analyticsController.scheduleReport);

module.exports = router;
