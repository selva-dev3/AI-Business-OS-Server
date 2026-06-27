import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import catchAsync from '../utils/catchAsync';
import * as financeService from '../services/finance.service';
import ApiResponse from '../utils/apiResponse';

export const listInvoices = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const companyId = req.companyId!;
  const result = await financeService.listInvoices(companyId, req.query);
  ApiResponse.paginated(res, result.data, result.meta);
});

export const createInvoice = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const invoice = await financeService.createInvoice(req.companyId!, req.body);
  ApiResponse.created(res, invoice);
});

export const getInvoice = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const invoice = await financeService.getInvoiceById(req.companyId!, req.params.id as string);
  ApiResponse.success(res, invoice);
});

export const updateInvoice = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const invoice = await financeService.updateInvoice(req.companyId!, req.params.id as string, req.body);
  ApiResponse.success(res, invoice);
});

export const deleteInvoice = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const result = await financeService.removeInvoice(req.companyId!, req.params.id as string);
  ApiResponse.success(res, result);
});

export const sendInvoice = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const invoice = await financeService.sendInvoice(req.companyId!, req.params.id as string, req.body);
  ApiResponse.success(res, invoice);
});

export const recordPayment = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const payment = await financeService.recordPayment(req.companyId!, req.user!._id.toString(), req.params.id as string, req.body);
  ApiResponse.created(res, payment);
});

export const getInvoicePayments = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const payments = await financeService.getInvoicePayments(req.companyId!, req.params.id as string);
  ApiResponse.success(res, payments);
});

export const getInvoicePDF = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const pdfBuffer = await financeService.getInvoicePDF(req.companyId!, req.params.id as string);
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=invoice-${req.params.id as string}.pdf`);
  res.send(pdfBuffer);
});

export const exportInvoices = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const invoices = await financeService.exportInvoices(req.companyId!, req.query);
  ApiResponse.success(res, invoices);
});

export const listExpenses = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const companyId = req.companyId!;
  const result = await financeService.listExpenses(companyId, req.query);
  ApiResponse.paginated(res, result.data, result.meta);
});

export const createExpense = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const expense = await financeService.createExpense(req.companyId!, req.user!._id.toString(), req.body);
  ApiResponse.created(res, expense);
});

export const getExpense = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const expense = await financeService.getExpenseById(req.companyId!, req.params.id as string);
  ApiResponse.success(res, expense);
});

export const updateExpense = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const expense = await financeService.updateExpense(req.companyId!, req.params.id as string, req.body);
  ApiResponse.success(res, expense);
});

export const deleteExpense = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const result = await financeService.removeExpense(req.companyId!, req.params.id as string);
  ApiResponse.success(res, result);
});

export const approveExpense = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const expense = await financeService.approveExpense(req.companyId!, req.params.id as string, req.user!._id.toString(), req.body);
  ApiResponse.success(res, expense);
});

export const rejectExpense = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const expense = await financeService.rejectExpense(req.companyId!, req.params.id as string, req.user!._id.toString(), req.body);
  ApiResponse.success(res, expense);
});

export const uploadExpenseReceipt = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  if (!req.file) {
    res.status(400).json({ message: 'No file uploaded' });
    return;
  }
  const expense = await financeService.uploadExpenseReceipt(req.companyId!, req.params.id as string, req.file);
  ApiResponse.success(res, expense);
});

export const listPayments = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const companyId = req.companyId!;
  const result = await financeService.listPayments(companyId, req.query);
  ApiResponse.paginated(res, result.data, result.meta);
});

export const getPayment = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const payment = await financeService.getPaymentById(req.companyId!, req.params.id as string);
  ApiResponse.success(res, payment);
});

export const profitLoss = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const report = await financeService.profitLoss(req.companyId!, req.query);
  ApiResponse.success(res, report);
});

export const balanceSheet = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const report = await financeService.balanceSheet(req.companyId!, req.query);
  ApiResponse.success(res, report);
});

export const cashFlow = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const report = await financeService.cashFlow(req.companyId!, req.query);
  ApiResponse.success(res, report);
});

export const taxReport = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const report = await financeService.taxReport(req.companyId!, req.query);
  ApiResponse.success(res, report);
});

export const arAging = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const report = await financeService.arAging(req.companyId!);
  ApiResponse.success(res, report);
});

export const apAging = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const report = await financeService.apAging(req.companyId!);
  ApiResponse.success(res, report);
});

export const scheduleReport = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const schedule = await financeService.scheduleReport(req.companyId!, req.body);
  ApiResponse.created(res, schedule);
});

export const listBudgets = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const companyId = req.companyId!;
  const result = await financeService.listBudgets(companyId, req.query);
  ApiResponse.paginated(res, result.data, result.meta);
});

export const createBudget = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const budget = await financeService.createBudget(req.companyId!, req.body);
  ApiResponse.created(res, budget);
});

export const updateBudget = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const budget = await financeService.updateBudget(req.companyId!, req.params.id as string, req.body);
  ApiResponse.success(res, budget);
});

export const deleteBudget = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const result = await financeService.removeBudget(req.companyId!, req.params.id as string);
  ApiResponse.success(res, result);
});

export const budgetVsActual = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const comparison = await financeService.budgetVsActual(req.companyId!, req.query);
  ApiResponse.success(res, comparison);
});
