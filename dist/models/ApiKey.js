"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const apiKeySchema = new mongoose_1.default.Schema({
    companyId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Company',
        required: [true, 'Company is required'],
    },
    name: {
        type: String,
        required: [true, 'Key name is required'],
        trim: true,
        maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    key: {
        type: String,
        required: [true, 'Key is required'],
        unique: true,
    },
    keyPreview: {
        type: String,
        required: [true, 'Key preview is required'],
    },
    lastUsedAt: {
        type: Date,
    },
    expiresAt: {
        type: Date,
    },
    permissions: {
        type: [String],
        default: [],
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
            delete ret.key;
            return ret;
        },
    },
});
const ApiKey = mongoose_1.default.model('ApiKey', apiKeySchema);
exports.default = ApiKey;
//# sourceMappingURL=ApiKey.js.map