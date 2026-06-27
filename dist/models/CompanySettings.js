"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const companySettingsSchema = new mongoose_1.default.Schema({
    companyId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Company',
        required: [true, 'Company is required'],
        unique: true,
    },
    attendance: {
        workStartTime: {
            type: String,
            default: '09:00',
            match: [/^\d{2}:\d{2}$/, 'Time must be in HH:mm format'],
        },
        workEndTime: {
            type: String,
            default: '18:00',
            match: [/^\d{2}:\d{2}$/, 'Time must be in HH:mm format'],
        },
        workingDays: {
            type: [String],
            enum: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'],
            default: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'],
        },
        lateThresholdMinutes: {
            type: Number,
            default: 15,
            min: 0,
        },
    },
    leave: {
        autoApproveAfterDays: {
            type: Number,
            default: 0,
            min: 0,
        },
        maxConsecutiveDays: {
            type: Number,
            default: 30,
            min: 1,
        },
    },
    payroll: {
        payDay: {
            type: Number,
            default: 1,
            min: 1,
            max: 31,
        },
        pfPercentage: {
            type: Number,
            default: 12,
            min: 0,
            max: 100,
        },
        esiPercentage: {
            type: Number,
            default: 0.75,
            min: 0,
            max: 100,
        },
    },
    notifications: {
        emailEnabled: {
            type: Boolean,
            default: true,
        },
        inAppEnabled: {
            type: Boolean,
            default: true,
        },
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
const CompanySettings = mongoose_1.default.model('CompanySettings', companySettingsSchema);
exports.default = CompanySettings;
//# sourceMappingURL=CompanySettings.js.map