import { Request, Response, NextFunction } from 'express';
import catchAsync from '../utils/catchAsync';
import * as aiService from '../services/ai.service';
import ApiResponse from '../utils/apiResponse';

export const chat = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
  const { messages, context } = req.body;
  const result = await aiService.chat(messages, context);
  ApiResponse.success(res, result);
});

export const getInsights = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
  const { module, data } = req.body;
  const insights = await aiService.getInsights(module, data);
  ApiResponse.success(res, insights);
});

export const summarize = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
  const { entityType, entityId } = req.body;
  const result = await aiService.summarize(entityType, entityId);
  ApiResponse.success(res, result);
});

export const generateEmail = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
  const result = await aiService.generateEmail(req.body);
  ApiResponse.success(res, result);
});

export const extractDocument = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
  if (!req.file) {
    res.status(400).json({ message: 'No file uploaded' });
    return;
  }
  const result = await aiService.extractDocument(req.file);
  ApiResponse.success(res, result);
});

export const forecast = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
  const { historicalData, periods } = req.body;
  const result = await aiService.forecast(historicalData, periods);
  ApiResponse.success(res, result);
});

export const parseResume = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
  if (!req.file) {
    res.status(400).json({ message: 'No file uploaded' });
    return;
  }
  const result = await aiService.parseResume(req.file);
  ApiResponse.success(res, result);
});
