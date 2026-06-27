"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPOFromQuoteSchema = exports.createReceiptSchema = exports.updatePOSchema = exports.createPOSchema = exports.sendRFQSchema = exports.updateRFQSchema = exports.createRFQSchema = exports.updateVendorSchema = exports.createVendorSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const addressSchema = joi_1.default.object({
    street: joi_1.default.string().trim(),
    city: joi_1.default.string().trim(),
    state: joi_1.default.string().trim(),
    country: joi_1.default.string().trim(),
    zip: joi_1.default.string().trim(),
});
exports.createVendorSchema = joi_1.default.object({
    name: joi_1.default.string().trim().max(200).required(),
    code: joi_1.default.string().trim().max(50).required(),
    email: joi_1.default.string().email().trim().lowercase(),
    phone: joi_1.default.string().trim().max(20),
    website: joi_1.default.string().uri().trim().allow(''),
    address: addressSchema,
    taxNumber: joi_1.default.string().trim(),
    paymentTerms: joi_1.default.number().integer().min(0),
    currency: joi_1.default.string().trim().uppercase().length(3),
    tags: joi_1.default.array().items(joi_1.default.string().trim()),
    notes: joi_1.default.string().trim(),
});
exports.updateVendorSchema = joi_1.default.object({
    name: joi_1.default.string().trim().max(200),
    code: joi_1.default.string().trim().max(50),
    email: joi_1.default.string().email().trim().lowercase(),
    phone: joi_1.default.string().trim().max(20),
    website: joi_1.default.string().uri().trim().allow(''),
    address: addressSchema,
    taxNumber: joi_1.default.string().trim(),
    paymentTerms: joi_1.default.number().integer().min(0),
    currency: joi_1.default.string().trim().uppercase().length(3),
    tags: joi_1.default.array().items(joi_1.default.string().trim()),
    notes: joi_1.default.string().trim(),
    isActive: joi_1.default.boolean(),
});
const rfqItemSchema = joi_1.default.object({
    description: joi_1.default.string().trim().required(),
    productId: joi_1.default.string().regex(/^[0-9a-fA-F]{24}$/),
    quantity: joi_1.default.number().integer().min(1).required(),
    unit: joi_1.default.string().trim().required(),
});
exports.createRFQSchema = joi_1.default.object({
    title: joi_1.default.string().trim().max(300).required(),
    description: joi_1.default.string().trim().allow(''),
    deadline: joi_1.default.date().greater('now').required(),
    items: joi_1.default.array().items(rfqItemSchema).min(1).required(),
});
exports.updateRFQSchema = joi_1.default.object({
    title: joi_1.default.string().trim().max(300),
    deadline: joi_1.default.date().greater('now'),
    items: joi_1.default.array().items(rfqItemSchema).min(1),
    description: joi_1.default.string().trim().allow(''),
});
exports.sendRFQSchema = joi_1.default.object({
    vendorIds: joi_1.default.array().items(joi_1.default.string().regex(/^[0-9a-fA-F]{24}$/)).min(1).required(),
    message: joi_1.default.string().trim().allow(''),
});
const poItemSchema = joi_1.default.object({
    productId: joi_1.default.string().regex(/^[0-9a-fA-F]{24}$/),
    description: joi_1.default.string().trim().required(),
    quantity: joi_1.default.number().integer().min(1).required(),
    unitPrice: joi_1.default.number().min(0).required(),
    taxRate: joi_1.default.number().min(0).default(0),
});
const deliveryAddressSchema = joi_1.default.object({
    street: joi_1.default.string().trim(),
    city: joi_1.default.string().trim(),
    state: joi_1.default.string().trim(),
    country: joi_1.default.string().trim(),
    zip: joi_1.default.string().trim(),
});
exports.createPOSchema = joi_1.default.object({
    vendorId: joi_1.default.string().regex(/^[0-9a-fA-F]{24}$/).required(),
    expectedDate: joi_1.default.date(),
    deliveryAddress: deliveryAddressSchema,
    items: joi_1.default.array().items(poItemSchema).min(1).required(),
    notes: joi_1.default.string().trim().allow(''),
    discount: joi_1.default.number().min(0).default(0),
});
exports.updatePOSchema = joi_1.default.object({
    expectedDate: joi_1.default.date(),
    notes: joi_1.default.string().trim().allow(''),
});
const receiptItemSchema = joi_1.default.object({
    poItemId: joi_1.default.string().regex(/^[0-9a-fA-F]{24}$/).required(),
    quantity: joi_1.default.number().integer().min(1).required(),
});
exports.createReceiptSchema = joi_1.default.object({
    warehouseId: joi_1.default.string().regex(/^[0-9a-fA-F]{24}$/).required(),
    receivedAt: joi_1.default.date(),
    notes: joi_1.default.string().trim().allow(''),
    items: joi_1.default.array().items(receiptItemSchema).min(1).required(),
});
exports.createPOFromQuoteSchema = joi_1.default.object({
    quoteId: joi_1.default.string().regex(/^[0-9a-fA-F]{24}$/).required(),
    deliveryAddress: deliveryAddressSchema,
    expectedDate: joi_1.default.date(),
    notes: joi_1.default.string().trim().allow(''),
});
//# sourceMappingURL=procurement.validator.js.map