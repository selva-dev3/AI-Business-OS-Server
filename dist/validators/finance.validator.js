"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scheduleReportSchema = exports.updateBudgetSchema = exports.createBudgetSchema = exports.rejectExpenseSchema = exports.approveExpenseSchema = exports.updateExpenseSchema = exports.createExpenseSchema = exports.recordPaymentSchema = exports.sendInvoiceSchema = exports.updateInvoiceSchema = exports.createInvoiceSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const invoiceItemSchema = joi_1.default.object({
    productId: joi_1.default.string().hex().length(24),
    description: joi_1.default.string().trim().max(1000).required(),
    quantity: joi_1.default.number().min(0).required(),
    unitPrice: joi_1.default.number().min(0).required(),
    taxRate: joi_1.default.number().min(0).max(100).default(0),
    discount: joi_1.default.number().min(0).default(0),
});
exports.createInvoiceSchema = joi_1.default.object({
    type: joi_1.default.string().valid('SALES', 'PURCHASE', 'EXPENSE').required(),
    accountId: joi_1.default.string().hex().length(24).required(),
    issueDate: joi_1.default.date().iso().required(),
    dueDate: joi_1.default.date().iso().required(),
    currency: joi_1.default.string().trim().uppercase().length(3).default('INR'),
    discount: joi_1.default.number().min(0).default(0),
    notes: joi_1.default.string().trim().max(2000),
    termsAndConditions: joi_1.default.string().trim().max(5000),
    items: joi_1.default.array().items(invoiceItemSchema).min(1).required(),
});
exports.updateInvoiceSchema = joi_1.default.object({
    dueDate: joi_1.default.date().iso(),
    notes: joi_1.default.string().trim().max(2000).allow(''),
}).min(1);
exports.sendInvoiceSchema = joi_1.default.object({
    to: joi_1.default.string().email().required(),
    cc: joi_1.default.array().items(joi_1.default.string().email()).default([]),
    subject: joi_1.default.string().trim().max(500).required(),
    message: joi_1.default.string().trim().max(5000),
});
exports.recordPaymentSchema = joi_1.default.object({
    amount: joi_1.default.number().min(0.01).required(),
    method: joi_1.default.string().valid('BANK_TRANSFER', 'CASH', 'CHEQUE', 'CARD', 'ONLINE', 'OTHER').required(),
    reference: joi_1.default.string().trim().max(500),
    paidAt: joi_1.default.date().iso().required(),
    notes: joi_1.default.string().trim().max(2000),
});
exports.createExpenseSchema = joi_1.default.object({
    title: joi_1.default.string().trim().max(500).required(),
    category: joi_1.default.string().valid('Travel', 'Accommodation', 'Food', 'Transport', 'Office', 'Software', 'Hardware', 'Other').required(),
    amount: joi_1.default.number().min(0).required(),
    currency: joi_1.default.string().trim().uppercase().length(3).default('INR'),
    date: joi_1.default.date().iso().required(),
    receipt: joi_1.default.string().trim(),
    notes: joi_1.default.string().trim().max(2000),
});
exports.updateExpenseSchema = joi_1.default.object({
    title: joi_1.default.string().trim().max(500),
    category: joi_1.default.string().valid('Travel', 'Accommodation', 'Food', 'Transport', 'Office', 'Software', 'Hardware', 'Other'),
    amount: joi_1.default.number().min(0),
    currency: joi_1.default.string().trim().uppercase().length(3),
    date: joi_1.default.date().iso(),
    receipt: joi_1.default.string().trim().allow(''),
    notes: joi_1.default.string().trim().max(2000).allow(''),
}).min(1);
exports.approveExpenseSchema = joi_1.default.object({
    notes: joi_1.default.string().trim().max(2000).allow(''),
});
exports.rejectExpenseSchema = joi_1.default.object({
    notes: joi_1.default.string().trim().max(2000).allow(''),
});
exports.createBudgetSchema = joi_1.default.object({
    name: joi_1.default.string().trim().max(500).required(),
    year: joi_1.default.number().integer().min(1900).max(2100).required(),
    month: joi_1.default.number().integer().min(1).max(12),
    department: joi_1.default.string().trim().max(200).required(),
    category: joi_1.default.string().trim().max(200).required(),
    amount: joi_1.default.number().min(0).required(),
});
exports.updateBudgetSchema = joi_1.default.object({
    name: joi_1.default.string().trim().max(500),
    amount: joi_1.default.number().min(0),
}).min(1);
exports.scheduleReportSchema = joi_1.default.object({
    reportType: joi_1.default.string().trim().required(),
    frequency: joi_1.default.string().valid('ONCE', 'DAILY', 'WEEKLY', 'MONTHLY').required(),
    dayOfMonth: joi_1.default.number().integer().min(1).max(31),
    recipients: joi_1.default.array().items(joi_1.default.string().email()).min(1).required(),
    format: joi_1.default.string().valid('pdf', 'xlsx', 'csv').required(),
});
//# sourceMappingURL=finance.validator.js.map