import express from 'express';
const router = express.Router();
import { authenticate } from '../middleware/auth';
import * as dashboardController from '../controllers/dashboard.controller';

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Dashboard activity feed across all modules
 */

/**
 * @swagger
 * /dashboard/activity:
 *   get:
 *     summary: Get recent activity feed
 *     description: |
 *       Returns a unified activity feed aggregating recent actions from five core modules:
 *       **CRM** (Leads, Deals, Activities), **Procurement** (Purchase Orders, RFQs),
 *       **Inventory** (Stock Movements, Transfers, Products), **HRMS** (Employees, Leave Requests),
 *       and **Finance** (Invoices, Expenses, Payments).
 *
 *       Results are sorted by timestamp (newest first).
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 30
 *           minimum: 1
 *           maximum: 100
 *         description: Maximum number of activity items to return (default 30, max 100)
 *       - in: query
 *         name: module
 *         schema:
 *           type: string
 *           enum: [CRM, PROCUREMENT, INVENTORY, HRMS, FINANCE]
 *         description: Filter activities by a specific module. Omit to get all modules.
 *     responses:
 *       200:
 *         description: Activity feed retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     activities:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/DashboardActivity'
 *                     total:
 *                       type: integer
 *                       description: Total number of activities fetched before trimming
 *                       example: 42
 *                     modules:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: [CRM, PROCUREMENT, INVENTORY, HRMS, FINANCE]
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 requestId:
 *                   type: string
 *                   format: uuid
 *       401:
 *         description: Unauthorized — missing or invalid token
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.get('/activity', authenticate, dashboardController.getActivity);

export default router;
