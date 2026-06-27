"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const documentFolderSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, 'Folder name is required'],
        trim: true,
        maxlength: [200, 'Folder name cannot exceed 200 characters'],
    },
    description: {
        type: String,
        trim: true,
        maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    parentId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'DocumentFolder',
        default: null,
    },
    companyId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Company',
        required: [true, 'Company ID is required'],
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
documentFolderSchema.index({ companyId: 1, parentId: 1 });
const DocumentFolder = mongoose_1.default.model('DocumentFolder', documentFolderSchema);
exports.default = DocumentFolder;
//# sourceMappingURL=DocumentFolder.js.map