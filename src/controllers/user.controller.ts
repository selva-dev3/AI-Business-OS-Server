import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import catchAsync from '../utils/catchAsync';
import userService from '../services/user.service';
import ApiResponse from '../utils/apiResponse';

export const list = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const result = await userService.list(req.companyId!, req.query);
  ApiResponse.paginated(res, result.data, result.meta);
});

export const invite = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const user = await userService.invite(req.body, req.companyId!, req.user! as unknown as Record<string, unknown>);
  ApiResponse.created(res, user);
});

export const getById = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const user = await userService.getById(req.params.id as string, req.companyId!);
  ApiResponse.success(res, user);
});

export const update = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const user = await userService.update(req.params.id as string, req.body, req.companyId!);
  ApiResponse.success(res, user);
});

export const remove = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const result = await userService.deactivate(req.params.id as string, req.companyId!);
  ApiResponse.success(res, result);
});

export const changeRole = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const user = await userService.changeRole(req.params.id as string, req.body.roleId, req.companyId!);
  ApiResponse.success(res, user);
});

export const resetPassword = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const result = await userService.resetPassword(req.params.id as string, req.body, req.companyId!);
  ApiResponse.success(res, result);
});

export const updateProfile = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const user = await userService.updateProfile(req.user!._id.toString(), req.body);
  ApiResponse.success(res, user);
});

export const uploadAvatar = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  if (!req.file) {
    res.status(400).json({ message: 'No file uploaded' });
    return;
  }
  const result = await userService.uploadAvatar(req.user!._id.toString(), req.file);
  ApiResponse.success(res, result);
});
