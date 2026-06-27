"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const leaveTypeSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, 'Leave type name is required'],
        trim: true,
        maxlength: [200, 'Name cannot exceed 200 characters'],
    },
    code: {
        type: String,
        required: [true, 'Leave type code is required'],
        trim: true,
        maxlength: [50, 'Code cannot exceed 50 characters'],
    },
    annualAllowance: {
        type: Number,
        min: [0, 'Annual allowance cannot be negative'],
        default: 0,
    },
    carryForward: {
        type: Boolean,
        default: false,
    },
    maxCarryForward: {
        type: Number,
        min: [0, 'Max carry forward cannot be negative'],
    },
    isPaid: {
        type: Boolean,
        default: true,
    },
    requiresApproval: {
        type: Boolean,
        default: true,
    },
    description: {
        type: String,
        trim: true,
        maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    companyId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Company',
        required: [true, 'Company ID is required'],
    },
    isActive: {
        type: Boolean,
        default: true,
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
leaveTypeSchema.index({ companyId: 1, code: 1 }, { unique: true });
const LeaveType = mongoose_1.default.model('LeaveType', leaveTypeSchema);
exports.default = LeaveType;
//# sourceMappingURL=LeaveType.js.map