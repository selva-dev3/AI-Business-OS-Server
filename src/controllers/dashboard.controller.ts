import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import catchAsync from '../utils/catchAsync';
import * as dashboardService from '../services/dashboard.service';
import ApiResponse from '../utils/apiResponse';

export const getActivity = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const limit = req.query.limit !== undefined ? Number(req.query.limit) : undefined;
  const module = req.query.module as string | undefined;
  const data = await dashboardService.getActivity(req.companyId!, { limit, module });
  ApiResponse.success(res, data);
});
