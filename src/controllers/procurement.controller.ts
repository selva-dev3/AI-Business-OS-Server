import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import catchAsync from '../utils/catchAsync';
import * as procurementService from '../services/procurement.service';
import ApiResponse from '../utils/apiResponse';

// ---------- VENDORS ----------

export const listVendors = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const result = await procurementService.listVendors(req.companyId!, req.query);
  ApiResponse.paginated(res, result.data, result.meta);
});

export const createVendor = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const vendor = await procurementService.createVendor(req.companyId!, req.body);
  ApiResponse.created(res, vendor);
});

export const getVendorById = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const vendor = await procurementService.getVendorById(req.companyId!, req.params.id as string);
  ApiResponse.success(res, vendor);
});

export const updateVendor = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const vendor = await procurementService.updateVendor(req.companyId!, req.params.id as string, req.body);
  ApiResponse.success(res, vendor);
});

export const removeVendor = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const result = await procurementService.removeVendor(req.companyId!, req.params.id as string);
  ApiResponse.success(res, result);
});

export const getVendorPurchaseHistory = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const result = await procurementService.getVendorPurchaseHistory(req.companyId!, req.params.id as string);
  ApiResponse.success(res, result);
});

// ---------- RFQ ----------

export const listRFQs = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const result = await procurementService.listRFQs(req.companyId!, req.query);
  ApiResponse.paginated(res, result.data, result.meta);
});

export const createRFQ = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const rfq = await procurementService.createRFQ(req.companyId!, req.user!._id.toString(), req.body);
  ApiResponse.created(res, rfq);
});

export const getRFQById = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const rfq = await procurementService.getRFQById(req.companyId!, req.params.id as string);
  ApiResponse.success(res, rfq);
});

export const updateRFQ = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const rfq = await procurementService.updateRFQ(req.companyId!, req.params.id as string, req.body);
  ApiResponse.success(res, rfq);
});

export const removeRFQ = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const result = await procurementService.removeRFQ(req.companyId!, req.params.id as string);
  ApiResponse.success(res, result);
});

export const sendRFQ = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const rfq = await procurementService.sendRFQ(req.companyId!, req.params.id as string, req.body);
  ApiResponse.success(res, rfq);
});

export const getRFQQuotes = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const quotes = await procurementService.getRFQQuotes(req.companyId!, req.params.id as string);
  ApiResponse.success(res, quotes);
});

export const createPOFromQuote = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const po = await procurementService.createPOFromQuote(req.companyId!, req.user!._id.toString(), req.body);
  ApiResponse.created(res, po);
});

// ---------- PURCHASE ORDERS ----------

export const listPOs = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const result = await procurementService.listPOs(req.companyId!, req.query);
  ApiResponse.paginated(res, result.data, result.meta);
});

export const createPO = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const po = await procurementService.createPO(req.companyId!, req.user!._id.toString(), req.body);
  ApiResponse.created(res, po);
});

export const getPOById = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const po = await procurementService.getPOById(req.companyId!, req.params.id as string);
  ApiResponse.success(res, po);
});

export const updatePO = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const po = await procurementService.updatePO(req.companyId!, req.params.id as string, req.body);
  ApiResponse.success(res, po);
});

export const submitPO = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const po = await procurementService.submitPO(req.companyId!, req.params.id as string);
  ApiResponse.success(res, po);
});

export const approvePO = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const po = await procurementService.approvePO(req.companyId!, req.params.id as string, req.user!._id.toString());
  ApiResponse.success(res, po);
});

export const rejectPO = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const po = await procurementService.rejectPO(req.companyId!, req.params.id as string, req.body.reason);
  ApiResponse.success(res, po);
});

export const cancelPO = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const po = await procurementService.cancelPO(req.companyId!, req.params.id as string, req.body.reason);
  ApiResponse.success(res, po);
});

export const createReceipt = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const receipt = await procurementService.createReceipt(req.companyId!, req.user!._id.toString(), req.params.id as string, req.body);
  ApiResponse.created(res, receipt);
});

export const getReceipts = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const receipts = await procurementService.getReceipts(req.companyId!, req.params.id as string);
  ApiResponse.success(res, receipts);
});

export const exportPOs = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const pos = await procurementService.exportPOs(req.companyId!, req.query);
  ApiResponse.success(res, pos);
});
