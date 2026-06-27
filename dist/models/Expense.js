"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const expenseSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        maxlength: [500, 'Title cannot exceed 500 characters'],
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: {
            values: ['Travel', 'Accommodation', 'Food', 'Transport', 'Office', 'Software', 'Hardware', 'Other'],
            message: 'Invalid expense category: {VALUE}',
        },
    },
    amount: {
        type: Number,
        required: [true, 'Amount is required'],
        min: [0, 'Amount cannot be negative'],
    },
    currency: {
        type: String,
        default: 'INR',
        trim: true,
    },
    date: {
        type: Date,
        required: [true, 'Expense date is required'],
    },
    receipt: {
        type: String,
        trim: true,
    },
    notes: {
        type: String,
        trim: true,
        maxlength: [2000, 'Notes cannot exceed 2000 characters'],
    },
    status: {
        type: String,
        required: [true, 'Status is required'],
        enum: {
            values: ['PENDING', 'APPROVED', 'REJECTED', 'REIMBURSED'],
            message: 'Invalid expense status: {VALUE}',
        },
        default: 'PENDING',
    },
    companyId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Company',
        required: [true, 'Company ID is required'],
    },
    employeeId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Employee',
        required: [true, 'Employee ID is required'],
    },
    approvedBy: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
    },
    approvedAt: {
        type: Date,
    },
    rejectedAt: {
        type: Date,
    },
    rejectedBy: {
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
expenseSchema.index({ companyId: 1, status: 1 });
expenseSchema.index({ employeeId: 1 });
const Expense = mongoose_1.default.model('Expense', expenseSchema);
exports.default = Expense;
//# sourceMappingURL=Expense.js.map