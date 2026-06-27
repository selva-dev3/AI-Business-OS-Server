"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AuditLog_1 = __importDefault(require("../models/AuditLog"));
const helpers_1 = require("../utils/helpers");
const auditLog = (module, action, entityType) => {
    return async (req, res, next) => {
        const originalJson = res.json.bind(res);
        const jsonOverride = async (body) => {
            try {
                if (res.statusCode >= 200 && res.statusCode < 300 && body?.success) {
                    const oldValues = req.originalBody || {};
                    const newValues = { ...req.body };
                    const entityId = req.params['id'] || body.data?.['id'] || body.data?.['_id'] || null;
                    await AuditLog_1.default.create({
                        companyId: req.companyId,
                        userId: req.user?._id,
                        action,
                        module,
                        entityType,
                        entityId: entityId?.toString(),
                        oldValues: Object.keys(oldValues).length ? oldValues : undefined,
                        newValues: Object.keys(newValues).length ? newValues : undefined,
                        ipAddress: (0, helpers_1.getIpAddress)(req),
                        userAgent: (0, helpers_1.getUserAgent)(req),
                    });
                }
            }
            catch (_err) {
                // silently fail for audit logging
            }
            return originalJson(body);
        };
        res.json = jsonOverride;
        next();
    };
};
exports.default = auditLog;
//# sourceMappingURL=auditLogger.js.map