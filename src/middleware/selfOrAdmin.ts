import { Response, NextFunction } from 'express';
import ApiResponse from '../utils/apiResponse';
import { AuthRequest } from '../types';

/**
 * Middleware that allows access if the requesting user is the employee themselves,
 * or if they have admin/hr_manager roles.
 */
const selfOrAdmin = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (!req.user) {
    ApiResponse.error(res, 401, 'UNAUTHORIZED', 'Authentication required');
    return;
  }

  const role = req.user.roleId as { name?: string } | null;
  const roleName = role?.name?.toLowerCase() || '';

  // Admin/HR Manager bypass
  if (roleName === 'super admin' || roleName === 'admin' || roleName === 'hr_manager') {
    next();
    return;
  }

  // Check if the user is accessing their own employee record
  // This requires that the User model is linked to an Employee via userId
  const targetEmployeeId = req.params['id'] || req.params['employeeId'];
  if (!targetEmployeeId) {
    ApiResponse.error(res, 400, 'BAD_REQUEST', 'Employee ID is required');
    return;
  }

  // Allow if req.user._id matches the employee's userId —
  // this check is deferred to the controller where we can query Employee
  // Here we just attach a flag and pass through
  (req as any).isSelfCheck = true;
  next();
};

export { selfOrAdmin };
