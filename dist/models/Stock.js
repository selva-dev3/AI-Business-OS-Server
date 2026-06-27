"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const stockSchema = new mongoose_1.default.Schema({
    productId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Product',
        required: [true, 'Product ID is required'],
    },
    warehouseId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Warehouse',
        required: [true, 'Warehouse ID is required'],
    },
    companyId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Company',
        required: [true, 'Company ID is required'],
        index: true,
    },
    quantity: {
        type: Number,
        default: 0,
        min: [0, 'Quantity cannot be negative'],
        validate: {
            validator: Number.isInteger,
            message: 'Quantity must be an integer',
        },
    },
    reservedQty: {
        type: Number,
        default: 0,
        min: [0, 'Reserved quantity cannot be negative'],
        validate: {
            validator: Number.isInteger,
            message: 'Reserved quantity must be an integer',
        },
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
stockSchema.index({ productId: 1, warehouseId: 1 }, { unique: true });
stockSchema.index({ warehouseId: 1 });
const Stock = mongoose_1.default.model('Stock', stockSchema);
exports.default = Stock;
//# sourceMappingURL=Stock.js.map