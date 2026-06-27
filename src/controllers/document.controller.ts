import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import catchAsync from '../utils/catchAsync';
import * as documentService from '../services/document.service';
import ApiResponse from '../utils/apiResponse';

export const listRoot = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const result = await documentService.listRoot(req.companyId!);
  ApiResponse.success(res, result);
});

export const getFolderById = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const result = await documentService.getFolderById(req.companyId!, req.params.id as string);
  ApiResponse.success(res, result);
});

export const createFolder = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const folder = await documentService.createFolder(req.companyId!, req.user!._id.toString(), req.body);
  ApiResponse.created(res, folder);
});

export const updateFolder = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const folder = await documentService.updateFolder(req.companyId!, req.params.id as string, req.body);
  ApiResponse.success(res, folder);
});

export const removeFolder = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const result = await documentService.removeFolder(req.companyId!, req.params.id as string);
  ApiResponse.success(res, result);
});

export const list = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const result = await documentService.list(req.companyId!, req.query);
  ApiResponse.paginated(res, result.data, result.meta);
});

export const create = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  if (!req.file) {
    res.status(400).json({ message: 'No file uploaded' });
    return;
  }
  const document = await documentService.create(req.companyId!, req.user!._id.toString(), req.body, req.file);
  ApiResponse.created(res, document);
});

export const getById = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const document = await documentService.getById(req.companyId!, req.params.id as string);
  ApiResponse.success(res, document);
});

export const update = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  (req as unknown as Record<string, unknown>).originalBody = req.body;
  const document = await documentService.update(req.companyId!, req.params.id as string, req.body);
  ApiResponse.success(res, document);
});

export const remove = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const result = await documentService.remove(req.companyId!, req.params.id as string);
  ApiResponse.success(res, result);
});

export const download = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const document = await documentService.download(req.companyId!, req.params.id as string);
  res.download(document.fileUrl, document.name);
});

export const share = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const result = await documentService.share(req.companyId!, req.params.id as string, req.body, req.user!._id.toString());
  ApiResponse.success(res, result);
});

export const getVersions = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const versions = await documentService.getVersions(req.companyId!, req.params.id as string);
  ApiResponse.success(res, versions);
});

export const restoreVersion = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const document = await documentService.restoreVersion(req.companyId!, req.params.id as string, req.params.version as string);
  ApiResponse.success(res, document);
});

export const search = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const result = await documentService.search(req.companyId!, req.query);
  ApiResponse.paginated(res, result.data, result.meta);
});
