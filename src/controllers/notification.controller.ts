import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import catchAsync from '../utils/catchAsync';
import * as notificationService from '../services/notification.service';
import ApiResponse from '../utils/apiResponse';

export const list = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const result = await notificationService.list(req.user!._id.toString(), req.query);
  ApiResponse.paginated(res, result.data, result.meta);
});

export const markAsRead = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const notification = await notificationService.markAsRead(req.params.id as string, req.user!._id.toString());
  ApiResponse.success(res, notification);
});

export const markAllAsRead = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const result = await notificationService.markAllAsRead(req.user!._id.toString());
  ApiResponse.success(res, result);
});

export const remove = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const result = await notificationService.remove(req.params.id as string, req.user!._id.toString());
  ApiResponse.success(res, result);
});

export const getUnreadCount = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const result = await notificationService.getUnreadCount(req.user!._id.toString());
  ApiResponse.success(res, result);
});
