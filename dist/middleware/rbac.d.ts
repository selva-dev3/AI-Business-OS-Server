import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
declare const checkPermission: (module: string, action: string) => (req: AuthRequest, res: Response, next: NextFunction) => void;
declare const checkScope: (module: string, action: string) => (req: AuthRequest, res: Response, next: NextFunction) => void;
export { checkPermission, checkScope };
//# sourceMappingURL=rbac.d.ts.map