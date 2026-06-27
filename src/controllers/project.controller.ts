import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import catchAsync from '../utils/catchAsync';
import * as projectService from '../services/project.service';
import ApiResponse from '../utils/apiResponse';

export const list = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const companyId = req.companyId!;
  const result = await projectService.list(companyId, req.query);
  const totalPages = Math.ceil(result.total / result.limit);
  ApiResponse.paginated(res, result.projects, {
    total: result.total,
    page: result.page,
    limit: result.limit,
    totalPages,
    hasNext: result.page < totalPages,
    hasPrev: result.page > 1,
  });
});

export const create = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const companyId = req.companyId!;
  (req as unknown as Record<string, unknown>).originalBody = req.body;
  const project = await projectService.create(companyId, req.user!._id.toString(), req.body);
  ApiResponse.created(res, project);
});

export const getById = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const companyId = req.companyId!;
  const project = await projectService.getById(companyId, req.params.id as string);
  ApiResponse.success(res, project);
});

export const update = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const companyId = req.companyId!;
  (req as unknown as Record<string, unknown>).originalBody = req.body;
  const project = await projectService.update(companyId, req.params.id as string, req.body);
  ApiResponse.success(res, project);
});

export const remove = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const companyId = req.companyId!;
  const result = await projectService.remove(companyId, req.params.id as string);
  ApiResponse.success(res, result);
});

export const addMember = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const companyId = req.companyId!;
  (req as unknown as Record<string, unknown>).originalBody = req.body;
  const member = await projectService.addMember(companyId, req.params.id as string, req.body);
  ApiResponse.created(res, member);
});

export const removeMember = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const companyId = req.companyId!;
  const result = await projectService.removeMember(companyId, req.params.id as string, req.params.userId as string);
  ApiResponse.success(res, result);
});

export const listTasks = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const companyId = req.companyId!;
  const result = await projectService.listTasks(companyId, req.params.id as string, req.query);
  const totalPages = Math.ceil(result.total / result.limit);
  ApiResponse.paginated(res, result.tasks, {
    total: result.total,
    page: result.page,
    limit: result.limit,
    totalPages,
    hasNext: result.page < totalPages,
    hasPrev: result.page > 1,
  });
});

export const createTask = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const companyId = req.companyId!;
  (req as unknown as Record<string, unknown>).originalBody = req.body;
  const task = await projectService.createTask(companyId, req.params.id as string, req.user!._id.toString(), req.body);
  ApiResponse.created(res, task);
});

export const getTaskById = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const companyId = req.companyId!;
  const task = await projectService.getTaskById(companyId, req.params.id as string);
  ApiResponse.success(res, task);
});

export const updateTask = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const companyId = req.companyId!;
  (req as unknown as Record<string, unknown>).originalBody = req.body;
  const task = await projectService.updateTask(companyId, req.params.id as string, req.body);
  ApiResponse.success(res, task);
});

export const removeTask = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const companyId = req.companyId!;
  const result = await projectService.removeTask(companyId, req.params.id as string);
  ApiResponse.success(res, result);
});

export const moveTask = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const companyId = req.companyId!;
  const task = await projectService.moveTask(companyId, req.params.id as string, req.body);
  ApiResponse.success(res, task);
});

export const logTime = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const companyId = req.companyId!;
  const entry = await projectService.logTime(companyId, req.params.id as string, req.user!._id.toString(), req.body);
  ApiResponse.created(res, entry);
});

export const addComment = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const companyId = req.companyId!;
  (req as unknown as Record<string, unknown>).originalBody = req.body;
  const comment = await projectService.addComment(companyId, req.params.id as string, req.user!._id.toString(), req.body);
  ApiResponse.created(res, comment);
});

export const getComments = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const companyId = req.companyId!;
  const comments = await projectService.getComments(companyId, req.params.id as string);
  ApiResponse.success(res, comments);
});

export const listMilestones = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const companyId = req.companyId!;
  const milestones = await projectService.listMilestones(companyId, req.params.id as string);
  ApiResponse.success(res, milestones);
});

export const getMilestone = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const companyId = req.companyId!;
  const milestone = await projectService.getMilestoneById(companyId, req.params.id as string);
  ApiResponse.success(res, milestone);
});

export const createMilestone = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const companyId = req.companyId!;
  (req as unknown as Record<string, unknown>).originalBody = req.body;
  const milestone = await projectService.createMilestone(companyId, req.params.id as string, req.body);
  ApiResponse.created(res, milestone);
});

export const updateMilestone = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const companyId = req.companyId!;
  (req as unknown as Record<string, unknown>).originalBody = req.body;
  const milestone = await projectService.updateMilestone(companyId, req.params.id as string, req.body);
  ApiResponse.success(res, milestone);
});

export const removeMilestone = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const companyId = req.companyId!;
  const result = await projectService.removeMilestone(companyId, req.params.id as string);
  ApiResponse.success(res, result);
});

export const listTimesheets = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const companyId = req.companyId!;
  const result = await projectService.listTimesheets(companyId, req.query);
  const totalPages = Math.ceil(result.total / result.limit);
  ApiResponse.paginated(res, result.entries, {
    total: result.total,
    page: result.page,
    limit: result.limit,
    totalPages,
    hasNext: result.page < totalPages,
    hasPrev: result.page > 1,
  });
});

export const createTimesheet = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const companyId = req.companyId!;
  (req as unknown as Record<string, unknown>).originalBody = req.body;
  const entry = await projectService.createTimesheet(companyId, req.user!._id.toString(), req.body);
  ApiResponse.created(res, entry);
});

export const getProjectTimesheets = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const companyId = req.companyId!;
  const result = await projectService.getProjectTimesheets(companyId, req.params.id as string, req.query);
  const totalPages = Math.ceil(result.total / result.limit);
  ApiResponse.paginated(res, result.entries, {
    total: result.total,
    page: result.page,
    limit: result.limit,
    totalPages,
    hasNext: result.page < totalPages,
    hasPrev: result.page > 1,
  });
});

export const getSummary = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const companyId = req.companyId!;
  const summary = await projectService.getSummary(companyId, req.params.id as string);
  ApiResponse.success(res, summary);
});
