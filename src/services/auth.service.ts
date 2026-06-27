import jwt from 'jsonwebtoken';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import env from '../config/env';
import User from '../models/User';
import Company from '../models/Company';
import Role from '../models/Role';
import AppError from '../utils/appError';
import { generateOTP } from '../utils/helpers';
import { sendOTPEmail } from '../utils/emailService';

const MODULES = [
  'ACCOUNTS', 'ASSETS', 'ATTENDANCE', 'BUDGETS', 'COMPANIES', 'CONTACTS',
  'DEALS', 'DEPARTMENTS', 'DOCUMENTS', 'EMPLOYEES', 'EXPENSES', 'HOLIDAYS',
  'INTEGRATIONS', 'INVOICES', 'LEADS', 'LEAVES', 'PAYROLL', 'PLANS',
  'PRODUCTS', 'PROJECTS', 'PURCHASE_ORDERS', 'QUOTES', 'REPORTS', 'ROLES',
  'SETTINGS', 'TASKS', 'TICKETS', 'TIMESHEETS', 'USERS', 'VENDORS', 'WAREHOUSES',
];

const ACTIONS = ['CREATE', 'READ', 'UPDATE', 'DELETE'];

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  companyName: string;
}

interface Tokens {
  accessToken: string;
  refreshToken: string;
}

const register = async (data: RegisterData) => {
  const existingUser = await User.findOne({ email: data.email });
  if (existingUser) {
    throw new AppError(409, 'CONFLICT', 'Email already registered');
  }

  const slug = data.companyName.toLowerCase().replace(/\s+/g, '-');
  const company = await Company.create({ name: data.companyName, slug });

  const permissions = MODULES.flatMap((module) =>
    ACTIONS.map((action) => ({ module, action, scope: 'ALL' as const }))
  );

  const role = await Role.create({
    name: 'Admin',
    description: 'System administrator with full access',
    isSystem: true,
    companyId: company._id,
    permissions,
  });

  const user = await User.create({
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    password: data.password,
    companyId: company._id,
    roleId: role._id,
  });

  const tokens = await generateTokens(user as unknown as Record<string, unknown>);

  return { user, company, tokens };
};

const login = async (email: string, password: string) => {
  const user = await User.findOne({ email })
    .select('+password')
    .populate('roleId', 'name permissions')
    .populate('companyId', 'name plan');

  if (!user) {
    throw new AppError(401, 'UNAUTHORIZED', 'Invalid email or password');
  }

  if (!user.isActive) {
    throw new AppError(401, 'UNAUTHORIZED', 'Account is deactivated');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new AppError(401, 'UNAUTHORIZED', 'Invalid email or password');
  }

  user.lastLoginAt = new Date();
  const tokens = await generateTokens(user as unknown as Record<string, unknown>);

  return { user, tokens };
};

const refreshToken = async (token: string) => {
  let decoded: { userId: string };
  try {
    decoded = jwt.verify(token, env.jwt.refreshSecret) as { userId: string };
  } catch (_err) {
    throw new AppError(401, 'UNAUTHORIZED', 'Invalid or expired refresh token');
  }

  const user = await User.findById(decoded.userId).select('+refreshToken');

  if (!user || !user.isActive) {
    throw new AppError(401, 'UNAUTHORIZED', 'User not found or inactive');
  }

  if (user.refreshToken !== token) {
    throw new AppError(401, 'UNAUTHORIZED', 'Refresh token mismatch');
  }

  const tokens = await generateTokens(user as unknown as Record<string, unknown>);
  return tokens;
};

const logout = async (refreshTokenValue: string) => {
  const user = await User.findOne({ refreshToken: refreshTokenValue }).select('+refreshToken');
  if (user) {
    user.refreshToken = undefined;
    await user.save();
  }
};

const forgotPassword = async (email: string) => {
  const user = await User.findOne({ email }).select(
    '+resetPasswordOtp +resetPasswordOtpExpires'
  );

  if (!user) {
    return;
  }

  const otp = generateOTP();
  user.resetPasswordOtp = otp;
  user.resetPasswordOtpExpires = new Date(Date.now() + 10 * 60 * 1000);
  await user.save();

  try {
    await sendOTPEmail(user.email, otp);
  } catch (_err) {
    // silently fail
  }
};

const resetPassword = async (email: string, otp: string, newPassword: string) => {
  const user = await User.findOne({ email }).select(
    '+resetPasswordOtp +resetPasswordOtpExpires'
  );

  if (!user || !user.resetPasswordOtp || !user.resetPasswordOtpExpires) {
    throw new AppError(400, 'BAD_REQUEST', 'Invalid or expired OTP');
  }

  if (user.resetPasswordOtp !== otp) {
    throw new AppError(400, 'BAD_REQUEST', 'Invalid OTP');
  }

  if (user.resetPasswordOtpExpires < new Date()) {
    throw new AppError(400, 'BAD_REQUEST', 'OTP has expired');
  }

  user.password = newPassword;
  user.resetPasswordOtp = undefined;
  user.resetPasswordOtpExpires = undefined;
  await user.save();
};

const changePassword = async (userId: string, currentPassword: string, newPassword: string) => {
  const user = await User.findById(userId).select('+password');

  if (!user) {
    throw new AppError(404, 'NOT_FOUND', 'User not found');
  }

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    throw new AppError(400, 'BAD_REQUEST', 'Current password is incorrect');
  }

  user.password = newPassword;
  await user.save();
};

const generateTokens = async (user: Record<string, unknown>): Promise<Tokens> => {
  const accessToken = jwt.sign(
    {
      userId: String(user._id),
      companyId: String((user.companyId as Record<string, unknown>)?._id || user.companyId),
      roleId: String((user.roleId as Record<string, unknown>)?._id || user.roleId),
    } as object,
    env.jwt.secret,
    { expiresIn: env.jwt.accessExpiresIn } as object
  );

  const refreshTokenValue = jwt.sign(
    { userId: String(user._id) } as object,
    env.jwt.refreshSecret,
    { expiresIn: env.jwt.refreshExpiresIn } as object
  );

  (user as Record<string, unknown>).refreshToken = refreshTokenValue;
  await (user as { save: () => Promise<unknown> }).save();

  return { accessToken, refreshToken: refreshTokenValue };
};

const enable2FA = async (userId: string) => {
  const user = await User.findById(userId).select('+twoFactorSecret');

  if (!user) {
    throw new AppError(404, 'NOT_FOUND', 'User not found');
  }

  const secret = speakeasy.generateSecret({
    name: `AI Business OS (${user.email})`,
    issuer: 'AI Business OS',
  });

  const qrCode = await QRCode.toDataURL(secret.otpauth_url as string);

  user.twoFactorSecret = secret.base32;
  await user.save();

  return { qrCode, secret: secret.base32 };
};

const verify2FA = async (userId: string, token: string) => {
  const user = await User.findById(userId).select('+twoFactorSecret');

  if (!user) {
    throw new AppError(404, 'NOT_FOUND', 'User not found');
  }

  const verified = speakeasy.totp.verify({
    secret: user.twoFactorSecret!,
    encoding: 'base32',
    token,
  });

  if (!verified) {
    throw new AppError(400, 'BAD_REQUEST', 'Invalid 2FA token');
  }

  user.twoFactorEnabled = true;
  await user.save();

  return { message: '2FA enabled successfully' };
};

export {
  register,
  login,
  refreshToken,
  logout,
  forgotPassword,
  resetPassword,
  changePassword,
  generateTokens,
  enable2FA,
  verify2FA,
};
