"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const documentVersionSchema = new mongoose_1.default.Schema({
    documentId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Document',
        required: [true, 'Document ID is required'],
    },
    version: {
        type: Number,
        required: [true, 'Version number is required'],
        min: [1, 'Version must be at least 1'],
    },
    fileUrl: {
        type: String,
        required: [true, 'File URL is required'],
        trim: true,
    },
    fileSize: {
        type: Number,
        min: [0, 'File size cannot be negative'],
    },
    createdBy: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Created by user ID is required'],
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
documentVersionSchema.index({ documentId: 1, version: 1 }, { unique: true });
const DocumentVersion = mongoose_1.default.model('DocumentVersion', documentVersionSchema);
exports.default = DocumentVersion;
//# sourceMappingURL=DocumentVersion.js.map