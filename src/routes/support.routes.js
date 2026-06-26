const express = require('express');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Support
 *   description: Customer Support and Ticketing System
 */


const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const auditLog = require('../middleware/auditLogger');
const supportController = require('../controllers/support.controller');
const {
  createTicketSchema,
  updateTicketSchema,
  replyTicketSchema,
  assignTicketSchema,
  changeTicketStatusSchema,
  changeTicketPrioritySchema,
  closeTicketSchema,
  createCategorySchema,
  updateCategorySchema,
} = require('../validators/support.validator');

/**
 * @swagger
 * /support/tickets:
 *   get:
 *     summary: Get Tickets
 *     tags: [Support]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.get('/tickets', authenticate, supportController.listTickets);
/**
 * @swagger
 * /support/tickets:
 *   post:
 *     summary: Create Tickets
 *     tags: [Support]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.post('/tickets', authenticate, validate(createTicketSchema), auditLog('support', 'CREATE', 'ticket'), supportController.createTicket);
/**
 * @swagger
 * /support/tickets/{id}:
 *   get:
 *     summary: Get Tickets
 *     tags: [Support]
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
router.get('/tickets/:id', authenticate, supportController.getTicket);
/**
 * @swagger
 * /support/tickets/{id}:
 *   patch:
 *     summary: Update Tickets
 *     tags: [Support]
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
router.patch('/tickets/:id', authenticate, validate(updateTicketSchema), auditLog('support', 'UPDATE', 'ticket'), supportController.updateTicket);
/**
 * @swagger
 * /support/tickets/{id}:
 *   delete:
 *     summary: Delete Tickets
 *     tags: [Support]
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
router.delete('/tickets/:id', authenticate, auditLog('support', 'DELETE', 'ticket'), supportController.deleteTicket);

/**
 * @swagger
 * /support/tickets/{id}/reply:
 *   post:
 *     summary: Create Tickets Reply
 *     tags: [Support]
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
router.post('/tickets/:id/reply', authenticate, validate(replyTicketSchema), supportController.replyTicket);
/**
 * @swagger
 * /support/tickets/{id}/assign:
 *   patch:
 *     summary: Update Tickets Assign
 *     tags: [Support]
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
router.patch('/tickets/:id/assign', authenticate, validate(assignTicketSchema), auditLog('support', 'UPDATE', 'assign'), supportController.assignTicket);
/**
 * @swagger
 * /support/tickets/{id}/status:
 *   patch:
 *     summary: Update Tickets Status
 *     tags: [Support]
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
router.patch('/tickets/:id/status', authenticate, validate(changeTicketStatusSchema), auditLog('support', 'UPDATE', 'status'), supportController.changeTicketStatus);
/**
 * @swagger
 * /support/tickets/{id}/priority:
 *   patch:
 *     summary: Update Tickets Priority
 *     tags: [Support]
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
router.patch('/tickets/:id/priority', authenticate, validate(changeTicketPrioritySchema), auditLog('support', 'UPDATE', 'priority'), supportController.changeTicketPriority);
/**
 * @swagger
 * /support/tickets/{id}/close:
 *   post:
 *     summary: Create Tickets Close
 *     tags: [Support]
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
router.post('/tickets/:id/close', authenticate, validate(closeTicketSchema), auditLog('support', 'UPDATE', 'close'), supportController.closeTicket);
/**
 * @swagger
 * /support/tickets/{id}/ai-summary:
 *   get:
 *     summary: Get Tickets Ai-summary
 *     tags: [Support]
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
router.get('/tickets/:id/ai-summary', authenticate, supportController.getTicketAISummary);

/**
 * @swagger
 * /support/categories:
 *   get:
 *     summary: Get Categories
 *     tags: [Support]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.get('/categories', authenticate, supportController.listCategories);
/**
 * @swagger
 * /support/categories:
 *   post:
 *     summary: Create Categories
 *     tags: [Support]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.post('/categories', authenticate, validate(createCategorySchema), auditLog('support', 'CREATE', 'category'), supportController.createCategory);
/**
 * @swagger
 * /support/categories/{id}:
 *   patch:
 *     summary: Update Categories
 *     tags: [Support]
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
router.patch('/categories/:id', authenticate, validate(updateCategorySchema), auditLog('support', 'UPDATE', 'category'), supportController.updateCategory);
/**
 * @swagger
 * /support/categories/{id}:
 *   delete:
 *     summary: Delete Categories
 *     tags: [Support]
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
router.delete('/categories/:id', authenticate, auditLog('support', 'DELETE', 'category'), supportController.deleteCategory);

/**
 * @swagger
 * /support/reports/summary:
 *   get:
 *     summary: Get summary of Reports Summary
 *     tags: [Support]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.get('/reports/summary', authenticate, supportController.getReportSummary);
/**
 * @swagger
 * /support/reports/sla:
 *   get:
 *     summary: Get Reports Sla
 *     tags: [Support]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.get('/reports/sla', authenticate, supportController.getReportSLA);
/**
 * @swagger
 * /support/reports/agent-perf:
 *   get:
 *     summary: Get Reports Agent-perf
 *     tags: [Support]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.get('/reports/agent-perf', authenticate, supportController.getReportAgentPerformance);

module.exports = router;
