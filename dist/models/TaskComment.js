"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const taskCommentSchema = new mongoose_1.default.Schema({
    taskId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Task',
        required: [true, 'Task ID is required'],
    },
    projectId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Project',
        required: [true, 'Project ID is required'],
    },
    content: {
        type: String,
        required: [true, 'Comment content is required'],
        trim: true,
        maxlength: [5000, 'Content cannot exceed 5000 characters'],
    },
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required'],
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
taskCommentSchema.index({ taskId: 1 });
const TaskComment = mongoose_1.default.model('TaskComment', taskCommentSchema);
exports.default = TaskComment;
//# sourceMappingURL=TaskComment.js.map