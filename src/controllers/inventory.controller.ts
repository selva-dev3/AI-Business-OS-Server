import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import catchAsync from '../utils/catchAsync';
import * as inventoryService from '../services/inventory.service';
import ApiResponse from '../utils/apiResponse';

// ─── Products ──────────────────────────────────────────────────────────

export const listProducts = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const result = await inventoryService.listProducts(req.query, req.user!.companyId!.toString());
  ApiResponse.paginated(res, result.data, result.meta);
});

export const createProduct = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const product = await inventoryService.createProduct(req.body, req.user!.companyId!.toString());
  ApiResponse.created(res, product);
});

export const getProductById = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const product = await inventoryService.getProductById(req.params.id as string, req.user!.companyId!.toString());
  ApiResponse.success(res, product);
});

export const updateProduct = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const product = await inventoryService.updateProduct(req.params.id as string, req.body, req.user!.companyId!.toString());
  ApiResponse.success(res, product);
});

export const removeProduct = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const product = await inventoryService.removeProduct(req.params.id as string, req.user!.companyId!.toString());
  ApiResponse.success(res, product);
});

export const getStockHistory = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const result = await inventoryService.getStockHistory(req.params.id as string, req.user!.companyId!.toString(), req.query);
  ApiResponse.paginated(res, result.data, result.meta);
});

export const getLowStock = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const products = await inventoryService.getLowStock(req.user!.companyId!.toString());
  ApiResponse.success(res, products);
});

// ─── Categories ─────────────────────────────────────────────────────────

export const listCategories = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const tree = await inventoryService.listCategories(req.user!.companyId!.toString());
  ApiResponse.success(res, tree);
});

export const createCategory = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const category = await inventoryService.createCategory(req.body, req.user!.companyId!.toString());
  ApiResponse.created(res, category);
});

export const updateCategory = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const category = await inventoryService.updateCategory(req.params.id as string, req.body, req.user!.companyId!.toString());
  ApiResponse.success(res, category);
});

export const removeCategory = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  await inventoryService.removeCategory(req.params.id as string, req.user!.companyId!.toString());
  ApiResponse.success(res, { message: 'Category removed successfully' });
});

// ─── Warehouses ─────────────────────────────────────────────────────────

export const listWarehouses = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const warehouses = await inventoryService.listWarehouses(req.user!.companyId!.toString());
  ApiResponse.success(res, warehouses);
});

export const createWarehouse = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const warehouse = await inventoryService.createWarehouse(req.body, req.user!.companyId!.toString());
  ApiResponse.created(res, warehouse);
});

export const updateWarehouse = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const warehouse = await inventoryService.updateWarehouse(req.params.id as string, req.body, req.user!.companyId!.toString());
  ApiResponse.success(res, warehouse);
});

export const getWarehouseStock = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const result = await inventoryService.getWarehouseStock(req.params.id as string, req.user!.companyId!.toString(), req.query);
  ApiResponse.paginated(res, result.data, result.meta);
});

// ─── Stock ──────────────────────────────────────────────────────────────

export const getStock = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const result = await inventoryService.getStock(req.user!.companyId!.toString(), req.query);
  ApiResponse.paginated(res, result.data, result.meta);
});

export const adjustStock = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const stock = await inventoryService.adjustStock(req.body, req.user!.companyId!.toString(), req.user!._id.toString());
  ApiResponse.success(res, stock);
});

export const getMovements = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const result = await inventoryService.getMovements(req.user!.companyId!.toString(), req.query);
  ApiResponse.paginated(res, result.data, result.meta);
});

// ─── Transfers ─────────────────────────────────────────────────────────

export const createTransfer = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const transfer = await inventoryService.createTransfer(req.body, req.user!.companyId!.toString(), req.user!._id.toString());
  ApiResponse.created(res, transfer);
});

export const listTransfers = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const result = await inventoryService.listTransfers(req.user!.companyId!.toString(), req.query);
  ApiResponse.paginated(res, result.data, result.meta);
});

export const approveTransfer = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const transfer = await inventoryService.approveTransfer(req.params.id as string, req.user!.companyId!.toString(), req.user!._id.toString());
  ApiResponse.success(res, transfer);
});

export const completeTransfer = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const transfer = await inventoryService.completeTransfer(req.params.id as string, req.user!.companyId!.toString(), req.user!._id.toString());
  ApiResponse.success(res, transfer);
});
