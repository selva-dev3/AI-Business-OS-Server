"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const exitClearanceSchema = new mongoose_1.default.Schema({
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
    departmentId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Department',
        required: [true, 'Department ID is required'],
    },
    clearanceBy: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
    },
    clearedAt: {
        type: Date,
    },
    status: {
        type: String,
        enum: {
            values: ['PENDING', 'CLEARED', 'NOT_CLEARED'],
            message: '{VALUE} is not a valid clearance status',
        },
        default: 'PENDING',
    },
    comments: {
        type: String,
        trim: true,
        maxlength: [1000, 'Comments cannot exceed 1000 characters'],
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
exitClearanceSchema.index({ employeeId: 1, departmentId: 1 }, { unique: true });
exitClearanceSchema.index({ companyId: 1 });
const ExitClearance = mongoose_1.default.model('ExitClearance', exitClearanceSchema);
exports.default = ExitClearance;
//# sourceMappingURL=ExitClearance.js.map