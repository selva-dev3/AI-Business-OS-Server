"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const trainingEnrollmentSchema = new mongoose_1.default.Schema({
    courseId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'TrainingCourse',
        required: [true, 'Course ID is required'],
    },
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
    enrolledAt: {
        type: Date,
        default: Date.now,
    },
    completionDate: {
        type: Date,
    },
    status: {
        type: String,
        enum: {
            values: ['ENROLLED', 'IN_PROGRESS', 'COMPLETED', 'DROPPED'],
            message: '{VALUE} is not a valid enrollment status',
        },
        default: 'ENROLLED',
    },
    score: {
        type: Number,
    },
    feedback: {
        type: String,
        trim: true,
        maxlength: [2000, 'Feedback cannot exceed 2000 characters'],
    },
    completedBy: {
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
trainingEnrollmentSchema.index({ courseId: 1, employeeId: 1 }, { unique: true });
trainingEnrollmentSchema.index({ employeeId: 1, companyId: 1 });
const TrainingEnrollment = mongoose_1.default.model('TrainingEnrollment', trainingEnrollmentSchema);
exports.default = TrainingEnrollment;
//# sourceMappingURL=TrainingEnrollment.js.map