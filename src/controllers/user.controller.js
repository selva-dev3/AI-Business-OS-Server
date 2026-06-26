const userService = require('../services/user.service');
const ApiResponse = require('../utils/apiResponse');

const list = async (req, res, next) => {
  try {
    const result = await userService.list(req.companyId, req.query);
    return ApiResponse.paginated(res, result.data, result.meta);
  } catch (error) {
    next(error);
  }
};

const invite = async (req, res, next) => {
  try {
    const user = await userService.invite(req.body, req.companyId, req.user);
    return ApiResponse.created(res, user);
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const user = await userService.getById(req.params.id, req.companyId);
    return ApiResponse.success(res, user);
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const user = await userService.update(req.params.id, req.body, req.companyId);
    return ApiResponse.success(res, user);
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const result = await userService.deactivate(req.params.id, req.companyId);
    return ApiResponse.success(res, result);
  } catch (error) {
    next(error);
  }
};

const changeRole = async (req, res, next) => {
  try {
    const user = await userService.changeRole(req.params.id, req.body.roleId, req.companyId);
    return ApiResponse.success(res, user);
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const result = await userService.resetPassword(req.params.id, req.body, req.companyId);
    return ApiResponse.success(res, result);
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const user = await userService.updateProfile(req.user._id, req.body);
    return ApiResponse.success(res, user);
  } catch (error) {
    next(error);
  }
};

const uploadAvatar = async (req, res, next) => {
  try {
    const result = await userService.uploadAvatar(req.user._id, req.file);
    return ApiResponse.success(res, result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  list,
  invite,
  getById,
  update,
  remove,
  changeRole,
  resetPassword,
  updateProfile,
  uploadAvatar,
};
