import { Response, NextFunction } from 'express';
import ApiResponse from '../utils/apiResponse';
import { AuthRequest } from '../types';

/**
 * Middleware to guard routes based on user role names.
 * Allowed roles: 'admin', 'hr_manager', 'super admin', etc.
 */
const roleGuard = (allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      ApiResponse.error(res, 401, 'UNAUTHORIZED', 'Authentication required');
      return;
    }

    const role = req.user.roleId as { name?: string } | null;
    const userRoleName = role?.name?.toLowerCase() || '';

    // Super Admin bypass
    if (userRoleName === 'super admin') {
      next();
      return;
    }

    const normalizedAllowed = allowedRoles.map(r => r.toLowerCase());
    if (!normalizedAllowed.includes(userRoleName)) {
      ApiResponse.error(res, 403, 'FORBIDDEN', 'Insufficient permissions to perform this action');
      return;
    }

    next();
  };
};

export { roleGuard };
