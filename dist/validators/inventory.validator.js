"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTransferSchema = exports.adjustStockSchema = exports.updateWarehouseSchema = exports.createWarehouseSchema = exports.updateCategorySchema = exports.createCategorySchema = exports.updateProductSchema = exports.createProductSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const addressSchema = joi_1.default.object({
    street: joi_1.default.string().trim(),
    city: joi_1.default.string().trim(),
    state: joi_1.default.string().trim(),
    country: joi_1.default.string().trim(),
    zip: joi_1.default.string().trim(),
});
const transferItemSchema = joi_1.default.object({
    productId: joi_1.default.string().hex().length(24).required(),
    quantity: joi_1.default.number().integer().min(1).required(),
});
exports.createProductSchema = joi_1.default.object({
    name: joi_1.default.string().trim().max(200).required(),
    sku: joi_1.default.string().trim().uppercase().max(100).required(),
    categoryId: joi_1.default.string().hex().length(24),
    unit: joi_1.default.string().valid('pcs', 'kg', 'meter', 'liter', 'box', 'pack').required(),
    type: joi_1.default.string().valid('PHYSICAL', 'DIGITAL', 'SERVICE').required(),
    costPrice: joi_1.default.number().min(0),
    sellingPrice: joi_1.default.number().min(0),
    taxRate: joi_1.default.number().min(0).max(100).default(0),
    minStockLevel: joi_1.default.number().integer().min(0).default(0),
    maxStockLevel: joi_1.default.number().integer().min(0),
    reorderPoint: joi_1.default.number().integer().min(0),
    reorderQty: joi_1.default.number().integer().min(0),
    tags: joi_1.default.array().items(joi_1.default.string()),
    images: joi_1.default.array().items(joi_1.default.string()),
    description: joi_1.default.string().trim().max(2000),
    barcode: joi_1.default.string().trim().max(100),
});
exports.updateProductSchema = joi_1.default.object({
    name: joi_1.default.string().trim().max(200),
    sku: joi_1.default.string().trim().uppercase().max(100),
    categoryId: joi_1.default.string().hex().length(24).allow(null),
    unit: joi_1.default.string().valid('pcs', 'kg', 'meter', 'liter', 'box', 'pack'),
    type: joi_1.default.string().valid('PHYSICAL', 'DIGITAL', 'SERVICE'),
    costPrice: joi_1.default.number().min(0),
    sellingPrice: joi_1.default.number().min(0),
    taxRate: joi_1.default.number().min(0).max(100),
    minStockLevel: joi_1.default.number().integer().min(0),
    maxStockLevel: joi_1.default.number().integer().min(0).allow(null),
    reorderPoint: joi_1.default.number().integer().min(0),
    reorderQty: joi_1.default.number().integer().min(0),
    tags: joi_1.default.array().items(joi_1.default.string()),
    images: joi_1.default.array().items(joi_1.default.string()),
    description: joi_1.default.string().trim().max(2000).allow(''),
    barcode: joi_1.default.string().trim().max(100).allow(''),
    isActive: joi_1.default.boolean(),
}).min(1);
exports.createCategorySchema = joi_1.default.object({
    name: joi_1.default.string().trim().max(100).required(),
    code: joi_1.default.string().trim().uppercase().max(50).required(),
    description: joi_1.default.string().trim().max(500),
    parentId: joi_1.default.string().hex().length(24),
    image: joi_1.default.string().trim(),
});
exports.updateCategorySchema = joi_1.default.object({
    name: joi_1.default.string().trim().max(100),
    code: joi_1.default.string().trim().uppercase().max(50),
    description: joi_1.default.string().trim().max(500).allow(''),
    parentId: joi_1.default.string().hex().length(24).allow(null),
    image: joi_1.default.string().trim().allow(''),
}).min(1);
exports.createWarehouseSchema = joi_1.default.object({
    name: joi_1.default.string().trim().max(200).required(),
    code: joi_1.default.string().trim().uppercase().max(50).required(),
    branchId: joi_1.default.string().hex().length(24),
    address: addressSchema,
});
exports.updateWarehouseSchema = joi_1.default.object({
    name: joi_1.default.string().trim().max(200),
    code: joi_1.default.string().trim().uppercase().max(50),
    branchId: joi_1.default.string().hex().length(24).allow(null),
    address: addressSchema,
    isActive: joi_1.default.boolean(),
}).min(1);
exports.adjustStockSchema = joi_1.default.object({
    productId: joi_1.default.string().hex().length(24).required(),
    warehouseId: joi_1.default.string().hex().length(24).required(),
    type: joi_1.default.string().valid('ADD', 'REMOVE').required(),
    quantity: joi_1.default.number().integer().min(1).required(),
    movementType: joi_1.default.string()
        .valid('PURCHASE_IN', 'SALE_OUT', 'TRANSFER_IN', 'TRANSFER_OUT', 'ADJUSTMENT', 'RETURN')
        .required(),
    reason: joi_1.default.string().trim().max(500),
    reference: joi_1.default.string().trim().max(200),
});
exports.createTransferSchema = joi_1.default.object({
    fromWarehouseId: joi_1.default.string().hex().length(24).required(),
    toWarehouseId: joi_1.default.string().hex().length(24).required(),
    notes: joi_1.default.string().trim().max(1000),
    items: joi_1.default.array().items(transferItemSchema).min(1).required(),
});
//# sourceMappingURL=inventory.validator.js.map