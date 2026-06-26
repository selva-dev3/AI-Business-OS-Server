const ApiResponse = require('../utils/apiResponse');

const checkPermission = (module, action) => {
  return (req, res, next) => {
    if (!req.user) {
      return ApiResponse.error(res, 401, 'UNAUTHORIZED', 'Authentication required');
    }

    const role = req.user.roleId;
    if (!role) {
      return ApiResponse.error(res, 403, 'FORBIDDEN', 'No role assigned');
    }

    if (role.name === 'Super Admin') {
      return next();
    }

    const permissions = role.permissions || [];
    const hasPermission = permissions.some(
      p => p.module === module && p.action === action
    );

    if (!hasPermission) {
      return ApiResponse.error(res, 403, 'FORBIDDEN', `No permission to ${action} ${module}`);
    }

    next();
  };
};

const checkScope = (module, action) => {
  return (req, res, next) => {
    if (!req.user) {
      return ApiResponse.error(res, 401, 'UNAUTHORIZED', 'Authentication required');
    }

    const role = req.user.roleId;
    if (!role) {
      return ApiResponse.error(res, 403, 'FORBIDDEN', 'No role assigned');
    }

    if (role.name === 'Super Admin') {
      return next();
    }

    const permissions = role.permissions || [];
    const permission = permissions.find(
      p => p.module === module && p.action === action
    );

    if (!permission) {
      return ApiResponse.error(res, 403, 'FORBIDDEN', `No permission to ${action} ${module}`);
    }

    if (permission.scope === 'own' && req.params.id && req.user._id.toString() !== req.params.id) {
      return ApiResponse.error(res, 403, 'FORBIDDEN', 'You can only access your own data');
    }

    next();
  };
};

module.exports = { checkPermission, checkScope };
