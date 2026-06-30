import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
/**
 * Middleware to guard routes based on user role names.
 * Allowed roles: 'admin', 'hr_manager', 'super admin', etc.
 */
declare const roleGuard: (allowedRoles: string[]) => (req: AuthRequest, res: Response, next: NextFunction) => void;
export { roleGuard };
//# sourceMappingURL=roleGuard.d.ts.map