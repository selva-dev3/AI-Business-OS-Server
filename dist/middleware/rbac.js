"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkScope = exports.checkPermission = void 0;
const apiResponse_1 = __importDefault(require("../utils/apiResponse"));
const checkPermission = (module, action) => {
    return (req, res, next) => {
        if (!req.user) {
            apiResponse_1.default.error(res, 401, 'UNAUTHORIZED', 'Authentication required');
            return;
        }
        const role = req.user.roleId;
        if (!role) {
            apiResponse_1.default.error(res, 403, 'FORBIDDEN', 'No role assigned');
            return;
        }
        if (role.name === 'Super Admin') {
            next();
            return;
        }
        const permissions = role.permissions || [];
        const hasPermission = permissions.some(p => p.module.toUpperCase() === module.toUpperCase() && p.action.toUpperCase() === action.toUpperCase());
        if (!hasPermission) {
            apiResponse_1.default.error(res, 403, 'FORBIDDEN', `No permission to ${action} ${module}`);
            return;
        }
        next();
    };
};
exports.checkPermission = checkPermission;
const checkScope = (module, action) => {
    return (req, res, next) => {
        if (!req.user) {
            apiResponse_1.default.error(res, 401, 'UNAUTHORIZED', 'Authentication required');
            return;
        }
        const role = req.user.roleId;
        if (!role) {
            apiResponse_1.default.error(res, 403, 'FORBIDDEN', 'No role assigned');
            return;
        }
        if (role.name === 'Super Admin') {
            next();
            return;
        }
        const permissions = role.permissions || [];
        const permission = permissions.find(p => p.module.toUpperCase() === module.toUpperCase() && p.action.toUpperCase() === action.toUpperCase());
        if (!permission) {
            apiResponse_1.default.error(res, 403, 'FORBIDDEN', `No permission to ${action} ${module}`);
            return;
        }
        if (permission.scope === 'own' && req.params['id'] && req.user._id.toString() !== req.params['id']) {
            apiResponse_1.default.error(res, 403, 'FORBIDDEN', 'You can only access your own data');
            return;
        }
        next();
    };
};
exports.checkScope = checkScope;
//# sourceMappingURL=rbac.js.map