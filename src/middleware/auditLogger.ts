import { Response, NextFunction } from 'express';
import AuditLog from '../models/AuditLog';
import { getIpAddress, getUserAgent } from '../utils/helpers';
import { AuthRequest } from '../types';

const auditLog = (module: string, action: string, entityType: string) => {
  return async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    const originalJson = res.json.bind(res);
    const jsonOverride = async (body: Record<string, unknown>): Promise<Response> => {
      try {
        if (res.statusCode >= 200 && res.statusCode < 300 && body?.success) {
          const oldValues = (req as unknown as Record<string, unknown>).originalBody as Record<string, unknown> || {};
          const newValues = { ...req.body };
          const entityId = req.params['id'] || (body.data as Record<string, unknown>)?.['id'] || (body.data as Record<string, unknown>)?.['_id'] || null;

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
      } catch (_err) {
        // silently fail for audit logging
      }
      return originalJson(body) as unknown as Promise<Response>;
    };
    res.json = jsonOverride as unknown as typeof res.json;
    next();
  };
};

export default auditLog;
