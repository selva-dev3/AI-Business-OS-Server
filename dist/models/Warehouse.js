"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const addressSchema = new mongoose_1.default.Schema({
    street: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    country: { type: String, trim: true },
    zip: { type: String, trim: true },
}, { _id: false });
const warehouseSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, 'Warehouse name is required'],
        trim: true,
        maxlength: [200, 'Warehouse name cannot exceed 200 characters'],
    },
    code: {
        type: String,
        required: [true, 'Warehouse code is required'],
        trim: true,
        uppercase: true,
        maxlength: [50, 'Warehouse code cannot exceed 50 characters'],
    },
    address: {
        type: addressSchema,
        default: {},
    },
    companyId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Company',
        required: [true, 'Company ID is required'],
        index: true,
    },
    branchId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Branch',
        default: null,
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
            delete ret.__v;
            return ret;
        },
    },
});
warehouseSchema.index({ companyId: 1, code: 1 }, { unique: true });
const Warehouse = mongoose_1.default.model('Warehouse', warehouseSchema);
exports.default = Warehouse;
//# sourceMappingURL=Warehouse.js.map