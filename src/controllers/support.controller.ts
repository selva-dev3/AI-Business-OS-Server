import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import catchAsync from '../utils/catchAsync';
import * as supportService from '../services/support.service';
import ApiResponse from '../utils/apiResponse';

export const listTickets = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const result = await supportService.list(req.companyId!, req.query);
  ApiResponse.paginated(res, result.data, result.meta);
});

export const createTicket = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  (req as unknown as Record<string, unknown>).originalBody = req.body;
  const ticket = await supportService.create(req.companyId!, req.user!._id.toString(), req.body);
  ApiResponse.created(res, ticket);
});

export const getTicket = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const ticket = await supportService.getById(req.companyId!, req.params.id as string);
  ApiResponse.success(res, ticket);
});

export const updateTicket = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  (req as unknown as Record<string, unknown>).originalBody = req.body;
  const ticket = await supportService.update(req.companyId!, req.params.id as string, req.body);
  ApiResponse.success(res, ticket);
});

export const deleteTicket = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const result = await supportService.remove(req.companyId!, req.params.id as string);
  ApiResponse.success(res, result);
});

export const replyTicket = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const reply = await supportService.reply(req.companyId!, req.user!._id.toString(), req.params.id as string, req.body);
  ApiResponse.created(res, reply);
});

export const assignTicket = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const ticket = await supportService.assign(req.companyId!, req.user!._id.toString(), req.params.id as string, req.body.assigneeId);
  ApiResponse.success(res, ticket);
});

export const changeTicketStatus = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const ticket = await supportService.changeStatus(req.companyId!, req.user!._id.toString(), req.params.id as string, req.body.status, req.body.resolution);
  ApiResponse.success(res, ticket);
});

export const changeTicketPriority = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const ticket = await supportService.changePriority(req.companyId!, req.user!._id.toString(), req.params.id as string, req.body.priority);
  ApiResponse.success(res, ticket);
});

export const closeTicket = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const ticket = await supportService.close(req.companyId!, req.user!._id.toString(), req.params.id as string, req.body.resolution);
  ApiResponse.success(res, ticket);
});

export const getTicketAISummary = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const summary = await supportService.getAISummary(req.companyId!, req.params.id as string);
  ApiResponse.success(res, summary);
});

export const listCategories = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const categories = await supportService.listCategories(req.companyId!);
  ApiResponse.success(res, categories);
});

export const createCategory = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  (req as unknown as Record<string, unknown>).originalBody = req.body;
  const category = await supportService.createCategory(req.companyId!, req.body);
  ApiResponse.created(res, category);
});

export const updateCategory = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const category = await supportService.updateCategory(req.companyId!, req.params.id as string, req.body);
  ApiResponse.success(res, category);
});

export const deleteCategory = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const result = await supportService.removeCategory(req.companyId!, req.params.id as string);
  ApiResponse.success(res, result);
});

export const getReportSummary = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const summary = await supportService.getSummary(req.companyId!);
  ApiResponse.success(res, summary);
});

export const getReportSLA = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const sla = await supportService.getSLA(req.companyId!);
  ApiResponse.success(res, sla);
});

export const getReportAgentPerformance = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const performance = await supportService.getAgentPerformance(req.companyId!);
  ApiResponse.success(res, performance);
});
