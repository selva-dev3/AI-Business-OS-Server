"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const holidaySchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, 'Holiday name is required'],
        trim: true,
        maxlength: [200, 'Name cannot exceed 200 characters'],
    },
    date: {
        type: Date,
        required: [true, 'Date is required'],
    },
    type: {
        type: String,
        enum: {
            values: ['PUBLIC', 'RESTRICTED', 'OPTIONAL'],
            message: '{VALUE} is not a valid holiday type',
        },
        default: 'PUBLIC',
    },
    isOptional: {
        type: Boolean,
        default: false,
    },
    companyId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Company',
        required: [true, 'Company ID is required'],
    },
    branchId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Branch',
        default: null,
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
holidaySchema.index({ companyId: 1, date: 1 }, { unique: true });
const Holiday = mongoose_1.default.model('Holiday', holidaySchema);
exports.default = Holiday;
//# sourceMappingURL=Holiday.js.map