const AuditLog = require('../models/AuditLog');
const { getIpAddress, getUserAgent } = require('../utils/helpers');

const auditLog = (module, action, entityType) => {
  return async (req, res, next) => {
    const originalJson = res.json.bind(res);
    res.json = async function (body) {
      try {
        if (res.statusCode >= 200 && res.statusCode < 300 && body?.success) {
          const oldValues = req.originalBody || {};
          const newValues = { ...req.body };
          const entityId = req.params.id || body?.data?.id || body?.data?._id || null;

          await AuditLog.create({
            companyId: req.companyId,
            userId: req.user?._id,
            action,
            module,
            entityType,
            entityId: entityId?.toString(),
            oldValues: Object.keys(oldValues).length ? oldValues : undefined,
            newValues: Object.keys(newValues).length ? newValues : undefined,
            ipAddress: getIpAddress(req),
            userAgent: getUserAgent(req),
          });
        }
      } catch (err) {
        // silently fail for audit logging
      }
      return originalJson(body);
    };
    next();
  };
};

module.exports = auditLog;
