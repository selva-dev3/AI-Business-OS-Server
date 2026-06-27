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
const upload_1 = require("../middleware/upload");
const auditLogger_1 = __importDefault(require("../middleware/auditLogger"));
const financeController = __importStar(require("../controllers/finance.controller"));
const finance_validator_1 = require("../validators/finance.validator");
/**
 * @swagger
 * tags:
 *   name: Finance
 *   description: Finance module - Invoices, Expenses, Payments, Budgets, Reports
 */
/**
 * @swagger
 * /finance/invoices:
 *   get:
 *     summary: List all invoices
 *     tags: [Finance]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: type
 *         schema: { type: string, enum: [SALES, PURCHASE, EXPENSE] }
 *       - in: query
 *         name: status
 *         schema: { type: string }
 *       - in: query
 *         name: accountId
 *         schema: { type: string }
 *       - in: query
 *         name: startDate
 *         schema: { type: string, format: date }
 *       - in: query
 *         name: endDate
 *         schema: { type: string, format: date }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *     responses:
 *       200:
 *         description: Paginated list of invoices
 */
router.get('/invoices', auth_1.authenticate, financeController.listInvoices);
/**
 * @swagger
 * /finance/invoices:
 *   post:
 *     summary: Create a new invoice
 *     tags: [Finance]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       201:
 *         description: Invoice created
 */
router.post('/invoices', auth_1.authenticate, (0, validate_1.validate)(finance_validator_1.createInvoiceSchema), (0, auditLogger_1.default)('finance', 'CREATE', 'invoice'), financeController.createInvoice);
/**
 * @swagger
 * /finance/invoices/{id}:
 *   get:
 *     summary: Get invoice by ID
 *     tags: [Finance]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Invoice details with items and payments
 */
router.get('/invoices/:id', auth_1.authenticate, financeController.getInvoice);
/**
 * @swagger
 * /finance/invoices/{id}:
 *   patch:
 *     summary: Update invoice
 *     tags: [Finance]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Invoice updated
 */
router.patch('/invoices/:id', auth_1.authenticate, (0, validate_1.validate)(finance_validator_1.updateInvoiceSchema), (0, auditLogger_1.default)('finance', 'UPDATE', 'invoice'), financeController.updateInvoice);
/**
 * @swagger
 * /finance/invoices/{id}:
 *   delete:
 *     summary: Void/Cancel an invoice
 *     tags: [Finance]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Invoice voided
 */
router.delete('/invoices/:id', auth_1.authenticate, (0, auditLogger_1.default)('finance', 'DELETE', 'invoice'), financeController.deleteInvoice);
/**
 * @swagger
 * /finance/invoices/{id}/send:
 *   post:
 *     summary: Send invoice via email
 *     tags: [Finance]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Invoice sent
 */
router.post('/invoices/:id/send', auth_1.authenticate, (0, validate_1.validate)(finance_validator_1.sendInvoiceSchema), (0, auditLogger_1.default)('finance', 'SEND', 'invoice'), financeController.sendInvoice);
/**
 * @swagger
 * /finance/invoices/{id}/payment:
 *   post:
 *     summary: Record a payment against an invoice
 *     tags: [Finance]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       201:
 *         description: Payment recorded
 */
router.post('/invoices/:id/payment', auth_1.authenticate, (0, validate_1.validate)(finance_validator_1.recordPaymentSchema), (0, auditLogger_1.default)('finance', 'PAYMENT', 'invoice'), financeController.recordPayment);
/**
 * @swagger
 * /finance/invoices/{id}/payments:
 *   get:
 *     summary: Get all payments for an invoice
 *     tags: [Finance]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: List of payments
 */
router.get('/invoices/:id/payments', auth_1.authenticate, financeController.getInvoicePayments);
/**
 * @swagger
 * /finance/invoices/{id}/pdf:
 *   get:
 *     summary: Download invoice as PDF
 *     tags: [Finance]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: PDF file
 */
router.get('/invoices/:id/pdf', auth_1.authenticate, financeController.getInvoicePDF);
/**
 * @swagger
 * /finance/invoices/export:
 *   get:
 *     summary: Export invoices
 *     tags: [Finance]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Exported invoices
 */
router.get('/invoices/export', auth_1.authenticate, financeController.exportInvoices);
/**
 * @swagger
 * /finance/expenses:
 *   get:
 *     summary: List all expenses
 *     tags: [Finance]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Paginated list of expenses
 */
router.get('/expenses', auth_1.authenticate, financeController.listExpenses);
/**
 * @swagger
 * /finance/expenses:
 *   post:
 *     summary: Create a new expense
 *     tags: [Finance]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       201:
 *         description: Expense created
 */
router.post('/expenses', auth_1.authenticate, (0, validate_1.validate)(finance_validator_1.createExpenseSchema), (0, auditLogger_1.default)('finance', 'CREATE', 'expense'), financeController.createExpense);
/**
 * @swagger
 * /finance/expenses/{id}:
 *   get:
 *     summary: Get expense by ID
 *     tags: [Finance]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Expense details
 */
router.get('/expenses/:id', auth_1.authenticate, financeController.getExpense);
/**
 * @swagger
 * /finance/expenses/{id}:
 *   patch:
 *     summary: Update expense
 *     tags: [Finance]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Expense updated
 */
router.patch('/expenses/:id', auth_1.authenticate, (0, validate_1.validate)(finance_validator_1.updateExpenseSchema), (0, auditLogger_1.default)('finance', 'UPDATE', 'expense'), financeController.updateExpense);
/**
 * @swagger
 * /finance/expenses/{id}:
 *   delete:
 *     summary: Delete expense
 *     tags: [Finance]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Expense deleted
 */
router.delete('/expenses/:id', auth_1.authenticate, (0, auditLogger_1.default)('finance', 'DELETE', 'expense'), financeController.deleteExpense);
/**
 * @swagger
 * /finance/expenses/{id}/approve:
 *   patch:
 *     summary: Approve an expense
 *     tags: [Finance]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Expense approved
 */
router.patch('/expenses/:id/approve', auth_1.authenticate, (0, validate_1.validate)(finance_validator_1.approveExpenseSchema), (0, auditLogger_1.default)('finance', 'APPROVE', 'expense'), financeController.approveExpense);
/**
 * @swagger
 * /finance/expenses/{id}/reject:
 *   patch:
 *     summary: Reject an expense
 *     tags: [Finance]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Expense rejected
 */
router.patch('/expenses/:id/reject', auth_1.authenticate, (0, validate_1.validate)(finance_validator_1.rejectExpenseSchema), (0, auditLogger_1.default)('finance', 'REJECT', 'expense'), financeController.rejectExpense);
/**
 * @swagger
 * /finance/expenses/{id}/receipt:
 *   post:
 *     summary: Upload receipt for an expense
 *     tags: [Finance]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Receipt uploaded
 */
router.post('/expenses/:id/receipt', auth_1.authenticate, upload_1.receiptUpload, upload_1.handleUploadError, financeController.uploadExpenseReceipt);
/**
 * @swagger
 * /finance/payments:
 *   get:
 *     summary: List all payments
 *     tags: [Finance]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Paginated list of payments
 */
router.get('/payments', auth_1.authenticate, financeController.listPayments);
/**
 * @swagger
 * /finance/payments/{id}:
 *   get:
 *     summary: Get payment by ID
 *     tags: [Finance]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Payment details
 */
router.get('/payments/:id', auth_1.authenticate, financeController.getPayment);
/**
 * @swagger
 * /finance/reports/profit-loss:
 *   get:
 *     summary: Profit & Loss report
 *     tags: [Finance]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: P&L report
 */
router.get('/reports/profit-loss', auth_1.authenticate, financeController.profitLoss);
/**
 * @swagger
 * /finance/reports/balance-sheet:
 *   get:
 *     summary: Balance sheet report
 *     tags: [Finance]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Balance sheet
 */
router.get('/reports/balance-sheet', auth_1.authenticate, financeController.balanceSheet);
/**
 * @swagger
 * /finance/reports/cash-flow:
 *   get:
 *     summary: Cash flow report
 *     tags: [Finance]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Cash flow
 */
router.get('/reports/cash-flow', auth_1.authenticate, financeController.cashFlow);
/**
 * @swagger
 * /finance/reports/tax-report:
 *   get:
 *     summary: Tax report
 *     tags: [Finance]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Tax report
 */
router.get('/reports/tax-report', auth_1.authenticate, financeController.taxReport);
/**
 * @swagger
 * /finance/reports/ar-aging:
 *   get:
 *     summary: Accounts Receivable aging report
 *     tags: [Finance]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: AR aging
 */
router.get('/reports/ar-aging', auth_1.authenticate, financeController.arAging);
/**
 * @swagger
 * /finance/reports/ap-aging:
 *   get:
 *     summary: Accounts Payable aging report
 *     tags: [Finance]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: AP aging
 */
router.get('/reports/ap-aging', auth_1.authenticate, financeController.apAging);
/**
 * @swagger
 * /finance/reports/schedule:
 *   post:
 *     summary: Schedule a report
 *     tags: [Finance]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       201:
 *         description: Report scheduled
 */
router.post('/reports/schedule', auth_1.authenticate, (0, validate_1.validate)(finance_validator_1.scheduleReportSchema), financeController.scheduleReport);
/**
 * @swagger
 * /finance/budgets:
 *   get:
 *     summary: List all budgets
 *     tags: [Finance]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: year
 *         schema: { type: integer }
 *       - in: query
 *         name: month
 *         schema: { type: integer }
 *       - in: query
 *         name: department
 *         schema: { type: string }
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Paginated list of budgets
 */
router.get('/budgets', auth_1.authenticate, financeController.listBudgets);
/**
 * @swagger
 * /finance/budgets:
 *   post:
 *     summary: Create a new budget
 *     tags: [Finance]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       201:
 *         description: Budget created
 */
router.post('/budgets', auth_1.authenticate, (0, validate_1.validate)(finance_validator_1.createBudgetSchema), (0, auditLogger_1.default)('finance', 'CREATE', 'budget'), financeController.createBudget);
/**
 * @swagger
 * /finance/budgets/{id}:
 *   patch:
 *     summary: Update a budget
 *     tags: [Finance]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Budget updated
 */
router.patch('/budgets/:id', auth_1.authenticate, (0, validate_1.validate)(finance_validator_1.updateBudgetSchema), (0, auditLogger_1.default)('finance', 'UPDATE', 'budget'), financeController.updateBudget);
/**
 * @swagger
 * /finance/budgets/{id}:
 *   delete:
 *     summary: Delete a budget
 *     tags: [Finance]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Budget deleted
 */
router.delete('/budgets/:id', auth_1.authenticate, (0, auditLogger_1.default)('finance', 'DELETE', 'budget'), financeController.deleteBudget);
/**
 * @swagger
 * /finance/budgets/vs-actual:
 *   get:
 *     summary: Budget vs Actual comparison
 *     tags: [Finance]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Budget vs actual
 */
router.get('/budgets/vs-actual', auth_1.authenticate, financeController.budgetVsActual);
exports.default = router;
//# sourceMappingURL=finance.routes.js.map