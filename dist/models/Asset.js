"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const assetSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, 'Asset name is required'],
        trim: true,
        maxlength: [200, 'Name cannot exceed 200 characters'],
    },
    code: {
        type: String,
        required: [true, 'Asset code is required'],
        trim: true,
        maxlength: [50, 'Code cannot exceed 50 characters'],
    },
    category: {
        type: String,
        trim: true,
        maxlength: [100, 'Category cannot exceed 100 characters'],
    },
    brand: {
        type: String,
        trim: true,
        maxlength: [100, 'Brand cannot exceed 100 characters'],
    },
    model: {
        type: String,
        trim: true,
        maxlength: [100, 'Model cannot exceed 100 characters'],
    },
    serialNumber: {
        type: String,
        trim: true,
        maxlength: [100, 'Serial number cannot exceed 100 characters'],
    },
    purchaseDate: {
        type: Date,
    },
    purchaseValue: {
        type: Number,
        min: [0, 'Purchase value cannot be negative'],
    },
    status: {
        type: String,
        enum: {
            values: ['AVAILABLE', 'ASSIGNED', 'MAINTENANCE', 'RETIRED'],
            message: '{VALUE} is not a valid asset status',
        },
        default: 'AVAILABLE',
    },
    location: {
        type: String,
        trim: true,
        maxlength: [200, 'Location cannot exceed 200 characters'],
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
    currentAssigneeId: {
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
assetSchema.index({ companyId: 1, code: 1 }, { unique: true });
assetSchema.index({ companyId: 1, status: 1 });
const Asset = mongoose_1.default.model('Asset', assetSchema);
exports.default = Asset;
//# sourceMappingURL=Asset.js.map