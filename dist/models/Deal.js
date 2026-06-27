"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dealSchema = new mongoose_1.default.Schema({
    title: { type: String, required: true },
    value: { type: Number, default: 0, min: 0 },
    currency: { type: String, default: 'INR' },
    stage: {
        type: String,
        enum: ['QUALIFICATION', 'DEMO', 'PROPOSAL', 'NEGOTIATION', 'WON', 'LOST'],
        default: 'QUALIFICATION',
    },
    probability: { type: Number, default: 0, min: 0, max: 100 },
    expectedCloseDate: { type: Date },
    actualCloseDate: { type: Date },
    finalValue: { type: Number, default: 0, min: 0 },
    status: {
        type: String,
        enum: ['OPEN', 'WON', 'LOST'],
        default: 'OPEN',
    },
    notes: { type: String, default: '' },
    tags: [{ type: String, trim: true }],
    position: { type: Number, default: 0 },
    lostReason: { type: String, default: '' },
    companyId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Company',
        required: true,
    },
    accountId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Account',
        default: null,
    },
    leadId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Lead',
        default: null,
    },
    ownerId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
    },
}, { timestamps: true });
dealSchema.index({ companyId: 1, stage: 1, status: 1 });
dealSchema.index({ accountId: 1 });
dealSchema.index({ ownerId: 1 });
dealSchema.set('toJSON', {
    transform(_doc, ret) {
        delete ret.__v;
        return ret;
    },
});
const Deal = mongoose_1.default.model('Deal', dealSchema);
exports.default = Deal;
//# sourceMappingURL=Deal.js.map