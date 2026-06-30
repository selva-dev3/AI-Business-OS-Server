"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const auditLogSchema = new mongoose_1.default.Schema({
    companyId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Company',
        required: [true, 'Company is required'],
    },
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User is required'],
    },
    action: {
        type: String,
        required: [true, 'Action is required'],
        enum: {
            values: ['CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'SUSPEND', 'REINSTATE'],
            message: '{VALUE} is not a valid action',
        },
        uppercase: true,
    },
    module: {
        type: String,
        required: [true, 'Module is required'],
        trim: true,
    },
    entityType: {
        type: String,
        required: [true, 'Entity type is required'],
        trim: true,
    },
    entityId: {
        type: mongoose_1.default.Schema.Types.Mixed,
    },
    oldValues: {
        type: mongoose_1.default.Schema.Types.Mixed,
    },
    newValues: {
        type: mongoose_1.default.Schema.Types.Mixed,
    },
    ipAddress: {
        type: String,
        trim: true,
    },
    userAgent: {
        type: String,
        trim: true,
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
auditLogSchema.index({ companyId: 1, module: 1, action: 1, createdAt: -1 });
const AuditLog = mongoose_1.default.model('AuditLog', auditLogSchema);
exports.default = AuditLog;
//# sourceMappingURL=AuditLog.js.map