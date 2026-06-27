"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const reportScheduleSchema = new mongoose_1.default.Schema({
    companyId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Company',
        required: [true, 'Company is required'],
    },
    reportType: {
        type: String,
        required: [true, 'Report type is required'],
        trim: true,
    },
    frequency: {
        type: String,
        required: [true, 'Frequency is required'],
        enum: {
            values: ['ONCE', 'DAILY', 'WEEKLY', 'MONTHLY'],
            message: '{VALUE} is not a valid frequency',
        },
    },
    dayOfWeek: {
        type: Number,
        min: 0,
        max: 6,
        description: '0=Sunday, 6=Saturday',
    },
    dayOfMonth: {
        type: Number,
        min: 1,
        max: 31,
    },
    time: {
        type: String,
        required: [true, 'Time is required'],
        match: [/^\d{2}:\d{2}$/, 'Time must be in HH:mm format'],
    },
    recipients: {
        type: [String],
        default: [],
        validate: {
            validator(v) {
                return v.every((email) => /^\S+@\S+\.\S+$/.test(email));
            },
            message: 'All recipients must be valid email addresses',
        },
    },
    format: {
        type: String,
        required: [true, 'Format is required'],
        enum: {
            values: ['pdf', 'xlsx', 'csv'],
            message: '{VALUE} is not a valid format',
        },
    },
    modules: {
        type: [String],
        default: [],
    },
    nextRunAt: {
        type: Date,
    },
    lastRunAt: {
        type: Date,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
    toJSON: {
        transform(_doc, ret) {
            delete ret.__v;
            return ret;
        },
    },
});
const ReportSchedule = mongoose_1.default.model('ReportSchedule', reportScheduleSchema);
exports.default = ReportSchedule;
//# sourceMappingURL=ReportSchedule.js.map