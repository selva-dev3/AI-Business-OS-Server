"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const productSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true,
        maxlength: [200, 'Product name cannot exceed 200 characters'],
    },
    description: {
        type: String,
        trim: true,
        maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    sku: {
        type: String,
        required: [true, 'SKU is required'],
        trim: true,
        uppercase: true,
        maxlength: [100, 'SKU cannot exceed 100 characters'],
    },
    barcode: {
        type: String,
        trim: true,
        maxlength: [100, 'Barcode cannot exceed 100 characters'],
    },
    unit: {
        type: String,
        enum: {
            values: ['pcs', 'kg', 'meter', 'liter', 'box', 'pack'],
            message: 'Unit must be one of: pcs, kg, meter, liter, box, pack',
        },
        required: [true, 'Unit is required'],
    },
    type: {
        type: String,
        enum: {
            values: ['PHYSICAL', 'DIGITAL', 'SERVICE'],
            message: 'Type must be one of: PHYSICAL, DIGITAL, SERVICE',
        },
        required: [true, 'Product type is required'],
    },
    costPrice: {
        type: Number,
        min: [0, 'Cost price cannot be negative'],
    },
    sellingPrice: {
        type: Number,
        min: [0, 'Selling price cannot be negative'],
    },
    taxRate: {
        type: Number,
        default: 0,
        min: [0, 'Tax rate cannot be negative'],
        max: [100, 'Tax rate cannot exceed 100'],
    },
    minStockLevel: {
        type: Number,
        default: 0,
        min: [0, 'Min stock level cannot be negative'],
    },
    maxStockLevel: {
        type: Number,
        min: [0, 'Max stock level cannot be negative'],
    },
    reorderPoint: {
        type: Number,
        min: [0, 'Reorder point cannot be negative'],
    },
    reorderQty: {
        type: Number,
        min: [0, 'Reorder quantity cannot be negative'],
    },
    tags: {
        type: [String],
        default: [],
    },
    images: {
        type: [String],
        default: [],
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    companyId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Company',
        required: [true, 'Company ID is required'],
        index: true,
    },
    categoryId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'ProductCategory',
        default: null,
    },
}, {
    timestamps: true,
    toJSON: {
        transform(_doc, ret) {
            ret.id = ret._id;
            delete ret.__v;
            return ret;
        },
    },
});
productSchema.index({ companyId: 1, sku: 1 }, { unique: true });
productSchema.index({ companyId: 1, isActive: 1 });
const Product = mongoose_1.default.model('Product', productSchema);
exports.default = Product;
//# sourceMappingURL=Product.js.map