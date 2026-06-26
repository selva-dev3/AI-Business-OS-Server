const Joi = require('joi');

const invoiceItemSchema = Joi.object({
  productId: Joi.string().hex().length(24),
  description: Joi.string().trim().max(1000).required(),
  quantity: Joi.number().min(0).required(),
  unitPrice: Joi.number().min(0).required(),
  taxRate: Joi.number().min(0).max(100).default(0),
  discount: Joi.number().min(0).default(0),
});

const createInvoiceSchema = Joi.object({
  type: Joi.string().valid('SALES', 'PURCHASE', 'EXPENSE').required(),
  accountId: Joi.string().hex().length(24).required(),
  issueDate: Joi.date().iso().required(),
  dueDate: Joi.date().iso().required(),
  currency: Joi.string().trim().uppercase().length(3).default('INR'),
  discount: Joi.number().min(0).default(0),
  notes: Joi.string().trim().max(2000),
  termsAndConditions: Joi.string().trim().max(5000),
  items: Joi.array().items(invoiceItemSchema).min(1).required(),
});

const updateInvoiceSchema = Joi.object({
  dueDate: Joi.date().iso(),
  notes: Joi.string().trim().max(2000).allow(''),
}).min(1);

const sendInvoiceSchema = Joi.object({
  to: Joi.string().email().required(),
  cc: Joi.array().items(Joi.string().email()).default([]),
  subject: Joi.string().trim().max(500).required(),
  message: Joi.string().trim().max(5000),
});

const recordPaymentSchema = Joi.object({
  amount: Joi.number().min(0.01).required(),
  method: Joi.string().valid('BANK_TRANSFER', 'CASH', 'CHEQUE', 'CARD', 'ONLINE', 'OTHER').required(),
  reference: Joi.string().trim().max(500),
  paidAt: Joi.date().iso().required(),
  notes: Joi.string().trim().max(2000),
});

const createExpenseSchema = Joi.object({
  title: Joi.string().trim().max(500).required(),
  category: Joi.string().valid('Travel', 'Accommodation', 'Food', 'Transport', 'Office', 'Software', 'Hardware', 'Other').required(),
  amount: Joi.number().min(0).required(),
  currency: Joi.string().trim().uppercase().length(3).default('INR'),
  date: Joi.date().iso().required(),
  receipt: Joi.string().trim(),
  notes: Joi.string().trim().max(2000),
});

const updateExpenseSchema = Joi.object({
  title: Joi.string().trim().max(500),
  category: Joi.string().valid('Travel', 'Accommodation', 'Food', 'Transport', 'Office', 'Software', 'Hardware', 'Other'),
  amount: Joi.number().min(0),
  currency: Joi.string().trim().uppercase().length(3),
  date: Joi.date().iso(),
  receipt: Joi.string().trim().allow(''),
  notes: Joi.string().trim().max(2000).allow(''),
}).min(1);

const approveExpenseSchema = Joi.object({
  notes: Joi.string().trim().max(2000).allow(''),
});

const rejectExpenseSchema = Joi.object({
  notes: Joi.string().trim().max(2000).allow(''),
});

const createBudgetSchema = Joi.object({
  name: Joi.string().trim().max(500).required(),
  year: Joi.number().integer().min(1900).max(2100).required(),
  month: Joi.number().integer().min(1).max(12),
  department: Joi.string().trim().max(200).required(),
  category: Joi.string().trim().max(200).required(),
  amount: Joi.number().min(0).required(),
});

const updateBudgetSchema = Joi.object({
  name: Joi.string().trim().max(500),
  amount: Joi.number().min(0),
}).min(1);

const scheduleReportSchema = Joi.object({
  reportType: Joi.string().trim().required(),
  frequency: Joi.string().valid('ONCE', 'DAILY', 'WEEKLY', 'MONTHLY').required(),
  dayOfMonth: Joi.number().integer().min(1).max(31),
  recipients: Joi.array().items(Joi.string().email()).min(1).required(),
  format: Joi.string().valid('pdf', 'xlsx', 'csv').required(),
});

module.exports = {
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
};
