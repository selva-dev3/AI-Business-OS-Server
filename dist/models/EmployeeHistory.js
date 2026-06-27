"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const employeeHistorySchema = new mongoose_1.default.Schema({
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
    changeType: {
        type: String,
        required: [true, 'Change type is required'],
        enum: {
            values: [
                'DESIGNATION_CHANGE',
                'DEPARTMENT_CHANGE',
                'BRANCH_CHANGE',
                'PROMOTION',
                'TRANSFER',
                'STATUS_CHANGE',
                'SALARY_CHANGE',
                'OTHER',
            ],
            message: '{VALUE} is not a valid change type',
        },
    },
    oldValue: {
        type: String,
        trim: true,
    },
    newValue: {
        type: String,
        trim: true,
    },
    oldDepartmentId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Department',
    },
    newDepartmentId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Department',
    },
    oldDesignationId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Designation',
    },
    newDesignationId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Designation',
    },
    effectiveDate: {
        type: Date,
    },
    changedBy: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
    },
    reason: {
        type: String,
        trim: true,
        maxlength: [2000, 'Reason cannot exceed 2000 characters'],
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
employeeHistorySchema.index({ employeeId: 1, companyId: 1 });
const EmployeeHistory = mongoose_1.default.model('EmployeeHistory', employeeHistorySchema);
exports.default = EmployeeHistory;
//# sourceMappingURL=EmployeeHistory.js.map