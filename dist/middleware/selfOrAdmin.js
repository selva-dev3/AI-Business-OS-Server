"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.selfOrAdmin = void 0;
const apiResponse_1 = __importDefault(require("../utils/apiResponse"));
/**
 * Middleware that allows access if the requesting user is the employee themselves,
 * or if they have admin/hr_manager roles.
 */
const selfOrAdmin = (req, res, next) => {
    if (!req.user) {
        apiResponse_1.default.error(res, 401, 'UNAUTHORIZED', 'Authentication required');
        return;
    }
    const role = req.user.roleId;
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
        apiResponse_1.default.error(res, 400, 'BAD_REQUEST', 'Employee ID is required');
        return;
    }
    // Allow if req.user._id matches the employee's userId —
    // this check is deferred to the controller where we can query Employee
    // Here we just attach a flag and pass through
    req.isSelfCheck = true;
    next();
};
exports.selfOrAdmin = selfOrAdmin;
//# sourceMappingURL=selfOrAdmin.js.map