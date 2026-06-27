"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const trainingCourseSchema = new mongoose_1.default.Schema({
    companyId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Company',
        required: [true, 'Company ID is required'],
    },
    title: {
        type: String,
        trim: true,
        required: [true, 'Title is required'],
        maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
        type: String,
        trim: true,
        maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    provider: {
        type: String,
        trim: true,
        maxlength: [200, 'Provider cannot exceed 200 characters'],
    },
    duration: {
        type: String,
        trim: true,
        maxlength: [100, 'Duration cannot exceed 100 characters'],
    },
    mode: {
        type: String,
        enum: {
            values: ['ONLINE', 'OFFLINE', 'HYBRID'],
            message: '{VALUE} is not a valid training mode',
        },
        default: 'ONLINE',
    },
    category: {
        type: String,
        trim: true,
        maxlength: [100, 'Category cannot exceed 100 characters'],
    },
    skills: {
        type: [String],
        default: [],
    },
    isMandatory: {
        type: Boolean,
        default: false,
    },
    maxParticipants: {
        type: Number,
    },
    startDate: {
        type: Date,
    },
    endDate: {
        type: Date,
    },
    status: {
        type: String,
        enum: {
            values: ['UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED'],
            message: '{VALUE} is not a valid course status',
        },
        default: 'UPCOMING',
    },
    createdBy: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
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
trainingCourseSchema.index({ companyId: 1, status: 1 });
const TrainingCourse = mongoose_1.default.model('TrainingCourse', trainingCourseSchema);
exports.default = TrainingCourse;
//# sourceMappingURL=TrainingCourse.js.map