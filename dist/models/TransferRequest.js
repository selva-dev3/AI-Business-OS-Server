"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const transferRequestSchema = new mongoose_1.default.Schema({
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
    fromDepartmentId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Department',
    },
    toDepartmentId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Department',
    },
    fromDesignationId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Designation',
    },
    toDesignationId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Designation',
    },
    fromBranchId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Branch',
    },
    toBranchId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Branch',
    },
    reason: {
        type: String,
        trim: true,
        required: [true, 'Reason is required'],
        maxlength: [2000, 'Reason cannot exceed 2000 characters'],
    },
    effectiveDate: {
        type: Date,
    },
    status: {
        type: String,
        enum: {
            values: ['PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'],
            message: '{VALUE} is not a valid transfer status',
        },
        default: 'PENDING',
    },
    requestedBy: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
    },
    approvedBy: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
    },
    approvedAt: {
        type: Date,
    },
    comments: {
        type: String,
        trim: true,
        maxlength: [2000, 'Comments cannot exceed 2000 characters'],
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
transferRequestSchema.index({ employeeId: 1, companyId: 1 });
transferRequestSchema.index({ companyId: 1, status: 1 });
const TransferRequest = mongoose_1.default.model('TransferRequest', transferRequestSchema);
exports.default = TransferRequest;
//# sourceMappingURL=TransferRequest.js.map