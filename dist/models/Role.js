"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const permissionSchema = new mongoose_1.default.Schema({
    module: {
        type: String,
        required: true,
        trim: true,
    },
    action: {
        type: String,
        required: true,
        trim: true,
    },
    scope: {
        type: String,
        enum: ['ALL', 'DEPARTMENT', 'OWN'],
        default: 'OWN',
    },
}, { _id: false });
const roleSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, 'Role name is required'],
        trim: true,
        maxlength: [50, 'Role name cannot exceed 50 characters'],
    },
    description: {
        type: String,
        trim: true,
        maxlength: [200, 'Description cannot exceed 200 characters'],
    },
    isSystem: {
        type: Boolean,
        default: false,
    },
    companyId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Company',
        required: [true, 'Company is required'],
    },
    permissions: {
        type: [permissionSchema],
        default: [],
    },
}, {
    timestamps: true,
    toJSON: {
        transform(_doc, ret) {
            delete ret.__v;
            return ret;
        },
    },
});
roleSchema.index({ companyId: 1, name: 1 }, { unique: true });
const Role = mongoose_1.default.model('Role', roleSchema);
exports.default = Role;
//# sourceMappingURL=Role.js.map