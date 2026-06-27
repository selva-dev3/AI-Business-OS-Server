"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const timesheetSchema = new mongoose_1.default.Schema({
    projectId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Project',
        required: [true, 'Project ID is required'],
    },
    taskId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Task',
    },
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required'],
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
    hours: {
        type: Number,
        required: [true, 'Hours is required'],
        min: [0.25, 'Minimum hours is 0.25'],
        max: [24, 'Maximum hours is 24'],
    },
    description: {
        type: String,
        trim: true,
        maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    isBillable: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
    toJSON: {
        transform(_doc, ret) {
            ret.id = ret._id;
            delete ret.__v;
            return ret;
        },
    },
});
timesheetSchema.index({ userId: 1, date: 1 });
timesheetSchema.index({ projectId: 1 });
const Timesheet = mongoose_1.default.model('Timesheet', timesheetSchema);
exports.default = Timesheet;
//# sourceMappingURL=Timesheet.js.map