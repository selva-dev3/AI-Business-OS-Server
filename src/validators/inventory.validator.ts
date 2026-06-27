import Joi from 'joi';

const addressSchema: Joi.ObjectSchema = Joi.object({
  street: Joi.string().trim(),
  city: Joi.string().trim(),
  state: Joi.string().trim(),
  country: Joi.string().trim(),
  zip: Joi.string().trim(),
});

const transferItemSchema: Joi.ObjectSchema = Joi.object({
  productId: Joi.string().hex().length(24).required(),
  quantity: Joi.number().integer().min(1).required(),
});

export const createProductSchema: Joi.ObjectSchema = Joi.object({
  name: Joi.string().trim().max(200).required(),
  sku: Joi.string().trim().uppercase().max(100).required(),
  categoryId: Joi.string().hex().length(24),
  unit: Joi.string().valid('pcs', 'kg', 'meter', 'liter', 'box', 'pack').required(),
  type: Joi.string().valid('PHYSICAL', 'DIGITAL', 'SERVICE').required(),
  costPrice: Joi.number().min(0),
  sellingPrice: Joi.number().min(0),
  taxRate: Joi.number().min(0).max(100).default(0),
  minStockLevel: Joi.number().integer().min(0).default(0),
  maxStockLevel: Joi.number().integer().min(0),
  reorderPoint: Joi.number().integer().min(0),
  reorderQty: Joi.number().integer().min(0),
  tags: Joi.array().items(Joi.string()),
  images: Joi.array().items(Joi.string()),
  description: Joi.string().trim().max(2000),
  barcode: Joi.string().trim().max(100),
});

export const updateProductSchema: Joi.ObjectSchema = Joi.object({
  name: Joi.string().trim().max(200),
  sku: Joi.string().trim().uppercase().max(100),
  categoryId: Joi.string().hex().length(24).allow(null),
  unit: Joi.string().valid('pcs', 'kg', 'meter', 'liter', 'box', 'pack'),
  type: Joi.string().valid('PHYSICAL', 'DIGITAL', 'SERVICE'),
  costPrice: Joi.number().min(0),
  sellingPrice: Joi.number().min(0),
  taxRate: Joi.number().min(0).max(100),
  minStockLevel: Joi.number().integer().min(0),
  maxStockLevel: Joi.number().integer().min(0).allow(null),
  reorderPoint: Joi.number().integer().min(0),
  reorderQty: Joi.number().integer().min(0),
  tags: Joi.array().items(Joi.string()),
  images: Joi.array().items(Joi.string()),
  description: Joi.string().trim().max(2000).allow(''),
  barcode: Joi.string().trim().max(100).allow(''),
  isActive: Joi.boolean(),
}).min(1);

export const createCategorySchema: Joi.ObjectSchema = Joi.object({
  name: Joi.string().trim().max(100).required(),
  code: Joi.string().trim().uppercase().max(50).required(),
  description: Joi.string().trim().max(500),
  parentId: Joi.string().hex().length(24),
  image: Joi.string().trim(),
});

export const updateCategorySchema: Joi.ObjectSchema = Joi.object({
  name: Joi.string().trim().max(100),
  code: Joi.string().trim().uppercase().max(50),
  description: Joi.string().trim().max(500).allow(''),
  parentId: Joi.string().hex().length(24).allow(null),
  image: Joi.string().trim().allow(''),
}).min(1);

export const createWarehouseSchema: Joi.ObjectSchema = Joi.object({
  name: Joi.string().trim().max(200).required(),
  code: Joi.string().trim().uppercase().max(50).required(),
  branchId: Joi.string().hex().length(24),
  address: addressSchema,
});

export const updateWarehouseSchema: Joi.ObjectSchema = Joi.object({
  name: Joi.string().trim().max(200),
  code: Joi.string().trim().uppercase().max(50),
  branchId: Joi.string().hex().length(24).allow(null),
  address: addressSchema,
  isActive: Joi.boolean(),
}).min(1);

export const adjustStockSchema: Joi.ObjectSchema = Joi.object({
  productId: Joi.string().hex().length(24).required(),
  warehouseId: Joi.string().hex().length(24).required(),
  type: Joi.string().valid('ADD', 'REMOVE').required(),
  quantity: Joi.number().integer().min(1).required(),
  movementType: Joi.string()
    .valid('PURCHASE_IN', 'SALE_OUT', 'TRANSFER_IN', 'TRANSFER_OUT', 'ADJUSTMENT', 'RETURN')
    .required(),
  reason: Joi.string().trim().max(500),
  reference: Joi.string().trim().max(200),
});

export const createTransferSchema: Joi.ObjectSchema = Joi.object({
  fromWarehouseId: Joi.string().hex().length(24).required(),
  toWarehouseId: Joi.string().hex().length(24).required(),
  notes: Joi.string().trim().max(1000),
  items: Joi.array().items(transferItemSchema).min(1).required(),
});
