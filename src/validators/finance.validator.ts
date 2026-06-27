import Joi from 'joi';

const invoiceItemSchema: Joi.ObjectSchema = Joi.object({
  productId: Joi.string().hex().length(24),
  description: Joi.string().trim().max(1000).required(),
  quantity: Joi.number().min(0).required(),
  unitPrice: Joi.number().min(0).required(),
  taxRate: Joi.number().min(0).max(100).default(0),
  discount: Joi.number().min(0).default(0),
});

export const createInvoiceSchema: Joi.ObjectSchema = Joi.object({
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

export const updateInvoiceSchema: Joi.ObjectSchema = Joi.object({
  dueDate: Joi.date().iso(),
  notes: Joi.string().trim().max(2000).allow(''),
}).min(1);

export const sendInvoiceSchema: Joi.ObjectSchema = Joi.object({
  to: Joi.string().email().required(),
  cc: Joi.array().items(Joi.string().email()).default([]),
  subject: Joi.string().trim().max(500).required(),
  message: Joi.string().trim().max(5000),
});

export const recordPaymentSchema: Joi.ObjectSchema = Joi.object({
  amount: Joi.number().min(0.01).required(),
  method: Joi.string().valid('BANK_TRANSFER', 'CASH', 'CHEQUE', 'CARD', 'ONLINE', 'OTHER').required(),
  reference: Joi.string().trim().max(500),
  paidAt: Joi.date().iso().required(),
  notes: Joi.string().trim().max(2000),
});

export const createExpenseSchema: Joi.ObjectSchema = Joi.object({
  title: Joi.string().trim().max(500).required(),
  category: Joi.string().valid('Travel', 'Accommodation', 'Food', 'Transport', 'Office', 'Software', 'Hardware', 'Other').required(),
  amount: Joi.number().min(0).required(),
  currency: Joi.string().trim().uppercase().length(3).default('INR'),
  date: Joi.date().iso().required(),
  receipt: Joi.string().trim(),
  notes: Joi.string().trim().max(2000),
});

export const updateExpenseSchema: Joi.ObjectSchema = Joi.object({
  title: Joi.string().trim().max(500),
  category: Joi.string().valid('Travel', 'Accommodation', 'Food', 'Transport', 'Office', 'Software', 'Hardware', 'Other'),
  amount: Joi.number().min(0),
  currency: Joi.string().trim().uppercase().length(3),
  date: Joi.date().iso(),
  receipt: Joi.string().trim().allow(''),
  notes: Joi.string().trim().max(2000).allow(''),
}).min(1);

export const approveExpenseSchema: Joi.ObjectSchema = Joi.object({
  notes: Joi.string().trim().max(2000).allow(''),
});

export const rejectExpenseSchema: Joi.ObjectSchema = Joi.object({
  notes: Joi.string().trim().max(2000).allow(''),
});

export const createBudgetSchema: Joi.ObjectSchema = Joi.object({
  name: Joi.string().trim().max(500).required(),
  year: Joi.number().integer().min(1900).max(2100).required(),
  month: Joi.number().integer().min(1).max(12),
  department: Joi.string().trim().max(200).required(),
  category: Joi.string().trim().max(200).required(),
  amount: Joi.number().min(0).required(),
});

export const updateBudgetSchema: Joi.ObjectSchema = Joi.object({
  name: Joi.string().trim().max(500),
  amount: Joi.number().min(0),
}).min(1);

export const scheduleReportSchema: Joi.ObjectSchema = Joi.object({
  reportType: Joi.string().trim().required(),
  frequency: Joi.string().valid('ONCE', 'DAILY', 'WEEKLY', 'MONTHLY').required(),
  dayOfMonth: Joi.number().integer().min(1).max(31),
  recipients: Joi.array().items(Joi.string().email()).min(1).required(),
  format: Joi.string().valid('pdf', 'xlsx', 'csv').required(),
});
