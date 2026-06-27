"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const promotionSchema = new mongoose_1.default.Schema({
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
    fromDesignationId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Designation',
    },
    toDesignationId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Designation',
        required: [true, 'To designation ID is required'],
    },
    fromDepartmentId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Department',
    },
    toDepartmentId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Department',
    },
    fromSalary: {
        type: Number,
    },
    toSalary: {
        type: Number,
    },
    effectiveDate: {
        type: Date,
        required: [true, 'Effective date is required'],
    },
    reason: {
        type: String,
        trim: true,
        maxlength: [2000, 'Reason cannot exceed 2000 characters'],
    },
    approvedBy: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
    },
    approvedAt: {
        type: Date,
    },
    status: {
        type: String,
        enum: {
            values: ['PENDING', 'APPROVED', 'REJECTED'],
            message: '{VALUE} is not a valid promotion status',
        },
        default: 'PENDING',
    },
    createdBy: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
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
promotionSchema.index({ employeeId: 1, companyId: 1 });
const Promotion = mongoose_1.default.model('Promotion', promotionSchema);
exports.default = Promotion;
//# sourceMappingURL=Promotion.js.map