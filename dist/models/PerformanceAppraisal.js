"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const performanceAppraisalSchema = new mongoose_1.default.Schema({
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
    reviewPeriod: {
        type: String,
        trim: true,
        required: [true, 'Review period is required'],
        maxlength: [100, 'Review period cannot exceed 100 characters'],
    },
    startDate: {
        type: Date,
    },
    endDate: {
        type: Date,
    },
    rating: {
        type: Number,
        min: [1, 'Rating cannot be less than 1'],
        max: [5, 'Rating cannot exceed 5'],
    },
    reviewerId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
    },
    reviewDate: {
        type: Date,
    },
    strengths: {
        type: String,
        trim: true,
        maxlength: [2000, 'Strengths cannot exceed 2000 characters'],
    },
    areasOfImprovement: {
        type: String,
        trim: true,
        maxlength: [2000, 'Areas of improvement cannot exceed 2000 characters'],
    },
    overallComments: {
        type: String,
        trim: true,
        maxlength: [3000, 'Overall comments cannot exceed 3000 characters'],
    },
    status: {
        type: String,
        enum: {
            values: ['DRAFT', 'SUBMITTED', 'ACKNOWLEDGED'],
            message: '{VALUE} is not a valid appraisal status',
        },
        default: 'DRAFT',
    },
    goals: {
        type: [
            {
                goalId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'PerformanceGoal' },
                rating: { type: Number },
                comments: { type: String, trim: true },
            },
        ],
        default: [],
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
performanceAppraisalSchema.index({ employeeId: 1, companyId: 1 });
performanceAppraisalSchema.index({ companyId: 1, reviewPeriod: 1 });
const PerformanceAppraisal = mongoose_1.default.model('PerformanceAppraisal', performanceAppraisalSchema);
exports.default = PerformanceAppraisal;
//# sourceMappingURL=PerformanceAppraisal.js.map