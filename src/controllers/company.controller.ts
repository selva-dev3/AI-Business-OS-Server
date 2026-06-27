import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import catchAsync from '../utils/catchAsync';
import * as companyService from '../services/company.service';
import ApiResponse from '../utils/apiResponse';

export const get = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const company = await companyService.get(req.companyId!);
  ApiResponse.success(res, company);
});

export const update = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  (req as unknown as Record<string, unknown>).originalBody = req.body;
  const company = await companyService.update(req.companyId!, req.body);
  ApiResponse.success(res, company);
});

export const uploadLogo = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  if (!req.file) {
    res.status(400).json({ message: 'No file uploaded' });
    return;
  }
  const result = await companyService.uploadLogo(req.companyId!, req.file);
  ApiResponse.success(res, result);
});

export const getSettings = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const settings = await companyService.getSettings(req.companyId!);
  ApiResponse.success(res, settings);
});

export const updateSettings = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const result = await companyService.updateSettings(req.companyId!, req.body);
  ApiResponse.success(res, result);
});

export const listBranches = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const branches = await companyService.listBranches(req.companyId!);
  ApiResponse.success(res, branches);
});

export const createBranch = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  (req as unknown as Record<string, unknown>).originalBody = req.body;
  const branch = await companyService.createBranch(req.companyId!, req.body);
  ApiResponse.created(res, branch);
});

export const updateBranch = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const branch = await companyService.updateBranch(req.companyId!, req.params.id as string, req.body);
  ApiResponse.success(res, branch);
});

export const deleteBranch = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const result = await companyService.deleteBranch(req.companyId!, req.params.id as string);
  ApiResponse.success(res, result);
});
