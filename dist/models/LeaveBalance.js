"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const leaveBalanceSchema = new mongoose_1.default.Schema({
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
    leaveTypeId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'LeaveType',
        required: [true, 'Leave type ID is required'],
    },
    year: {
        type: Number,
        required: [true, 'Year is required'],
        min: [1900, 'Year must be at least 1900'],
        max: [2100, 'Year cannot exceed 2100'],
    },
    allocated: {
        type: Number,
        required: [true, 'Allocated days is required'],
        min: [0, 'Allocated days cannot be negative'],
    },
    taken: {
        type: Number,
        default: 0,
        min: [0, 'Taken days cannot be negative'],
    },
    pending: {
        type: Number,
        default: 0,
        min: [0, 'Pending days cannot be negative'],
    },
    balance: {
        type: Number,
        required: [true, 'Balance is required'],
        min: [0, 'Balance cannot be negative'],
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
leaveBalanceSchema.index({ employeeId: 1, leaveTypeId: 1, year: 1 }, { unique: true });
const LeaveBalance = mongoose_1.default.model('LeaveBalance', leaveBalanceSchema);
exports.default = LeaveBalance;
//# sourceMappingURL=LeaveBalance.js.map