"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const companySchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, 'Company name is required'],
        trim: true,
        maxlength: [100, 'Company name cannot exceed 100 characters'],
    },
    slug: {
        type: String,
        required: [true, 'Slug is required'],
        unique: true,
        lowercase: true,
        trim: true,
    },
    email: {
        type: String,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    phone: {
        type: String,
        trim: true,
    },
    logo: {
        type: String,
    },
    website: {
        type: String,
        trim: true,
    },
    address: {
        street: { type: String, trim: true },
        city: { type: String, trim: true },
        state: { type: String, trim: true },
        country: { type: String, trim: true },
        zip: { type: String, trim: true },
    },
    timezone: {
        type: String,
        default: 'UTC',
    },
    currency: {
        type: String,
        default: 'USD',
        uppercase: true,
    },
    language: {
        type: String,
        default: 'en',
        lowercase: true,
    },
    plan: {
        type: String,
        enum: {
            values: ['FREE', 'PROFESSIONAL', 'ENTERPRISE'],
            message: '{VALUE} is not a valid plan',
        },
        default: 'FREE',
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    trialEndsAt: {
        type: Date,
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
const Company = mongoose_1.default.model('Company', companySchema);
exports.default = Company;
//# sourceMappingURL=Company.js.map