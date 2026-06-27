"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const contactSchema = new mongoose_1.default.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, default: '' },
    email: { type: String, default: '', lowercase: true, trim: true },
    phone: { type: String, default: '' },
    mobile: { type: String, default: '' },
    jobTitle: { type: String, default: '' },
    department: { type: String, default: '' },
    isPrimary: { type: Boolean, default: false },
    address: {
        street: { type: String, default: '' },
        city: { type: String, default: '' },
        state: { type: String, default: '' },
        country: { type: String, default: '' },
        zip: { type: String, default: '' },
    },
    socialLinks: {
        linkedin: { type: String, default: '' },
        twitter: { type: String, default: '' },
    },
    tags: [{ type: String, trim: true }],
    notes: { type: String, default: '' },
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
    ownerId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
    },
}, { timestamps: true });
contactSchema.index({ companyId: 1, email: 1 }, { unique: true, sparse: true });
contactSchema.index({ accountId: 1 });
contactSchema.set('toJSON', {
    transform(_doc, ret) {
        delete ret.__v;
        return ret;
    },
});
const Contact = mongoose_1.default.model('Contact', contactSchema);
exports.default = Contact;
//# sourceMappingURL=Contact.js.map