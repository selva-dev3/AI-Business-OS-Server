"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const salaryStructureSchema = new mongoose_1.default.Schema({
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
    effectiveFrom: {
        type: Date,
        required: [true, 'Effective from date is required'],
    },
    basicSalary: {
        type: Number,
        required: [true, 'Basic salary is required'],
        min: [0, 'Basic salary cannot be negative'],
    },
    hra: {
        type: Number,
        default: 0,
        min: [0, 'HRA cannot be negative'],
    },
    ta: {
        type: Number,
        default: 0,
        min: [0, 'TA cannot be negative'],
    },
    da: {
        type: Number,
        default: 0,
        min: [0, 'DA cannot be negative'],
    },
    pf: {
        type: Number,
        default: 0,
        min: [0, 'PF cannot be negative'],
    },
    esi: {
        type: Number,
        default: 0,
        min: [0, 'ESI cannot be negative'],
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
    grossSalary: {
        type: Number,
        required: [true, 'Gross salary is required'],
        min: [0, 'Gross salary cannot be negative'],
    },
    netSalary: {
        type: Number,
        required: [true, 'Net salary is required'],
        min: [0, 'Net salary cannot be negative'],
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
salaryStructureSchema.index({ employeeId: 1 }, { unique: true });
const SalaryStructure = mongoose_1.default.model('SalaryStructure', salaryStructureSchema);
exports.default = SalaryStructure;
//# sourceMappingURL=SalaryStructure.js.map