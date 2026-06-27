"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dealContactSchema = new mongoose_1.default.Schema({
    dealId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Deal',
        required: true,
    },
    contactId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Contact',
        required: true,
    },
    role: { type: String, default: '' },
}, { timestamps: true });
dealContactSchema.index({ dealId: 1, contactId: 1 }, { unique: true });
dealContactSchema.set('toJSON', {
    transform(_doc, ret) {
        delete ret.__v;
        return ret;
    },
});
const DealContact = mongoose_1.default.model('DealContact', dealContactSchema);
exports.default = DealContact;
//# sourceMappingURL=DealContact.js.map