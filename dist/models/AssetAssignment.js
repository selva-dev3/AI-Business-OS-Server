"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const assetAssignmentSchema = new mongoose_1.default.Schema({
    assetId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Asset',
        required: [true, 'Asset ID is required'],
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
    assignedAt: {
        type: Date,
        required: [true, 'Assigned at date is required'],
    },
    returnedAt: {
        type: Date,
    },
    condition: {
        type: String,
        trim: true,
        maxlength: [500, 'Condition cannot exceed 500 characters'],
    },
    notes: {
        type: String,
        trim: true,
        maxlength: [1000, 'Notes cannot exceed 1000 characters'],
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
assetAssignmentSchema.index({ assetId: 1, returnedAt: 1 });
const AssetAssignment = mongoose_1.default.model('AssetAssignment', assetAssignmentSchema);
exports.default = AssetAssignment;
//# sourceMappingURL=AssetAssignment.js.map