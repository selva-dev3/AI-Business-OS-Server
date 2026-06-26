const Joi = require('joi');

const addressSchema = Joi.object({
  street: Joi.string().trim(),
  city: Joi.string().trim(),
  state: Joi.string().trim(),
  country: Joi.string().trim(),
  zip: Joi.string().trim(),
});

const createVendorSchema = Joi.object({
  name: Joi.string().trim().max(200).required(),
  code: Joi.string().trim().max(50).required(),
  email: Joi.string().email().trim().lowercase(),
  phone: Joi.string().trim().max(20),
  website: Joi.string().uri().trim().allow(''),
  address: addressSchema,
  taxNumber: Joi.string().trim(),
  paymentTerms: Joi.number().integer().min(0),
  currency: Joi.string().trim().uppercase().length(3),
  tags: Joi.array().items(Joi.string().trim()),
  notes: Joi.string().trim(),
});

const updateVendorSchema = Joi.object({
  name: Joi.string().trim().max(200),
  code: Joi.string().trim().max(50),
  email: Joi.string().email().trim().lowercase(),
  phone: Joi.string().trim().max(20),
  website: Joi.string().uri().trim().allow(''),
  address: addressSchema,
  taxNumber: Joi.string().trim(),
  paymentTerms: Joi.number().integer().min(0),
  currency: Joi.string().trim().uppercase().length(3),
  tags: Joi.array().items(Joi.string().trim()),
  notes: Joi.string().trim(),
  isActive: Joi.boolean(),
});

const rfqItemSchema = Joi.object({
  description: Joi.string().trim().required(),
  productId: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
  quantity: Joi.number().integer().min(1).required(),
  unit: Joi.string().trim().required(),
});

const createRFQSchema = Joi.object({
  title: Joi.string().trim().max(300).required(),
  description: Joi.string().trim().allow(''),
  deadline: Joi.date().greater('now').required(),
  items: Joi.array().items(rfqItemSchema).min(1).required(),
});

const updateRFQSchema = Joi.object({
  title: Joi.string().trim().max(300),
  deadline: Joi.date().greater('now'),
  items: Joi.array().items(rfqItemSchema).min(1),
  description: Joi.string().trim().allow(''),
});

const sendRFQSchema = Joi.object({
  vendorIds: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)).min(1).required(),
  message: Joi.string().trim().allow(''),
});

const poItemSchema = Joi.object({
  productId: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
  description: Joi.string().trim().required(),
  quantity: Joi.number().integer().min(1).required(),
  unitPrice: Joi.number().min(0).required(),
  taxRate: Joi.number().min(0).default(0),
});

const deliveryAddressSchema = Joi.object({
  street: Joi.string().trim(),
  city: Joi.string().trim(),
  state: Joi.string().trim(),
  country: Joi.string().trim(),
  zip: Joi.string().trim(),
});

const createPOSchema = Joi.object({
  vendorId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
  expectedDate: Joi.date(),
  deliveryAddress: deliveryAddressSchema,
  items: Joi.array().items(poItemSchema).min(1).required(),
  notes: Joi.string().trim().allow(''),
  discount: Joi.number().min(0).default(0),
});

const updatePOSchema = Joi.object({
  expectedDate: Joi.date(),
  notes: Joi.string().trim().allow(''),
});

const receiptItemSchema = Joi.object({
  poItemId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
  quantity: Joi.number().integer().min(1).required(),
});

const createReceiptSchema = Joi.object({
  warehouseId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
  receivedAt: Joi.date(),
  notes: Joi.string().trim().allow(''),
  items: Joi.array().items(receiptItemSchema).min(1).required(),
});

const createPOFromQuoteSchema = Joi.object({
  quoteId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
  deliveryAddress: deliveryAddressSchema,
  expectedDate: Joi.date(),
  notes: Joi.string().trim().allow(''),
});

module.exports = {
  createVendorSchema,
  updateVendorSchema,
  createRFQSchema,
  updateRFQSchema,
  sendRFQSchema,
  createPOSchema,
  updatePOSchema,
  createReceiptSchema,
  createPOFromQuoteSchema,
};
