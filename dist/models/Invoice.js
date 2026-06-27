"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const invoiceSchema = new mongoose_1.default.Schema({
    invoiceNumber: {
        type: String,
        required: [true, 'Invoice number is required'],
        unique: true,
        trim: true,
    },
    type: {
        type: String,
        required: [true, 'Invoice type is required'],
        enum: {
            values: ['SALES', 'PURCHASE', 'EXPENSE'],
            message: 'Invalid invoice type: {VALUE}',
        },
    },
    status: {
        type: String,
        required: [true, 'Invoice status is required'],
        enum: {
            values: ['DRAFT', 'SENT', 'PARTIALLY_PAID', 'PAID', 'OVERDUE', 'CANCELLED', 'REFUNDED'],
            message: 'Invalid invoice status: {VALUE}',
        },
        default: 'DRAFT',
    },
    issueDate: {
        type: Date,
        required: [true, 'Issue date is required'],
    },
    dueDate: {
        type: Date,
        required: [true, 'Due date is required'],
    },
    currency: {
        type: String,
        default: 'INR',
        trim: true,
    },
    subtotal: {
        type: Number,
        required: [true, 'Subtotal is required'],
        min: [0, 'Subtotal cannot be negative'],
    },
    taxAmount: {
        type: Number,
        default: 0,
        min: [0, 'Tax amount cannot be negative'],
    },
    discount: {
        type: Number,
        default: 0,
        min: [0, 'Discount cannot be negative'],
    },
    totalAmount: {
        type: Number,
        required: [true, 'Total amount is required'],
        min: [0, 'Total amount cannot be negative'],
    },
    paidAmount: {
        type: Number,
        default: 0,
        min: [0, 'Paid amount cannot be negative'],
    },
    balanceDue: {
        type: Number,
        default: function () {
            return this.totalAmount - this.paidAmount;
        },
        min: [0, 'Balance due cannot be negative'],
    },
    notes: {
        type: String,
        trim: true,
        maxlength: [2000, 'Notes cannot exceed 2000 characters'],
    },
    termsAndConditions: {
        type: String,
        trim: true,
        maxlength: [5000, 'Terms and conditions cannot exceed 5000 characters'],
    },
    companyId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Company',
        required: [true, 'Company ID is required'],
    },
    accountId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Account',
        required: [true, 'Account ID is required'],
    },
    sentAt: {
        type: Date,
    },
    cancelledAt: {
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
invoiceSchema.index({ companyId: 1, status: 1, type: 1 });
invoiceSchema.pre('save', function (next) {
    this.balanceDue = this.totalAmount - this.paidAmount;
    next();
});
const Invoice = mongoose_1.default.model('Invoice', invoiceSchema);
exports.default = Invoice;
//# sourceMappingURL=Invoice.js.map