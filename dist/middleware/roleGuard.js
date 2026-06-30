"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleGuard = void 0;
const apiResponse_1 = __importDefault(require("../utils/apiResponse"));
/**
 * Middleware to guard routes based on user role names.
 * Allowed roles: 'admin', 'hr_manager', 'super admin', etc.
 */
const roleGuard = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            apiResponse_1.default.error(res, 401, 'UNAUTHORIZED', 'Authentication required');
            return;
        }
        const role = req.user.roleId;
        const userRoleName = role?.name?.toLowerCase() || '';
        // Super Admin bypass
        if (userRoleName === 'super admin') {
            next();
            return;
        }
        const normalizedAllowed = allowedRoles.map(r => r.toLowerCase());
        if (!normalizedAllowed.includes(userRoleName)) {
            apiResponse_1.default.error(res, 403, 'FORBIDDEN', 'Insufficient permissions to perform this action');
            return;
        }
        next();
    };
};
exports.roleGuard = roleGuard;
//# sourceMappingURL=roleGuard.js.map