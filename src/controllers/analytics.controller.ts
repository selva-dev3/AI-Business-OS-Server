import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import catchAsync from '../utils/catchAsync';
import * as analyticsService from '../services/analytics.service';
import ApiResponse from '../utils/apiResponse';

export const getOverview = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const from = req.query.from as string | undefined;
  const to = req.query.to as string | undefined;
  const data = await analyticsService.getOverview(from, to, req.companyId!);
  ApiResponse.success(res, data);
});

export const getRevenue = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const period = req.query.period as string | undefined;
  const from = req.query.from as string | undefined;
  const to = req.query.to as string | undefined;
  const data = await analyticsService.getRevenue(period || 'monthly', from, to, req.companyId!);
  ApiResponse.success(res, data);
});

export const getHRMS = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const from = req.query.from as string | undefined;
  const to = req.query.to as string | undefined;
  const data = await analyticsService.getHRMS(from, to, req.companyId!);
  ApiResponse.success(res, data);
});

export const getCRM = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const from = req.query.from as string | undefined;
  const to = req.query.to as string | undefined;
  const data = await analyticsService.getCRM(from, to, req.companyId!);
  ApiResponse.success(res, data);
});

export const getInventory = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const warehouseId = req.query.warehouseId as string | undefined;
  const data = await analyticsService.getInventory(warehouseId, req.companyId!);
  ApiResponse.success(res, data);
});

export const getSupport = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const from = req.query.from as string | undefined;
  const to = req.query.to as string | undefined;
  const data = await analyticsService.getSupport(from, to, req.companyId!);
  ApiResponse.success(res, data);
});

export const getFinance = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const from = req.query.from as string | undefined;
  const to = req.query.to as string | undefined;
  const data = await analyticsService.getFinance(from, to, req.companyId!);
  ApiResponse.success(res, data);
});

export const getAIInsights = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const { module, data } = req.body;
  const insights = await analyticsService.getAIInsights(module, data);
  ApiResponse.success(res, insights);
});

export const scheduleReport = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const schedule = await analyticsService.scheduleReport(req.body, req.companyId!);
  ApiResponse.created(res, schedule);
});
