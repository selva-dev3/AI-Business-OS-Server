"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const integrationSchema = new mongoose_1.default.Schema({
    companyId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Company',
        required: [true, 'Company is required'],
    },
    type: {
        type: String,
        required: [true, 'Integration type is required'],
        enum: {
            values: ['slack', 'google', 'zapier'],
            message: '{VALUE} is not a valid integration type',
        },
        lowercase: true,
    },
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    description: {
        type: String,
        trim: true,
        maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    isConnected: {
        type: Boolean,
        default: false,
    },
    connectedAt: {
        type: Date,
    },
    config: {
        type: mongoose_1.default.Schema.Types.Mixed,
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
integrationSchema.index({ companyId: 1, type: 1 }, { unique: true });
const Integration = mongoose_1.default.model('Integration', integrationSchema);
exports.default = Integration;
//# sourceMappingURL=Integration.js.map