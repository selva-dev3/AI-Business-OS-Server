"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const payrollSchema = new mongoose_1.default.Schema({
    companyId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Company',
        required: [true, 'Company ID is required'],
    },
    month: {
        type: Number,
        required: [true, 'Month is required'],
        min: [1, 'Month must be between 1 and 12'],
        max: [12, 'Month must be between 1 and 12'],
    },
    year: {
        type: Number,
        required: [true, 'Year is required'],
        min: [1900, 'Year must be at least 1900'],
        max: [2100, 'Year cannot exceed 2100'],
    },
    status: {
        type: String,
        enum: {
            values: ['DRAFT', 'PROCESSING', 'PROCESSED', 'FAILED'],
            message: '{VALUE} is not a valid payroll status',
        },
        default: 'DRAFT',
    },
    totalAmount: {
        type: Number,
        default: 0,
        min: [0, 'Total amount cannot be negative'],
    },
    totalEmployees: {
        type: Number,
        default: 0,
        min: [0, 'Total employees cannot be negative'],
    },
    processedBy: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
    },
    processedAt: {
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
payrollSchema.index({ companyId: 1, month: 1, year: 1 }, { unique: true });
const Payroll = mongoose_1.default.model('Payroll', payrollSchema);
exports.default = Payroll;
//# sourceMappingURL=Payroll.js.map