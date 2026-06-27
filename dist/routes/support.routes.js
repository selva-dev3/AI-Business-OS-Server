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
const supportController = __importStar(require("../controllers/support.controller"));
const support_validator_1 = require("../validators/support.validator");
router.use(auth_1.authenticate);
// Tickets
router.get('/tickets', supportController.listTickets);
router.post('/tickets', (0, validate_1.validate)(support_validator_1.createTicketSchema), (0, auditLogger_1.default)('support', 'CREATE', 'ticket'), supportController.createTicket);
router.get('/tickets/:id', supportController.getTicket);
router.patch('/tickets/:id', (0, validate_1.validate)(support_validator_1.updateTicketSchema), supportController.updateTicket);
router.delete('/tickets/:id', (0, auditLogger_1.default)('support', 'DELETE', 'ticket'), supportController.deleteTicket);
router.post('/tickets/:id/reply', (0, validate_1.validate)(support_validator_1.replyTicketSchema), (0, auditLogger_1.default)('support', 'REPLY', 'ticket'), supportController.replyTicket);
router.patch('/tickets/:id/assign', (0, validate_1.validate)(support_validator_1.assignTicketSchema), (0, auditLogger_1.default)('support', 'ASSIGN', 'ticket'), supportController.assignTicket);
router.patch('/tickets/:id/status', (0, validate_1.validate)(support_validator_1.changeTicketStatusSchema), supportController.changeTicketStatus);
router.patch('/tickets/:id/priority', (0, validate_1.validate)(support_validator_1.changeTicketPrioritySchema), supportController.changeTicketPriority);
router.post('/tickets/:id/close', (0, validate_1.validate)(support_validator_1.closeTicketSchema), (0, auditLogger_1.default)('support', 'CLOSE', 'ticket'), supportController.closeTicket);
router.get('/tickets/:id/ai-summary', supportController.getTicketAISummary);
// Categories
router.get('/categories', supportController.listCategories);
router.post('/categories', (0, validate_1.validate)(support_validator_1.createCategorySchema), (0, auditLogger_1.default)('support', 'CREATE', 'category'), supportController.createCategory);
router.patch('/categories/:id', (0, validate_1.validate)(support_validator_1.updateCategorySchema), supportController.updateCategory);
router.delete('/categories/:id', (0, auditLogger_1.default)('support', 'DELETE', 'category'), supportController.deleteCategory);
// Reports
router.get('/reports/summary', supportController.getReportSummary);
router.get('/reports/sla', supportController.getReportSLA);
router.get('/reports/agent-performance', supportController.getReportAgentPerformance);
exports.default = router;
//# sourceMappingURL=support.routes.js.map