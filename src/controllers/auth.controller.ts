import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import catchAsync from '../utils/catchAsync';
import * as authService from '../services/auth.service';
import ApiResponse from '../utils/apiResponse';

export const register = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
  const result = await authService.register(req.body);
  ApiResponse.created(res, result);
});

export const login = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const { email, password } = req.body;
  const result = await authService.login(email, password);
  req.user = result.user;
  req.companyId = (result.user.companyId?._id || result.user.companyId)?.toString();
  ApiResponse.success(res, result);
});

export const refreshToken = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
  const { refreshToken: token } = req.body;
  const result = await authService.refreshToken(token);
  ApiResponse.success(res, result);
});

export const logout = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
  const { refreshToken: token } = req.body;
  await authService.logout(token);
  ApiResponse.success(res, { message: 'Logged out successfully' });
});

export const forgotPassword = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
  const { email } = req.body;
  await authService.forgotPassword(email);
  ApiResponse.success(res, { message: 'If the email exists, an OTP has been sent' });
});

export const resetPassword = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
  const { email, otp, newPassword } = req.body;
  await authService.resetPassword(email, otp, newPassword);
  ApiResponse.success(res, { message: 'Password reset successfully' });
});

export const getMe = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  ApiResponse.success(res, { user: req.user });
});

export const changePassword = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const { currentPassword, newPassword } = req.body;
  await authService.changePassword(req.user!._id.toString(), currentPassword, newPassword);
  ApiResponse.success(res, { message: 'Password changed successfully' });
});

export const enable2FA = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const result = await authService.enable2FA(req.user!._id.toString());
  ApiResponse.success(res, result);
});

export const verify2FA = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const { token } = req.body;
  const result = await authService.verify2FA(req.user!._id.toString(), token);
  ApiResponse.success(res, result);
});
