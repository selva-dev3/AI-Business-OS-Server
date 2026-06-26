const authService = require('../services/auth.service');
const ApiResponse = require('../utils/apiResponse');

const register = async (req, res, next) => {
  try {
    const result = await authService.register(req.body);
    return ApiResponse.created(res, result);
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    req.user = result.user;
    req.companyId = result.user.companyId?._id || result.user.companyId;
    return ApiResponse.success(res, result);
  } catch (err) {
    next(err);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    const result = await authService.refreshToken(refreshToken);
    return ApiResponse.success(res, result);
  } catch (err) {
    next(err);
  }
};

const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    await authService.logout(refreshToken);
    return ApiResponse.success(res, { message: 'Logged out successfully' });
  } catch (err) {
    next(err);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    await authService.forgotPassword(email);
    return ApiResponse.success(res, {
      message: 'If the email exists, an OTP has been sent',
    });
  } catch (err) {
    next(err);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;
    await authService.resetPassword(email, otp, newPassword);
    return ApiResponse.success(res, { message: 'Password reset successfully' });
  } catch (err) {
    next(err);
  }
};

const getMe = async (req, res, next) => {
  try {
    return ApiResponse.success(res, { user: req.user });
  } catch (err) {
    next(err);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    await authService.changePassword(req.user._id, currentPassword, newPassword);
    return ApiResponse.success(res, { message: 'Password changed successfully' });
  } catch (err) {
    next(err);
  }
};

const enable2FA = async (req, res, next) => {
  try {
    const result = await authService.enable2FA(req.user._id);
    return ApiResponse.success(res, result);
  } catch (err) {
    next(err);
  }
};

const verify2FA = async (req, res, next) => {
  try {
    const { token } = req.body;
    const result = await authService.verify2FA(req.user._id, token);
    return ApiResponse.success(res, result);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  register,
  login,
  refreshToken,
  logout,
  forgotPassword,
  resetPassword,
  getMe,
  changePassword,
  enable2FA,
  verify2FA,
};
