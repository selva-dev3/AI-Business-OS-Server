import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
declare const authenticate: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
declare const optionalAuth: (req: AuthRequest, _res: Response, next: NextFunction) => Promise<void>;
export { authenticate, optionalAuth };
//# sourceMappingURL=auth.d.ts.map