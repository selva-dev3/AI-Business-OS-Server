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
const dashboardController = __importStar(require("../controllers/dashboard.controller"));
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
router.get('/activity', auth_1.authenticate, dashboardController.getActivity);
exports.default = router;
//# sourceMappingURL=dashboard.routes.js.map