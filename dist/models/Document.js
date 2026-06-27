"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const documentSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, 'Document name is required'],
        trim: true,
        maxlength: [255, 'Document name cannot exceed 255 characters'],
    },
    description: {
        type: String,
        trim: true,
        maxlength: [1000, 'Description cannot exceed 1000 characters'],
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
    mimeType: {
        type: String,
        trim: true,
    },
    extension: {
        type: String,
        trim: true,
    },
    tags: {
        type: [String],
        default: [],
    },
    isShared: {
        type: Boolean,
        default: false,
    },
    shareToken: {
        type: String,
        trim: true,
        sparse: true,
    },
    version: {
        type: Number,
        default: 1,
        min: [1, 'Version must be at least 1'],
    },
    companyId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Company',
        required: [true, 'Company ID is required'],
    },
    folderId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'DocumentFolder',
        default: null,
    },
    uploadedBy: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Uploaded by user ID is required'],
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
documentSchema.index({ companyId: 1, folderId: 1 });
const Document = mongoose_1.default.model('Document', documentSchema);
exports.default = Document;
//# sourceMappingURL=Document.js.map