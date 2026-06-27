import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import catchAsync from '../utils/catchAsync';
import * as settingsService from '../services/settings.service';
import ApiResponse from '../utils/apiResponse';

export const listRoles = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const roles = await settingsService.listRoles(req.companyId!);
  ApiResponse.success(res, roles);
});

export const createRole = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const role = await settingsService.createRole(req.companyId!, req.body);
  ApiResponse.created(res, role);
});

export const getRoleById = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const role = await settingsService.getRoleById(req.companyId!, req.params.id as string);
  ApiResponse.success(res, role);
});

export const updateRole = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  (req as unknown as Record<string, unknown>).originalBody = req.body;
  const role = await settingsService.updateRole(req.companyId!, req.params.id as string, req.body);
  ApiResponse.success(res, role);
});

export const removeRole = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const result = await settingsService.removeRole(req.companyId!, req.params.id as string);
  ApiResponse.success(res, result);
});

export const listPermissions = catchAsync(async (_req: AuthRequest, res: Response, _next: NextFunction) => {
  const permissions = await settingsService.listPermissions();
  ApiResponse.success(res, permissions);
});

export const getEmailSettings = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const settings = await settingsService.getEmailSettings(req.companyId!);
  ApiResponse.success(res, settings);
});

export const updateEmailSettings = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const result = await settingsService.updateEmailSettings(req.companyId!, req.body);
  ApiResponse.success(res, result);
});

export const testEmail = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
  const result = await settingsService.testEmail(req.body);
  ApiResponse.success(res, result);
});

export const listTemplates = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const templates = await settingsService.listTemplates(req.companyId!);
  ApiResponse.success(res, templates);
});

export const updateTemplate = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const template = await settingsService.updateTemplate(req.companyId!, req.params.type as string, req.body);
  ApiResponse.success(res, template);
});

export const listIntegrations = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const integrations = await settingsService.listIntegrations(req.companyId!);
  ApiResponse.success(res, integrations);
});

export const connectIntegration = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const integration = await settingsService.connectIntegration(req.companyId!, req.params.type as string, req.body);
  ApiResponse.success(res, integration);
});

export const disconnectIntegration = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const result = await settingsService.disconnectIntegration(req.companyId!, req.params.type as string);
  ApiResponse.success(res, result);
});

export const listApiKeys = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const keys = await settingsService.listApiKeys(req.companyId!);
  ApiResponse.success(res, keys);
});

export const createApiKey = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const apiKey = await settingsService.createApiKey(req.companyId!, req.body);
  ApiResponse.created(res, apiKey);
});

export const removeApiKey = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const result = await settingsService.removeApiKey(req.companyId!, req.params.id as string);
  ApiResponse.success(res, result);
});

export const listAuditLogs = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const result = await settingsService.listAuditLogs(req.companyId!, req.query);
  ApiResponse.paginated(res, result.data, result.meta);
});

export const exportAuditLogs = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const logs = await settingsService.exportAuditLogs(req.companyId!, req.query);
  ApiResponse.success(res, logs);
});

export const getPlan = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const plan = await settingsService.getPlan(req.companyId!);
  ApiResponse.success(res, plan);
});

export const getUsage = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const usage = await settingsService.getUsage(req.companyId!);
  ApiResponse.success(res, usage);
});

export const getInvoices = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const invoices = await settingsService.getInvoices(req.companyId!);
  ApiResponse.success(res, invoices);
});

export const upgradePlan = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const result = await settingsService.upgradePlan(req.companyId!, req.body);
  ApiResponse.success(res, result);
});
