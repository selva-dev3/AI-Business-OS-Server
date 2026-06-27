import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
declare const auditLog: (module: string, action: string, entityType: string) => (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export default auditLog;
//# sourceMappingURL=auditLogger.d.ts.map