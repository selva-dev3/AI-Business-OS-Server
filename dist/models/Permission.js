"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const permissionSchema = new mongoose_1.default.Schema({
    module: {
        type: String,
        required: [true, 'Module name is required'],
        trim: true,
        maxlength: [100, 'Module name cannot exceed 100 characters'],
    },
    action: {
        type: String,
        required: [true, 'Action is required'],
        trim: true,
        maxlength: [100, 'Action cannot exceed 100 characters'],
    },
    scope: {
        type: String,
        enum: {
            values: ['company', 'own'],
            message: '{VALUE} is not a valid scope',
        },
        required: [true, 'Scope is required'],
    },
    description: {
        type: String,
        trim: true,
        maxlength: [500, 'Description cannot exceed 500 characters'],
    },
}, {
    timestamps: true,
    toJSON: {
        transform(_doc, ret) {
            ret.id = ret._id;
            delete ret.__v;
            return ret;
        },
    },
});
permissionSchema.index({ module: 1, action: 1 }, { unique: true });
const Permission = mongoose_1.default.model('Permission', permissionSchema);
exports.default = Permission;
//# sourceMappingURL=Permission.js.map