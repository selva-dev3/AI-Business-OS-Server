"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const quoteItemSchema = new mongoose_1.default.Schema({
    rfqItemId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
    },
    unitPrice: {
        type: Number,
        required: [true, 'Unit price is required'],
        min: 0,
    },
    quantity: {
        type: Number,
        required: [true, 'Quantity is required'],
        min: 1,
    },
    totalAmount: {
        type: Number,
        required: [true, 'Item total amount is required'],
        min: 0,
    },
    leadTime: {
        type: Number,
        min: 0,
    },
}, { _id: false });
const quoteSchema = new mongoose_1.default.Schema({
    rfqId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'RFQ',
        required: [true, 'RFQ reference is required'],
    },
    vendorId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Vendor',
        required: [true, 'Vendor reference is required'],
    },
    companyId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Company',
        required: [true, 'Company is required'],
    },
    status: {
        type: String,
        enum: {
            values: ['DRAFT', 'SUBMITTED', 'ACCEPTED', 'REJECTED'],
            message: 'Invalid quote status: {VALUE}',
        },
        default: 'DRAFT',
    },
    totalAmount: {
        type: Number,
        required: [true, 'Total amount is required'],
        min: 0,
    },
    validUntil: {
        type: Date,
    },
    terms: {
        type: String,
        trim: true,
    },
    items: [quoteItemSchema],
    submittedAt: {
        type: Date,
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
quoteSchema.index({ rfqId: 1, vendorId: 1 }, { unique: true });
const Quote = mongoose_1.default.model('Quote', quoteSchema);
exports.default = Quote;
//# sourceMappingURL=Quote.js.map