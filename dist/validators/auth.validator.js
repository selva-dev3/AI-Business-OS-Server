"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePasswordSchema = exports.resetPasswordSchema = exports.forgotPasswordSchema = exports.refreshTokenSchema = exports.loginSchema = exports.registerSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
const passwordMessage = 'Password must be at least 8 characters with uppercase, lowercase, and number';
exports.registerSchema = joi_1.default.object({
    firstName: joi_1.default.string().trim().max(50).required(),
    lastName: joi_1.default.string().trim().max(50).required(),
    companyName: joi_1.default.string().trim().min(2).max(100).required(),
    email: joi_1.default.string().email().lowercase().trim().required(),
    password: joi_1.default.string().min(8).pattern(passwordPattern).message(passwordMessage).required(),
});
exports.loginSchema = joi_1.default.object({
    email: joi_1.default.string().email().lowercase().trim().required(),
    password: joi_1.default.string().required(),
});
exports.refreshTokenSchema = joi_1.default.object({
    refreshToken: joi_1.default.string().required(),
});
exports.forgotPasswordSchema = joi_1.default.object({
    email: joi_1.default.string().email().lowercase().trim().required(),
});
exports.resetPasswordSchema = joi_1.default.object({
    email: joi_1.default.string().email().lowercase().trim().required(),
    otp: joi_1.default.string().length(6).pattern(/^\d{6}$/).required(),
    newPassword: joi_1.default.string().min(8).pattern(passwordPattern).message(passwordMessage).required(),
});
exports.changePasswordSchema = joi_1.default.object({
    currentPassword: joi_1.default.string().required(),
    newPassword: joi_1.default.string().min(8).pattern(passwordPattern).message(passwordMessage).required(),
});
//# sourceMappingURL=auth.validator.js.map