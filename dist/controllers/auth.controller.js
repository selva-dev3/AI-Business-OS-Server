"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verify2FA = exports.enable2FA = exports.changePassword = exports.getMe = exports.resetPassword = exports.forgotPassword = exports.logout = exports.refreshToken = exports.login = exports.register = void 0;
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const authService = __importStar(require("../services/auth.service"));
const apiResponse_1 = __importDefault(require("../utils/apiResponse"));
exports.register = (0, catchAsync_1.default)(async (req, res, _next) => {
    const result = await authService.register(req.body);
    apiResponse_1.default.created(res, result);
});
exports.login = (0, catchAsync_1.default)(async (req, res, _next) => {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    req.user = result.user;
    req.companyId = (result.user.companyId?._id || result.user.companyId)?.toString();
    apiResponse_1.default.success(res, result);
});
exports.refreshToken = (0, catchAsync_1.default)(async (req, res, _next) => {
    const { refreshToken: token } = req.body;
    const result = await authService.refreshToken(token);
    apiResponse_1.default.success(res, result);
});
exports.logout = (0, catchAsync_1.default)(async (req, res, _next) => {
    const { refreshToken: token } = req.body;
    await authService.logout(token);
    apiResponse_1.default.success(res, { message: 'Logged out successfully' });
});
exports.forgotPassword = (0, catchAsync_1.default)(async (req, res, _next) => {
    const { email } = req.body;
    await authService.forgotPassword(email);
    apiResponse_1.default.success(res, { message: 'If the email exists, an OTP has been sent' });
});
exports.resetPassword = (0, catchAsync_1.default)(async (req, res, _next) => {
    const { email, otp, newPassword } = req.body;
    await authService.resetPassword(email, otp, newPassword);
    apiResponse_1.default.success(res, { message: 'Password reset successfully' });
});
exports.getMe = (0, catchAsync_1.default)(async (req, res, _next) => {
    apiResponse_1.default.success(res, { user: req.user });
});
exports.changePassword = (0, catchAsync_1.default)(async (req, res, _next) => {
    const { currentPassword, newPassword } = req.body;
    await authService.changePassword(req.user._id.toString(), currentPassword, newPassword);
    apiResponse_1.default.success(res, { message: 'Password changed successfully' });
});
exports.enable2FA = (0, catchAsync_1.default)(async (req, res, _next) => {
    const result = await authService.enable2FA(req.user._id.toString());
    apiResponse_1.default.success(res, result);
});
exports.verify2FA = (0, catchAsync_1.default)(async (req, res, _next) => {
    const { token } = req.body;
    const result = await authService.verify2FA(req.user._id.toString(), token);
    apiResponse_1.default.success(res, result);
});
//# sourceMappingURL=auth.controller.js.map