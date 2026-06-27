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
exports.budgetVsActual = exports.deleteBudget = exports.updateBudget = exports.createBudget = exports.listBudgets = exports.scheduleReport = exports.apAging = exports.arAging = exports.taxReport = exports.cashFlow = exports.balanceSheet = exports.profitLoss = exports.getPayment = exports.listPayments = exports.uploadExpenseReceipt = exports.rejectExpense = exports.approveExpense = exports.deleteExpense = exports.updateExpense = exports.getExpense = exports.createExpense = exports.listExpenses = exports.exportInvoices = exports.getInvoicePDF = exports.getInvoicePayments = exports.recordPayment = exports.sendInvoice = exports.deleteInvoice = exports.updateInvoice = exports.getInvoice = exports.createInvoice = exports.listInvoices = void 0;
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const financeService = __importStar(require("../services/finance.service"));
const apiResponse_1 = __importDefault(require("../utils/apiResponse"));
exports.listInvoices = (0, catchAsync_1.default)(async (req, res, _next) => {
    const companyId = req.companyId;
    const result = await financeService.listInvoices(companyId, req.query);
    apiResponse_1.default.paginated(res, result.data, result.meta);
});
exports.createInvoice = (0, catchAsync_1.default)(async (req, res, _next) => {
    const invoice = await financeService.createInvoice(req.companyId, req.body);
    apiResponse_1.default.created(res, invoice);
});
exports.getInvoice = (0, catchAsync_1.default)(async (req, res, _next) => {
    const invoice = await financeService.getInvoiceById(req.companyId, req.params.id);
    apiResponse_1.default.success(res, invoice);
});
exports.updateInvoice = (0, catchAsync_1.default)(async (req, res, _next) => {
    const invoice = await financeService.updateInvoice(req.companyId, req.params.id, req.body);
    apiResponse_1.default.success(res, invoice);
});
exports.deleteInvoice = (0, catchAsync_1.default)(async (req, res, _next) => {
    const result = await financeService.removeInvoice(req.companyId, req.params.id);
    apiResponse_1.default.success(res, result);
});
exports.sendInvoice = (0, catchAsync_1.default)(async (req, res, _next) => {
    const invoice = await financeService.sendInvoice(req.companyId, req.params.id, req.body);
    apiResponse_1.default.success(res, invoice);
});
exports.recordPayment = (0, catchAsync_1.default)(async (req, res, _next) => {
    const payment = await financeService.recordPayment(req.companyId, req.user._id.toString(), req.params.id, req.body);
    apiResponse_1.default.created(res, payment);
});
exports.getInvoicePayments = (0, catchAsync_1.default)(async (req, res, _next) => {
    const payments = await financeService.getInvoicePayments(req.companyId, req.params.id);
    apiResponse_1.default.success(res, payments);
});
exports.getInvoicePDF = (0, catchAsync_1.default)(async (req, res, _next) => {
    const pdfBuffer = await financeService.getInvoicePDF(req.companyId, req.params.id);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=invoice-${req.params.id}.pdf`);
    res.send(pdfBuffer);
});
exports.exportInvoices = (0, catchAsync_1.default)(async (req, res, _next) => {
    const invoices = await financeService.exportInvoices(req.companyId, req.query);
    apiResponse_1.default.success(res, invoices);
});
exports.listExpenses = (0, catchAsync_1.default)(async (req, res, _next) => {
    const companyId = req.companyId;
    const result = await financeService.listExpenses(companyId, req.query);
    apiResponse_1.default.paginated(res, result.data, result.meta);
});
exports.createExpense = (0, catchAsync_1.default)(async (req, res, _next) => {
    const expense = await financeService.createExpense(req.companyId, req.user._id.toString(), req.body);
    apiResponse_1.default.created(res, expense);
});
exports.getExpense = (0, catchAsync_1.default)(async (req, res, _next) => {
    const expense = await financeService.getExpenseById(req.companyId, req.params.id);
    apiResponse_1.default.success(res, expense);
});
exports.updateExpense = (0, catchAsync_1.default)(async (req, res, _next) => {
    const expense = await financeService.updateExpense(req.companyId, req.params.id, req.body);
    apiResponse_1.default.success(res, expense);
});
exports.deleteExpense = (0, catchAsync_1.default)(async (req, res, _next) => {
    const result = await financeService.removeExpense(req.companyId, req.params.id);
    apiResponse_1.default.success(res, result);
});
exports.approveExpense = (0, catchAsync_1.default)(async (req, res, _next) => {
    const expense = await financeService.approveExpense(req.companyId, req.params.id, req.user._id.toString(), req.body);
    apiResponse_1.default.success(res, expense);
});
exports.rejectExpense = (0, catchAsync_1.default)(async (req, res, _next) => {
    const expense = await financeService.rejectExpense(req.companyId, req.params.id, req.user._id.toString(), req.body);
    apiResponse_1.default.success(res, expense);
});
exports.uploadExpenseReceipt = (0, catchAsync_1.default)(async (req, res, _next) => {
    if (!req.file) {
        res.status(400).json({ message: 'No file uploaded' });
        return;
    }
    const expense = await financeService.uploadExpenseReceipt(req.companyId, req.params.id, req.file);
    apiResponse_1.default.success(res, expense);
});
exports.listPayments = (0, catchAsync_1.default)(async (req, res, _next) => {
    const companyId = req.companyId;
    const result = await financeService.listPayments(companyId, req.query);
    apiResponse_1.default.paginated(res, result.data, result.meta);
});
exports.getPayment = (0, catchAsync_1.default)(async (req, res, _next) => {
    const payment = await financeService.getPaymentById(req.companyId, req.params.id);
    apiResponse_1.default.success(res, payment);
});
exports.profitLoss = (0, catchAsync_1.default)(async (req, res, _next) => {
    const report = await financeService.profitLoss(req.companyId, req.query);
    apiResponse_1.default.success(res, report);
});
exports.balanceSheet = (0, catchAsync_1.default)(async (req, res, _next) => {
    const report = await financeService.balanceSheet(req.companyId, req.query);
    apiResponse_1.default.success(res, report);
});
exports.cashFlow = (0, catchAsync_1.default)(async (req, res, _next) => {
    const report = await financeService.cashFlow(req.companyId, req.query);
    apiResponse_1.default.success(res, report);
});
exports.taxReport = (0, catchAsync_1.default)(async (req, res, _next) => {
    const report = await financeService.taxReport(req.companyId, req.query);
    apiResponse_1.default.success(res, report);
});
exports.arAging = (0, catchAsync_1.default)(async (req, res, _next) => {
    const report = await financeService.arAging(req.companyId);
    apiResponse_1.default.success(res, report);
});
exports.apAging = (0, catchAsync_1.default)(async (req, res, _next) => {
    const report = await financeService.apAging(req.companyId);
    apiResponse_1.default.success(res, report);
});
exports.scheduleReport = (0, catchAsync_1.default)(async (req, res, _next) => {
    const schedule = await financeService.scheduleReport(req.companyId, req.body);
    apiResponse_1.default.created(res, schedule);
});
exports.listBudgets = (0, catchAsync_1.default)(async (req, res, _next) => {
    const companyId = req.companyId;
    const result = await financeService.listBudgets(companyId, req.query);
    apiResponse_1.default.paginated(res, result.data, result.meta);
});
exports.createBudget = (0, catchAsync_1.default)(async (req, res, _next) => {
    const budget = await financeService.createBudget(req.companyId, req.body);
    apiResponse_1.default.created(res, budget);
});
exports.updateBudget = (0, catchAsync_1.default)(async (req, res, _next) => {
    const budget = await financeService.updateBudget(req.companyId, req.params.id, req.body);
    apiResponse_1.default.success(res, budget);
});
exports.deleteBudget = (0, catchAsync_1.default)(async (req, res, _next) => {
    const result = await financeService.removeBudget(req.companyId, req.params.id);
    apiResponse_1.default.success(res, result);
});
exports.budgetVsActual = (0, catchAsync_1.default)(async (req, res, _next) => {
    const comparison = await financeService.budgetVsActual(req.companyId, req.query);
    apiResponse_1.default.success(res, comparison);
});
//# sourceMappingURL=finance.controller.js.map