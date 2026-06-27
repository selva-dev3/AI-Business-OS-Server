"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const performanceFeedbackSchema = new mongoose_1.default.Schema({
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
    fromEmployeeId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Employee',
        required: [true, 'From employee ID is required'],
    },
    category: {
        type: String,
        enum: {
            values: ['PEER', 'MANAGER', 'SUBORDINATE', 'SELF'],
            message: '{VALUE} is not a valid feedback category',
        },
        default: 'PEER',
    },
    rating: {
        type: Number,
        min: [1, 'Rating cannot be less than 1'],
        max: [5, 'Rating cannot exceed 5'],
    },
    comments: {
        type: String,
        trim: true,
        required: [true, 'Comments are required'],
        maxlength: [2000, 'Comments cannot exceed 2000 characters'],
    },
    submittedAt: {
        type: Date,
        default: Date.now,
    },
    isAnonymous: {
        type: Boolean,
        default: false,
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
performanceFeedbackSchema.index({ employeeId: 1, companyId: 1 });
performanceFeedbackSchema.index({ fromEmployeeId: 1 });
const PerformanceFeedback = mongoose_1.default.model('PerformanceFeedback', performanceFeedbackSchema);
exports.default = PerformanceFeedback;
//# sourceMappingURL=PerformanceFeedback.js.map