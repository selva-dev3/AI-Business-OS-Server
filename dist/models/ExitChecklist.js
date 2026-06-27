"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const exitChecklistSchema = new mongoose_1.default.Schema({
    employeeId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Employee',
        required: [true, 'Employee ID is required'],
    },
    companyId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Company',
        required: [true, 'Company ID is required'],
    },
    resignationId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'ExitResignation',
    },
    tasks: {
        type: [
            {
                task: { type: String, trim: true },
                assignedTo: { type: mongoose_1.default.Schema.Types.ObjectId },
                isCompleted: { type: Boolean, default: false },
                completedAt: { type: Date },
                comments: { type: String, trim: true },
            },
        ],
        default: [],
    },
    status: {
        type: String,
        enum: {
            values: ['PENDING', 'IN_PROGRESS', 'COMPLETED'],
            message: '{VALUE} is not a valid checklist status',
        },
        default: 'PENDING',
    },
}, {
    timestamps: true,
    toJSON: {
        transform(_doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
            return ret;
        },
    },
});
exitChecklistSchema.index({ employeeId: 1, companyId: 1 });
const ExitChecklist = mongoose_1.default.model('ExitChecklist', exitChecklistSchema);
exports.default = ExitChecklist;
//# sourceMappingURL=ExitChecklist.js.map