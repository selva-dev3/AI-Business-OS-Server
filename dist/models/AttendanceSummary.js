"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const attendanceSummarySchema = new mongoose_1.default.Schema({
    companyId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Company',
        required: [true, 'Company ID is required'],
    },
    date: {
        type: Date,
        required: [true, 'Date is required'],
    },
    totalPresent: {
        type: Number,
        default: 0,
        min: [0, 'Total present cannot be negative'],
    },
    totalAbsent: {
        type: Number,
        default: 0,
        min: [0, 'Total absent cannot be negative'],
    },
    totalLate: {
        type: Number,
        default: 0,
        min: [0, 'Total late cannot be negative'],
    },
    totalHalfDay: {
        type: Number,
        default: 0,
        min: [0, 'Total half day cannot be negative'],
    },
    totalOnLeave: {
        type: Number,
        default: 0,
        min: [0, 'Total on leave cannot be negative'],
    },
    departmentWise: {
        type: [
            {
                department: { type: String, trim: true },
                present: { type: Number, min: 0 },
                absent: { type: Number, min: 0 },
                late: { type: Number, min: 0 },
            },
        ],
        default: [],
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
attendanceSummarySchema.index({ companyId: 1, date: 1 }, { unique: true });
const AttendanceSummary = mongoose_1.default.model('AttendanceSummary', attendanceSummarySchema);
exports.default = AttendanceSummary;
//# sourceMappingURL=AttendanceSummary.js.map