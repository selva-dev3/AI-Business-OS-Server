"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const employeeSchema = new mongoose_1.default.Schema({
    employeeCode: {
        type: String,
        required: [true, 'Employee code is required'],
        trim: true,
        maxlength: [50, 'Code cannot exceed 50 characters'],
    },
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        trim: true,
        maxlength: [100, 'First name cannot exceed 100 characters'],
    },
    lastName: {
        type: String,
        trim: true,
        maxlength: [100, 'Last name cannot exceed 100 characters'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        maxlength: [200, 'Email cannot exceed 200 characters'],
    },
    personalEmail: {
        type: String,
        trim: true,
        lowercase: true,
        maxlength: [200, 'Personal email cannot exceed 200 characters'],
    },
    phone: {
        type: String,
        trim: true,
        maxlength: [20, 'Phone cannot exceed 20 characters'],
    },
    alternatePhone: {
        type: String,
        trim: true,
        maxlength: [20, 'Alternate phone cannot exceed 20 characters'],
    },
    dob: {
        type: Date,
    },
    gender: {
        type: String,
        enum: {
            values: ['MALE', 'FEMALE', 'OTHER'],
            message: '{VALUE} is not a valid gender',
        },
    },
    bloodGroup: {
        type: String,
        trim: true,
        maxlength: [10, 'Blood group cannot exceed 10 characters'],
    },
    maritalStatus: {
        type: String,
        trim: true,
        maxlength: [20, 'Marital status cannot exceed 20 characters'],
    },
    avatar: {
        type: String,
        trim: true,
    },
    employmentType: {
        type: String,
        enum: {
            values: ['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERN'],
            message: '{VALUE} is not a valid employment type',
        },
        default: 'FULL_TIME',
    },
    status: {
        type: String,
        enum: {
            values: ['ACTIVE', 'INACTIVE', 'TERMINATED', 'SUSPENDED'],
            message: '{VALUE} is not a valid employee status',
        },
        default: 'ACTIVE',
    },
    suspensionDetails: {
        reason: { type: String, trim: true, maxlength: [2000, 'Reason cannot exceed 2000 characters'] },
        suspendedBy: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User' },
        suspendedAt: { type: Date },
        expectedReinstatement: { type: Date },
        notes: { type: String, trim: true, maxlength: [2000, 'Notes cannot exceed 2000 characters'] },
    },
    suspensionHistory: [
        {
            reason: { type: String, trim: true },
            suspendedBy: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User' },
            suspendedAt: { type: Date },
            reinstatedBy: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User' },
            reinstatedAt: { type: Date },
            expectedReinstatement: { type: Date },
            notes: { type: String, trim: true },
        },
    ],
    terminationDetails: {
        lastWorkingDate: { type: Date },
        reason: { type: String, trim: true, enum: { values: ['RESIGNATION', 'TERMINATION', 'RETIREMENT', 'CONTRACT_END', 'OTHER'], message: '{VALUE} is not a valid termination reason' } },
        reasonDetails: { type: String, trim: true, maxlength: [2000, 'Reason details cannot exceed 2000 characters'] },
        exitChecklist: {
            laptopReturned: { type: Boolean, default: false },
            accessRevoked: { type: Boolean, default: false },
            fnfSettled: { type: Boolean, default: false },
            relievingLetterIssued: { type: Boolean, default: false },
            exitInterviewDone: { type: Boolean, default: false },
        },
        noticePeriodServed: { type: Boolean, default: false },
        finalSalaryProcessed: { type: Boolean, default: false },
        terminatedBy: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User' },
        terminatedAt: { type: Date },
    },
    roleHistory: [
        {
            designation: { type: String, trim: true },
            departmentId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Department' },
            employmentType: { type: String, trim: true },
            reportingManagerId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Employee' },
            changedAt: { type: Date, default: Date.now },
            changedBy: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User' },
            reason: { type: String, trim: true, maxlength: [2000, 'Reason cannot exceed 2000 characters'] },
        },
    ],
    joiningDate: {
        type: Date,
    },
    confirmationDate: {
        type: Date,
    },
    exitDate: {
        type: Date,
    },
    exitReason: {
        type: String,
        trim: true,
        maxlength: [1000, 'Exit reason cannot exceed 1000 characters'],
    },
    address: {
        street: { type: String, trim: true, maxlength: 500 },
        city: { type: String, trim: true, maxlength: 100 },
        state: { type: String, trim: true, maxlength: 100 },
        country: { type: String, trim: true, maxlength: 100 },
        zip: { type: String, trim: true, maxlength: 20 },
    },
    emergencyContact: {
        name: { type: String, trim: true, maxlength: 200 },
        relation: { type: String, trim: true, maxlength: 100 },
        phone: { type: String, trim: true, maxlength: 20 },
    },
    bankDetails: {
        accountNumber: { type: String, trim: true, maxlength: 50 },
        ifscCode: { type: String, trim: true, maxlength: 20 },
        bankName: { type: String, trim: true, maxlength: 200 },
        accountType: { type: String, trim: true, maxlength: 50 },
    },
    panNumber: {
        type: String,
        trim: true,
        maxlength: 20,
    },
    aadharNumber: {
        type: String,
        trim: true,
        maxlength: 20,
    },
    companyId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Company',
        required: [true, 'Company ID is required'],
    },
    departmentId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Department',
        default: null,
    },
    designationId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Designation',
        default: null,
    },
    branchId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Branch',
    },
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
    },
    reportingManagerId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Employee',
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
employeeSchema.index({ employeeCode: 1, companyId: 1 }, { unique: true });
employeeSchema.index({ companyId: 1, status: 1 });
const Employee = mongoose_1.default.model('Employee', employeeSchema);
exports.default = Employee;
//# sourceMappingURL=Employee.js.map