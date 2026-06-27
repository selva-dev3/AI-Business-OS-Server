"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const rfqItemSchema = new mongoose_1.default.Schema({
    description: {
        type: String,
        required: [true, 'Item description is required'],
        trim: true,
    },
    productId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Product',
    },
    quantity: {
        type: Number,
        required: [true, 'Item quantity is required'],
        min: [1, 'Quantity must be at least 1'],
    },
    unit: {
        type: String,
        required: [true, 'Item unit is required'],
        trim: true,
    },
}, { _id: false });
const rfqSchema = new mongoose_1.default.Schema({
    rfqNumber: {
        type: String,
        required: [true, 'RFQ number is required'],
        unique: true,
        trim: true,
        maxlength: 50,
    },
    title: {
        type: String,
        required: [true, 'RFQ title is required'],
        trim: true,
        maxlength: 300,
    },
    description: {
        type: String,
        trim: true,
    },
    deadline: {
        type: Date,
        required: [true, 'Deadline is required'],
    },
    status: {
        type: String,
        enum: {
            values: ['DRAFT', 'SENT', 'QUOTES_RECEIVED', 'CLOSED', 'CANCELLED'],
            message: 'Invalid RFQ status: {VALUE}',
        },
        default: 'DRAFT',
    },
    companyId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Company',
        required: [true, 'Company is required'],
    },
    items: [rfqItemSchema],
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
rfqSchema.index({ companyId: 1, status: 1 });
const RFQ = mongoose_1.default.model('RFQ', rfqSchema);
exports.default = RFQ;
//# sourceMappingURL=RFQ.js.map