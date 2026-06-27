"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const planSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, 'Plan name is required'],
        unique: true,
        trim: true,
        maxlength: [50, 'Plan name cannot exceed 50 characters'],
    },
    description: {
        type: String,
        trim: true,
        maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative'],
    },
    currency: {
        type: String,
        default: 'USD',
        uppercase: true,
    },
    billingCycle: {
        type: String,
        required: [true, 'Billing cycle is required'],
        enum: {
            values: ['monthly', 'annual'],
            message: '{VALUE} is not a valid billing cycle',
        },
    },
    features: {
        maxUsers: {
            type: Number,
            default: 5,
            min: 1,
        },
        modules: {
            type: [String],
            default: [],
        },
        storage: {
            type: Number,
            default: 1024,
            min: 0,
        },
        aiCredits: {
            type: Number,
            default: 0,
            min: 0,
        },
    },
    isActive: {
        type: Boolean,
        default: true,
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
const Plan = mongoose_1.default.model('Plan', planSchema);
exports.default = Plan;
//# sourceMappingURL=Plan.js.map