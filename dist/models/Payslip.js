"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const payslipSchema = new mongoose_1.default.Schema({
    payrollId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Payroll',
        required: [true, 'Payroll ID is required'],
    },
    employeeId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Employee',
        required: [true, 'Employee ID is required'],
    },
    companyId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Company',
        required: [true, 'Company ID is required'],
    },
    basicSalary: {
        type: Number,
        min: [0, 'Basic salary cannot be negative'],
    },
    hra: {
        type: Number,
        min: [0, 'HRA cannot be negative'],
    },
    ta: {
        type: Number,
        min: [0, 'TA cannot be negative'],
    },
    da: {
        type: Number,
        min: [0, 'DA cannot be negative'],
    },
    otherAllowances: {
        type: [
            {
                name: { type: String, trim: true },
                amount: { type: Number, min: 0 },
            },
        ],
        default: [],
    },
    deductions: {
        type: [
            {
                name: { type: String, trim: true },
                amount: { type: Number, min: 0 },
            },
        ],
        default: [],
    },
    pf: {
        type: Number,
        min: [0, 'PF cannot be negative'],
    },
    esi: {
        type: Number,
        min: [0, 'ESI cannot be negative'],
    },
    tds: {
        type: Number,
        min: [0, 'TDS cannot be negative'],
    },
    grossSalary: {
        type: Number,
        min: [0, 'Gross salary cannot be negative'],
    },
    netSalary: {
        type: Number,
        min: [0, 'Net salary cannot be negative'],
    },
    status: {
        type: String,
        enum: {
            values: ['DRAFT', 'GENERATED', 'PAID'],
            message: '{VALUE} is not a valid payslip status',
        },
        default: 'DRAFT',
    },
    pdfUrl: {
        type: String,
        trim: true,
    },
    paidAt: {
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
payslipSchema.index({ payrollId: 1, employeeId: 1 }, { unique: true });
const Payslip = mongoose_1.default.model('Payslip', payslipSchema);
exports.default = Payslip;
//# sourceMappingURL=Payslip.js.map