import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
/**
 * Middleware that allows access if the requesting user is the employee themselves,
 * or if they have admin/hr_manager roles.
 */
declare const selfOrAdmin: (req: AuthRequest, res: Response, next: NextFunction) => void;
export { selfOrAdmin };
//# sourceMappingURL=selfOrAdmin.d.ts.map