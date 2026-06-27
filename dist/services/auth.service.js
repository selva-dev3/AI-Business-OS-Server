"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verify2FA = exports.enable2FA = exports.generateTokens = exports.changePassword = exports.resetPassword = exports.forgotPassword = exports.logout = exports.refreshToken = exports.login = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const speakeasy_1 = __importDefault(require("speakeasy"));
const qrcode_1 = __importDefault(require("qrcode"));
const env_1 = __importDefault(require("../config/env"));
const User_1 = __importDefault(require("../models/User"));
const Company_1 = __importDefault(require("../models/Company"));
const Role_1 = __importDefault(require("../models/Role"));
const appError_1 = __importDefault(require("../utils/appError"));
const helpers_1 = require("../utils/helpers");
const emailService_1 = require("../utils/emailService");
const MODULES = [
    'ACCOUNTS', 'ASSETS', 'ATTENDANCE', 'BUDGETS', 'COMPANIES', 'CONTACTS',
    'DEALS', 'DEPARTMENTS', 'DOCUMENTS', 'EMPLOYEES', 'EXPENSES', 'HOLIDAYS',
    'INTEGRATIONS', 'INVOICES', 'LEADS', 'LEAVES', 'PAYROLL', 'PLANS',
    'PRODUCTS', 'PROJECTS', 'PURCHASE_ORDERS', 'QUOTES', 'REPORTS', 'ROLES',
    'SETTINGS', 'TASKS', 'TICKETS', 'TIMESHEETS', 'USERS', 'VENDORS', 'WAREHOUSES',
];
const ACTIONS = ['CREATE', 'READ', 'UPDATE', 'DELETE'];
const register = async (data) => {
    const existingUser = await User_1.default.findOne({ email: data.email });
    if (existingUser) {
        throw new appError_1.default(409, 'CONFLICT', 'Email already registered');
    }
    const slug = data.companyName.toLowerCase().replace(/\s+/g, '-');
    const company = await Company_1.default.create({ name: data.companyName, slug });
    const permissions = MODULES.flatMap((module) => ACTIONS.map((action) => ({ module, action, scope: 'ALL' })));
    const role = await Role_1.default.create({
        name: 'Admin',
        description: 'System administrator with full access',
        isSystem: true,
        companyId: company._id,
        permissions,
    });
    const user = await User_1.default.create({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        companyId: company._id,
        roleId: role._id,
    });
    const tokens = await generateTokens(user);
    return { user, company, tokens };
};
exports.register = register;
const login = async (email, password) => {
    const user = await User_1.default.findOne({ email })
        .select('+password')
        .populate('roleId', 'name permissions')
        .populate('companyId', 'name plan');
    if (!user) {
        throw new appError_1.default(401, 'UNAUTHORIZED', 'Invalid email or password');
    }
    if (!user.isActive) {
        throw new appError_1.default(401, 'UNAUTHORIZED', 'Account is deactivated');
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        throw new appError_1.default(401, 'UNAUTHORIZED', 'Invalid email or password');
    }
    user.lastLoginAt = new Date();
    const tokens = await generateTokens(user);
    return { user, tokens };
};
exports.login = login;
const refreshToken = async (token) => {
    let decoded;
    try {
        decoded = jsonwebtoken_1.default.verify(token, env_1.default.jwt.refreshSecret);
    }
    catch (_err) {
        throw new appError_1.default(401, 'UNAUTHORIZED', 'Invalid or expired refresh token');
    }
    const user = await User_1.default.findById(decoded.userId).select('+refreshToken');
    if (!user || !user.isActive) {
        throw new appError_1.default(401, 'UNAUTHORIZED', 'User not found or inactive');
    }
    if (user.refreshToken !== token) {
        throw new appError_1.default(401, 'UNAUTHORIZED', 'Refresh token mismatch');
    }
    const tokens = await generateTokens(user);
    return tokens;
};
exports.refreshToken = refreshToken;
const logout = async (refreshTokenValue) => {
    const user = await User_1.default.findOne({ refreshToken: refreshTokenValue }).select('+refreshToken');
    if (user) {
        user.refreshToken = undefined;
        await user.save();
    }
};
exports.logout = logout;
const forgotPassword = async (email) => {
    const user = await User_1.default.findOne({ email }).select('+resetPasswordOtp +resetPasswordOtpExpires');
    if (!user) {
        return;
    }
    const otp = (0, helpers_1.generateOTP)();
    user.resetPasswordOtp = otp;
    user.resetPasswordOtpExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();
    try {
        await (0, emailService_1.sendOTPEmail)(user.email, otp);
    }
    catch (_err) {
        // silently fail
    }
};
exports.forgotPassword = forgotPassword;
const resetPassword = async (email, otp, newPassword) => {
    const user = await User_1.default.findOne({ email }).select('+resetPasswordOtp +resetPasswordOtpExpires');
    if (!user || !user.resetPasswordOtp || !user.resetPasswordOtpExpires) {
        throw new appError_1.default(400, 'BAD_REQUEST', 'Invalid or expired OTP');
    }
    if (user.resetPasswordOtp !== otp) {
        throw new appError_1.default(400, 'BAD_REQUEST', 'Invalid OTP');
    }
    if (user.resetPasswordOtpExpires < new Date()) {
        throw new appError_1.default(400, 'BAD_REQUEST', 'OTP has expired');
    }
    user.password = newPassword;
    user.resetPasswordOtp = undefined;
    user.resetPasswordOtpExpires = undefined;
    await user.save();
};
exports.resetPassword = resetPassword;
const changePassword = async (userId, currentPassword, newPassword) => {
    const user = await User_1.default.findById(userId).select('+password');
    if (!user) {
        throw new appError_1.default(404, 'NOT_FOUND', 'User not found');
    }
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
        throw new appError_1.default(400, 'BAD_REQUEST', 'Current password is incorrect');
    }
    user.password = newPassword;
    await user.save();
};
exports.changePassword = changePassword;
const generateTokens = async (user) => {
    const accessToken = jsonwebtoken_1.default.sign({
        userId: String(user._id),
        companyId: String(user.companyId?._id || user.companyId),
        roleId: String(user.roleId?._id || user.roleId),
    }, env_1.default.jwt.secret, { expiresIn: env_1.default.jwt.accessExpiresIn });
    const refreshTokenValue = jsonwebtoken_1.default.sign({ userId: String(user._id) }, env_1.default.jwt.refreshSecret, { expiresIn: env_1.default.jwt.refreshExpiresIn });
    user.refreshToken = refreshTokenValue;
    await user.save();
    return { accessToken, refreshToken: refreshTokenValue };
};
exports.generateTokens = generateTokens;
const enable2FA = async (userId) => {
    const user = await User_1.default.findById(userId).select('+twoFactorSecret');
    if (!user) {
        throw new appError_1.default(404, 'NOT_FOUND', 'User not found');
    }
    const secret = speakeasy_1.default.generateSecret({
        name: `AI Business OS (${user.email})`,
        issuer: 'AI Business OS',
    });
    const qrCode = await qrcode_1.default.toDataURL(secret.otpauth_url);
    user.twoFactorSecret = secret.base32;
    await user.save();
    return { qrCode, secret: secret.base32 };
};
exports.enable2FA = enable2FA;
const verify2FA = async (userId, token) => {
    const user = await User_1.default.findById(userId).select('+twoFactorSecret');
    if (!user) {
        throw new appError_1.default(404, 'NOT_FOUND', 'User not found');
    }
    const verified = speakeasy_1.default.totp.verify({
        secret: user.twoFactorSecret,
        encoding: 'base32',
        token,
    });
    if (!verified) {
        throw new appError_1.default(400, 'BAD_REQUEST', 'Invalid 2FA token');
    }
    user.twoFactorEnabled = true;
    await user.save();
    return { message: '2FA enabled successfully' };
};
exports.verify2FA = verify2FA;
//# sourceMappingURL=auth.service.js.map