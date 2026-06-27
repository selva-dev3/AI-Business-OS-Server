import express from 'express';
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Analytics
 *   description: System-wide and Module-specific Analytics
 */


import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import * as analyticsController from '../controllers/analytics.controller';
import {
  aiInsightsSchema,
  scheduleReportSchema,
} from '../validators/analytics.validator';

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
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
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
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
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
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
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
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
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
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
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
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
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
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
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
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
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
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.post('/schedule-report', authenticate, validate(scheduleReportSchema), analyticsController.scheduleReport);

export default router;
