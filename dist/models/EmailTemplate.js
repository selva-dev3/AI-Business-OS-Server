"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const emailTemplateSchema = new mongoose_1.default.Schema({
    companyId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Company',
        required: [true, 'Company is required'],
    },
    type: {
        type: String,
        required: [true, 'Template type is required'],
        enum: {
            values: [
                'welcome',
                'leave_approved',
                'leave_rejected',
                'password_reset',
                'invitation',
                'invoice',
                'expense_approved',
                'expense_rejected',
            ],
            message: '{VALUE} is not a valid email template type',
        },
    },
    subject: {
        type: String,
        required: [true, 'Subject is required'],
        trim: true,
        maxlength: [200, 'Subject cannot exceed 200 characters'],
    },
    body: {
        type: String,
        required: [true, 'Body is required'],
    },
    isCustomized: {
        type: Boolean,
        default: false,
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
emailTemplateSchema.index({ companyId: 1, type: 1 }, { unique: true });
const EmailTemplate = mongoose_1.default.model('EmailTemplate', emailTemplateSchema);
exports.default = EmailTemplate;
//# sourceMappingURL=EmailTemplate.js.map