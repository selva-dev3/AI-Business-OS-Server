"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const trainingCertificationSchema = new mongoose_1.default.Schema({
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
    courseId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'TrainingCourse',
    },
    name: {
        type: String,
        trim: true,
        required: [true, 'Name is required'],
        maxlength: [200, 'Name cannot exceed 200 characters'],
    },
    issuedBy: {
        type: String,
        trim: true,
        maxlength: [200, 'Issued by cannot exceed 200 characters'],
    },
    issueDate: {
        type: Date,
        required: [true, 'Issue date is required'],
    },
    expiryDate: {
        type: Date,
    },
    certificateUrl: {
        type: String,
        trim: true,
    },
    credentialId: {
        type: String,
        trim: true,
        maxlength: [100, 'Credential ID cannot exceed 100 characters'],
    },
    skills: {
        type: [String],
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
trainingCertificationSchema.index({ employeeId: 1, companyId: 1 });
const TrainingCertification = mongoose_1.default.model('TrainingCertification', trainingCertificationSchema);
exports.default = TrainingCertification;
//# sourceMappingURL=TrainingCertification.js.map