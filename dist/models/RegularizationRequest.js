"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const regularizationRequestSchema = new mongoose_1.default.Schema({
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
    date: {
        type: Date,
        required: [true, 'Date is required'],
    },
    checkIn: {
        type: Date,
    },
    checkOut: {
        type: Date,
    },
    reason: {
        type: String,
        trim: true,
        required: [true, 'Reason is required'],
        maxlength: [1000, 'Reason cannot exceed 1000 characters'],
    },
    status: {
        type: String,
        enum: {
            values: ['PENDING', 'APPROVED', 'REJECTED'],
            message: '{VALUE} is not a valid regularization status',
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
    comments: {
        type: String,
        trim: true,
        maxlength: [1000, 'Comments cannot exceed 1000 characters'],
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
regularizationRequestSchema.index({ employeeId: 1, date: 1 });
regularizationRequestSchema.index({ companyId: 1, status: 1 });
const RegularizationRequest = mongoose_1.default.model('RegularizationRequest', regularizationRequestSchema);
exports.default = RegularizationRequest;
//# sourceMappingURL=RegularizationRequest.js.map