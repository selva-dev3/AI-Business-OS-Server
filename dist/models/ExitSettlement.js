"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const exitSettlementSchema = new mongoose_1.default.Schema({
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
    resignationId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'ExitResignation',
    },
    noticePeriodDays: {
        type: Number,
    },
    noticePeriodAmount: {
        type: Number,
    },
    unpaidLeaves: {
        type: Number,
    },
    unpaidLeaveDeduction: {
        type: Number,
    },
    pendingReimbursements: {
        type: Number,
    },
    bonusAmount: {
        type: Number,
    },
    otherEarnings: {
        type: Number,
        default: 0,
    },
    otherDeductions: {
        type: Number,
        default: 0,
    },
    totalAmount: {
        type: Number,
    },
    status: {
        type: String,
        enum: {
            values: ['PENDING', 'APPROVED', 'PAID'],
            message: '{VALUE} is not a valid settlement status',
        },
        default: 'PENDING',
    },
    approvedBy: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
    },
    approvedAt: {
        type: Date,
    },
    paidAt: {
        type: Date,
    },
    remarks: {
        type: String,
        trim: true,
        maxlength: [2000, 'Remarks cannot exceed 2000 characters'],
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
exitSettlementSchema.index({ employeeId: 1, companyId: 1 });
const ExitSettlement = mongoose_1.default.model('ExitSettlement', exitSettlementSchema);
exports.default = ExitSettlement;
//# sourceMappingURL=ExitSettlement.js.map