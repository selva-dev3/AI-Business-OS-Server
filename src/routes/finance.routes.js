const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { receiptUpload, handleUploadError } = require('../middleware/upload');
const auditLog = require('../middleware/auditLogger');
const financeController = require('../controllers/finance.controller');
const {
  createInvoiceSchema,
  updateInvoiceSchema,
  sendInvoiceSchema,
  recordPaymentSchema,
  createExpenseSchema,
  updateExpenseSchema,
  approveExpenseSchema,
  rejectExpenseSchema,
  createBudgetSchema,
  updateBudgetSchema,
  scheduleReportSchema,
} = require('../validators/finance.validator');

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
router.get('/invoices', authenticate, financeController.listInvoices);

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
router.post('/invoices', authenticate, validate(createInvoiceSchema), auditLog('finance', 'CREATE', 'invoice'), financeController.createInvoice);

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
router.get('/invoices/:id', authenticate, financeController.getInvoice);

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
router.patch('/invoices/:id', authenticate, validate(updateInvoiceSchema), auditLog('finance', 'UPDATE', 'invoice'), financeController.updateInvoice);

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
router.delete('/invoices/:id', authenticate, auditLog('finance', 'DELETE', 'invoice'), financeController.deleteInvoice);

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
router.post('/invoices/:id/send', authenticate, validate(sendInvoiceSchema), auditLog('finance', 'SEND', 'invoice'), financeController.sendInvoice);

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
router.post('/invoices/:id/payment', authenticate, validate(recordPaymentSchema), auditLog('finance', 'PAYMENT', 'invoice'), financeController.recordPayment);

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
router.get('/invoices/:id/payments', authenticate, financeController.getInvoicePayments);

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
router.get('/invoices/:id/pdf', authenticate, financeController.getInvoicePDF);

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
router.get('/invoices/export', authenticate, financeController.exportInvoices);

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
router.get('/expenses', authenticate, financeController.listExpenses);

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
router.post('/expenses', authenticate, validate(createExpenseSchema), auditLog('finance', 'CREATE', 'expense'), financeController.createExpense);

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
router.get('/expenses/:id', authenticate, financeController.getExpense);

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
router.patch('/expenses/:id', authenticate, validate(updateExpenseSchema), auditLog('finance', 'UPDATE', 'expense'), financeController.updateExpense);

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
router.delete('/expenses/:id', authenticate, auditLog('finance', 'DELETE', 'expense'), financeController.deleteExpense);

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
router.patch('/expenses/:id/approve', authenticate, validate(approveExpenseSchema), auditLog('finance', 'APPROVE', 'expense'), financeController.approveExpense);

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
router.patch('/expenses/:id/reject', authenticate, validate(rejectExpenseSchema), auditLog('finance', 'REJECT', 'expense'), financeController.rejectExpense);

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
router.post('/expenses/:id/receipt', authenticate, receiptUpload, handleUploadError, financeController.uploadExpenseReceipt);

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
router.get('/payments', authenticate, financeController.listPayments);

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
router.get('/payments/:id', authenticate, financeController.getPayment);

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
router.get('/reports/profit-loss', authenticate, financeController.profitLoss);

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
router.get('/reports/balance-sheet', authenticate, financeController.balanceSheet);

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
router.get('/reports/cash-flow', authenticate, financeController.cashFlow);

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
router.get('/reports/tax-report', authenticate, financeController.taxReport);

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
router.get('/reports/ar-aging', authenticate, financeController.arAging);

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
router.get('/reports/ap-aging', authenticate, financeController.apAging);

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
router.post('/reports/schedule', authenticate, validate(scheduleReportSchema), financeController.scheduleReport);

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
router.get('/budgets', authenticate, financeController.listBudgets);

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
router.post('/budgets', authenticate, validate(createBudgetSchema), auditLog('finance', 'CREATE', 'budget'), financeController.createBudget);

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
router.patch('/budgets/:id', authenticate, validate(updateBudgetSchema), auditLog('finance', 'UPDATE', 'budget'), financeController.updateBudget);

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
router.delete('/budgets/:id', authenticate, auditLog('finance', 'DELETE', 'budget'), financeController.deleteBudget);

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
router.get('/budgets/vs-actual', authenticate, financeController.budgetVsActual);

module.exports = router;
