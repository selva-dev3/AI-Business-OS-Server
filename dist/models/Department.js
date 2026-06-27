"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const departmentSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, 'Department name is required'],
        trim: true,
        maxlength: [200, 'Name cannot exceed 200 characters'],
    },
    code: {
        type: String,
        required: [true, 'Department code is required'],
        trim: true,
        maxlength: [50, 'Code cannot exceed 50 characters'],
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
    parentId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Department',
        default: null,
    },
    headId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Employee',
    },
    branchId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Branch',
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
departmentSchema.index({ companyId: 1, code: 1 }, { unique: true });
const Department = mongoose_1.default.model('Department', departmentSchema);
exports.default = Department;
//# sourceMappingURL=Department.js.map