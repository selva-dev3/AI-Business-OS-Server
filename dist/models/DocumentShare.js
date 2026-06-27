"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const documentShareSchema = new mongoose_1.default.Schema({
    documentId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Document',
        required: [true, 'Document ID is required'],
    },
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required'],
    },
    access: {
        type: String,
        enum: {
            values: ['VIEW', 'EDIT'],
            message: '{VALUE} is not a valid access level',
        },
        default: 'VIEW',
    },
    sharedAt: {
        type: Date,
        default: Date.now,
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
documentShareSchema.index({ documentId: 1, userId: 1 }, { unique: true });
const DocumentShare = mongoose_1.default.model('DocumentShare', documentShareSchema);
exports.default = DocumentShare;
//# sourceMappingURL=DocumentShare.js.map