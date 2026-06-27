"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const activitySchema = new mongoose_1.default.Schema({
    type: {
        type: String,
        enum: ['CALL', 'MEETING', 'EMAIL', 'TASK', 'NOTE'],
        required: true,
    },
    subject: { type: String, default: '' },
    description: { type: String, default: '' },
    outcome: { type: String, default: '' },
    scheduledAt: { type: Date },
    completedAt: { type: Date },
    dueAt: { type: Date },
    isCompleted: { type: Boolean, default: false },
    companyId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Company',
        required: true,
    },
    leadId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Lead',
        default: null,
    },
    dealId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Deal',
        default: null,
    },
    contactId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Account',
        default: null,
    },
    createdBy: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
    },
    assignedToId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
    },
}, { timestamps: true });
activitySchema.index({ companyId: 1, type: 1 });
activitySchema.index({ leadId: 1 });
activitySchema.index({ dealId: 1 });
activitySchema.set('toJSON', {
    transform(_doc, ret) {
        delete ret.__v;
        return ret;
    },
});
const Activity = mongoose_1.default.model('Activity', activitySchema);
exports.default = Activity;
//# sourceMappingURL=Activity.js.map