import { Response, NextFunction } from 'express';
import ApiResponse from '../utils/apiResponse';
import { AuthRequest } from '../types';

const checkPermission = (module: string, action: string) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      ApiResponse.error(res, 401, 'UNAUTHORIZED', 'Authentication required');
      return;
    }

    const role = req.user.roleId as { name?: string; permissions?: Array<{ module: string; action: string }> } | null;
    if (!role) {
      ApiResponse.error(res, 403, 'FORBIDDEN', 'No role assigned');
      return;
    }

    if (role.name === 'Super Admin') {
      next();
      return;
    }

    const permissions = role.permissions || [];
    const hasPermission = permissions.some(
      p => p.module.toUpperCase() === module.toUpperCase() && p.action.toUpperCase() === action.toUpperCase()
    );

    if (!hasPermission) {
      ApiResponse.error(res, 403, 'FORBIDDEN', `No permission to ${action} ${module}`);
      return;
    }

    next();
  };
};

const checkScope = (module: string, action: string) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      ApiResponse.error(res, 401, 'UNAUTHORIZED', 'Authentication required');
      return;
    }

    const role = req.user.roleId as { name?: string; permissions?: Array<{ module: string; action: string; scope?: string }> } | null;
    if (!role) {
      ApiResponse.error(res, 403, 'FORBIDDEN', 'No role assigned');
      return;
    }

    if (role.name === 'Super Admin') {
      next();
      return;
    }

    const permissions = role.permissions || [];
    const permission = permissions.find(
      p => p.module.toUpperCase() === module.toUpperCase() && p.action.toUpperCase() === action.toUpperCase()
    );

    if (!permission) {
      ApiResponse.error(res, 403, 'FORBIDDEN', `No permission to ${action} ${module}`);
      return;
    }

    if (permission.scope === 'own' && req.params['id'] && req.user._id.toString() !== req.params['id']) {
      ApiResponse.error(res, 403, 'FORBIDDEN', 'You can only access your own data');
      return;
    }

    next();
  };
};

export { checkPermission, checkScope };
