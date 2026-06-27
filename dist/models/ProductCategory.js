"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const productCategorySchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, 'Category name is required'],
        trim: true,
        maxlength: [100, 'Category name cannot exceed 100 characters'],
    },
    code: {
        type: String,
        required: [true, 'Category code is required'],
        trim: true,
        uppercase: true,
        maxlength: [50, 'Category code cannot exceed 50 characters'],
    },
    description: {
        type: String,
        trim: true,
        maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    image: {
        type: String,
        trim: true,
    },
    parentId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'ProductCategory',
        default: null,
    },
    companyId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Company',
        required: [true, 'Company ID is required'],
        index: true,
    },
    isActive: {
        type: Boolean,
        default: true,
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
productCategorySchema.index({ companyId: 1, code: 1 }, { unique: true });
const ProductCategory = mongoose_1.default.model('ProductCategory', productCategorySchema);
exports.default = ProductCategory;
//# sourceMappingURL=ProductCategory.js.map