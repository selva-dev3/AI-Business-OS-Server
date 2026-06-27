"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const designationSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, 'Designation name is required'],
        trim: true,
        maxlength: [200, 'Name cannot exceed 200 characters'],
    },
    level: {
        type: Number,
        min: [0, 'Level must be at least 0'],
    },
    description: {
        type: String,
        trim: true,
        maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    companyId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Company',
        required: [true, 'Company ID is required'],
    },
    isActive: {
        type: Boolean,
        default: true,
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
designationSchema.index({ companyId: 1, name: 1 }, { unique: true });
const Designation = mongoose_1.default.model('Designation', designationSchema);
exports.default = Designation;
//# sourceMappingURL=Designation.js.map