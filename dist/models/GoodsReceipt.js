"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const grItemSchema = new mongoose_1.default.Schema({
    poItemId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: [true, 'PO item reference is required'],
    },
    productId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Product',
        required: [true, 'Product reference is required'],
    },
    quantity: {
        type: Number,
        required: [true, 'Received quantity is required'],
        min: 1,
    },
}, { _id: false });
const goodsReceiptSchema = new mongoose_1.default.Schema({
    poId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'PurchaseOrder',
        required: [true, 'Purchase order reference is required'],
    },
    purchaseOrderId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'PurchaseOrder',
        required: [true, 'Purchase order reference is required'],
    },
    grNumber: {
        type: String,
        required: [true, 'GR number is required'],
        unique: true,
        trim: true,
        maxlength: 50,
    },
    companyId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Company',
        required: [true, 'Company is required'],
    },
    warehouseId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Warehouse',
        required: [true, 'Warehouse is required'],
    },
    receivedAt: {
        type: Date,
        default: Date.now,
    },
    notes: { type: String, trim: true },
    items: [grItemSchema],
    createdBy: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
    },
}, {
    timestamps: true,
    toJSON: {
        transform(_doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
            return ret;
        },
    },
});
const GoodsReceipt = mongoose_1.default.model('GoodsReceipt', goodsReceiptSchema);
exports.default = GoodsReceipt;
//# sourceMappingURL=GoodsReceipt.js.map