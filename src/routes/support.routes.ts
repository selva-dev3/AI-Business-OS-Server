import express from 'express';
const router = express.Router();
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import auditLog from '../middleware/auditLogger';
import * as supportController from '../controllers/support.controller';
import {
  createTicketSchema,
  updateTicketSchema,
  replyTicketSchema,
  assignTicketSchema,
  changeTicketStatusSchema,
  changeTicketPrioritySchema,
  closeTicketSchema,
  createCategorySchema,
  updateCategorySchema,
} from '../validators/support.validator';

router.use(authenticate);

// Tickets
router.get('/tickets', supportController.listTickets);
router.post('/tickets', validate(createTicketSchema), auditLog('support', 'CREATE', 'ticket'), supportController.createTicket);
router.get('/tickets/:id', supportController.getTicket);
router.patch('/tickets/:id', validate(updateTicketSchema), supportController.updateTicket);
router.delete('/tickets/:id', auditLog('support', 'DELETE', 'ticket'), supportController.deleteTicket);
router.post('/tickets/:id/reply', validate(replyTicketSchema), auditLog('support', 'REPLY', 'ticket'), supportController.replyTicket);
router.patch('/tickets/:id/assign', validate(assignTicketSchema), auditLog('support', 'ASSIGN', 'ticket'), supportController.assignTicket);
router.patch('/tickets/:id/status', validate(changeTicketStatusSchema), supportController.changeTicketStatus);
router.patch('/tickets/:id/priority', validate(changeTicketPrioritySchema), supportController.changeTicketPriority);
router.post('/tickets/:id/close', validate(closeTicketSchema), auditLog('support', 'CLOSE', 'ticket'), supportController.closeTicket);
router.get('/tickets/:id/ai-summary', supportController.getTicketAISummary);

// Categories
router.get('/categories', supportController.listCategories);
router.post('/categories', validate(createCategorySchema), auditLog('support', 'CREATE', 'category'), supportController.createCategory);
router.patch('/categories/:id', validate(updateCategorySchema), supportController.updateCategory);
router.delete('/categories/:id', auditLog('support', 'DELETE', 'category'), supportController.deleteCategory);

// Reports
router.get('/reports/summary', supportController.getReportSummary);
router.get('/reports/sla', supportController.getReportSLA);
router.get('/reports/agent-performance', supportController.getReportAgentPerformance);

export default router;
