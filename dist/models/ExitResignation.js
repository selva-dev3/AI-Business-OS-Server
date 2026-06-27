"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const exitResignationSchema = new mongoose_1.default.Schema({
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
    resignationDate: {
        type: Date,
        required: [true, 'Resignation date is required'],
    },
    lastWorkingDay: {
        type: Date,
        required: [true, 'Last working day is required'],
    },
    reason: {
        type: String,
        trim: true,
        required: [true, 'Reason is required'],
        maxlength: [2000, 'Reason cannot exceed 2000 characters'],
    },
    remarks: {
        type: String,
        trim: true,
        maxlength: [2000, 'Remarks cannot exceed 2000 characters'],
    },
    status: {
        type: String,
        enum: {
            values: ['PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'],
            message: '{VALUE} is not a valid resignation status',
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
    rejectionReason: {
        type: String,
        trim: true,
        maxlength: [2000, 'Rejection reason cannot exceed 2000 characters'],
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
exitResignationSchema.index({ employeeId: 1, companyId: 1 });
exitResignationSchema.index({ companyId: 1, status: 1 });
const ExitResignation = mongoose_1.default.model('ExitResignation', exitResignationSchema);
exports.default = ExitResignation;
//# sourceMappingURL=ExitResignation.js.map