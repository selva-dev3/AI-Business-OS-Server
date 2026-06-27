"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const projectMemberSchema = new mongoose_1.default.Schema({
    projectId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Project',
        required: [true, 'Project ID is required'],
    },
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required'],
    },
    role: {
        type: String,
        enum: {
            values: ['PROJECT_MANAGER', 'DEVELOPER', 'DESIGNER', 'TESTER', 'STAKEHOLDER'],
            message: '{VALUE} is not a valid project member role',
        },
        required: [true, 'Role is required'],
    },
    joinedAt: {
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
projectMemberSchema.index({ projectId: 1, userId: 1 }, { unique: true });
const ProjectMember = mongoose_1.default.model('ProjectMember', projectMemberSchema);
exports.default = ProjectMember;
//# sourceMappingURL=ProjectMember.js.map