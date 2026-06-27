"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const milestoneSchema = new mongoose_1.default.Schema({
    projectId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Project',
        required: [true, 'Project ID is required'],
    },
    name: {
        type: String,
        required: [true, 'Milestone name is required'],
        trim: true,
        maxlength: [200, 'Milestone name cannot exceed 200 characters'],
    },
    description: {
        type: String,
        trim: true,
        maxlength: [5000, 'Description cannot exceed 5000 characters'],
    },
    dueDate: {
        type: Date,
    },
    status: {
        type: String,
        enum: {
            values: ['PENDING', 'IN_PROGRESS', 'COMPLETED'],
            message: '{VALUE} is not a valid milestone status',
        },
        default: 'PENDING',
    },
    completedAt: {
        type: Date,
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
milestoneSchema.index({ projectId: 1 });
const Milestone = mongoose_1.default.model('Milestone', milestoneSchema);
exports.default = Milestone;
//# sourceMappingURL=Milestone.js.map