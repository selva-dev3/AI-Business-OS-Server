"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const employeeDocumentSchema = new mongoose_1.default.Schema({
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
    documentType: {
        type: String,
        required: [true, 'Document type is required'],
        enum: {
            values: ['OFFER_LETTER', 'ID_PROOF', 'CERTIFICATE', 'CONTRACT', 'NDA', 'PAYSLIP', 'OTHER'],
            message: '{VALUE} is not a valid document type',
        },
    },
    documentName: {
        type: String,
        required: [true, 'Document name is required'],
        trim: true,
        maxlength: [255, 'Document name cannot exceed 255 characters'],
    },
    fileUrl: {
        type: String,
        required: [true, 'File URL is required'],
        trim: true,
    },
    fileSize: {
        type: Number,
        min: [0, 'File size cannot be negative'],
    },
    mimeType: {
        type: String,
        trim: true,
    },
    isConfidential: {
        type: Boolean,
        default: false,
    },
    expiryDate: {
        type: Date,
    },
    uploadedBy: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Uploaded by user ID is required'],
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
employeeDocumentSchema.index({ employeeId: 1, companyId: 1 });
employeeDocumentSchema.index({ companyId: 1, documentType: 1 });
const EmployeeDocument = mongoose_1.default.model('EmployeeDocument', employeeDocumentSchema);
exports.default = EmployeeDocument;
//# sourceMappingURL=EmployeeDocument.js.map