"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const leaveRequestSchema = new mongoose_1.default.Schema({
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
    fromDate: {
        type: Date,
        required: [true, 'From date is required'],
    },
    toDate: {
        type: Date,
        required: [true, 'To date is required'],
    },
    days: {
        type: Number,
        required: [true, 'Number of days is required'],
        min: [0.5, 'Minimum leave is 0.5 days'],
    },
    reason: {
        type: String,
        trim: true,
        maxlength: [2000, 'Reason cannot exceed 2000 characters'],
    },
    status: {
        type: String,
        enum: {
            values: ['PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'],
            message: '{VALUE} is not a valid leave status',
        },
        default: 'PENDING',
    },
    comments: {
        type: String,
        trim: true,
        maxlength: [2000, 'Comments cannot exceed 2000 characters'],
    },
    attachments: {
        type: [String],
        default: [],
    },
    approvedBy: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
    },
    rejectedBy: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
    },
    approvedAt: {
        type: Date,
    },
    rejectedAt: {
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
leaveRequestSchema.index({ employeeId: 1, status: 1 });
leaveRequestSchema.index({ companyId: 1, status: 1, createdAt: 1 });
const LeaveRequest = mongoose_1.default.model('LeaveRequest', leaveRequestSchema);
exports.default = LeaveRequest;
//# sourceMappingURL=LeaveRequest.js.map