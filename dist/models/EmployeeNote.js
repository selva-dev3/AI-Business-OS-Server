"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const employeeNoteSchema = new mongoose_1.default.Schema({
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
    content: {
        type: String,
        required: [true, 'Note content is required'],
        trim: true,
        maxlength: [2000, 'Content cannot exceed 2000 characters'],
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: {
            values: ['PERFORMANCE', 'DISCIPLINARY', 'GENERAL', 'APPRECIATION', 'COMPLAINT', 'OTHER'],
            message: '{VALUE} is not a valid note category',
        },
    },
    isPinned: {
        type: Boolean,
        default: false,
    },
    visibility: {
        type: String,
        enum: {
            values: ['HR_ONLY', 'ADMIN_ONLY', 'HR_AND_ADMIN'],
            message: '{VALUE} is not a valid visibility level',
        },
        default: 'HR_AND_ADMIN',
    },
    createdBy: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Created by user ID is required'],
    },
    updatedBy: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
    },
    isDeleted: {
        type: Boolean,
        default: false,
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
employeeNoteSchema.index({ employeeId: 1, companyId: 1, isDeleted: 1 });
employeeNoteSchema.index({ companyId: 1, category: 1, createdAt: -1 });
const EmployeeNote = mongoose_1.default.model('EmployeeNote', employeeNoteSchema);
exports.default = EmployeeNote;
//# sourceMappingURL=EmployeeNote.js.map