import { Response } from 'express';
import { AuthRequest } from '../types';
import catchAsync from '../utils/catchAsync';
import * as crmService from '../services/crm.service';
import ApiResponse from '../utils/apiResponse';

// ─── Dashboard ────────────────────────────────────────────────────────────────
export const getDashboard = catchAsync(async (req: AuthRequest, res: Response) => {
  const from = req.query.from as string | undefined;
  const to = req.query.to as string | undefined;
  const data = await crmService.getDashboard(req.companyId!, from, to);
  ApiResponse.success(res, data);
});

// ─── Leads ────────────────────────────────────────────────────────────────────
export const listLeads = catchAsync(async (req: AuthRequest, res: Response) => {
  const result = await crmService.listLeads(req.companyId!, req.query);
  ApiResponse.paginated(res, result.data, result.meta);
});

export const createLead = catchAsync(async (req: AuthRequest, res: Response) => {
  const lead = await crmService.createLead(req.companyId!, req.body);
  ApiResponse.created(res, lead);
});

export const getLead = catchAsync(async (req: AuthRequest, res: Response) => {
  const lead = await crmService.getLeadById(req.companyId!, req.params.id as string);
  ApiResponse.success(res, lead);
});

export const updateLead = catchAsync(async (req: AuthRequest, res: Response) => {
  const lead = await crmService.updateLead(req.companyId!, req.params.id as string, req.body);
  ApiResponse.success(res, lead);
});

export const deleteLead = catchAsync(async (req: AuthRequest, res: Response) => {
  await crmService.removeLead(req.companyId!, req.params.id as string);
  ApiResponse.success(res, null, 204);
});

export const changeLeadStage = catchAsync(async (req: AuthRequest, res: Response) => {
  const lead = await crmService.changeLeadStage(req.companyId!, req.params.id as string, req.body.status);
  ApiResponse.success(res, lead);
});

export const convertLead = catchAsync(async (req: AuthRequest, res: Response) => {
  const result = await crmService.convertLead(req.companyId!, req.user!._id.toString(), req.params.id as string, req.body);
  ApiResponse.success(res, result);
});

export const addLeadActivity = catchAsync(async (req: AuthRequest, res: Response) => {
  const activity = await crmService.addLeadActivity(req.companyId!, req.user!._id.toString(), req.params.id as string, req.body);
  ApiResponse.created(res, activity);
});

// ─── Contacts ─────────────────────────────────────────────────────────────────
export const listContacts = catchAsync(async (req: AuthRequest, res: Response) => {
  const result = await crmService.listContacts(req.companyId!, req.query);
  ApiResponse.paginated(res, result.data, result.meta);
});

export const createContact = catchAsync(async (req: AuthRequest, res: Response) => {
  const contact = await crmService.createContact(req.companyId!, req.body);
  ApiResponse.created(res, contact);
});

export const getContact = catchAsync(async (req: AuthRequest, res: Response) => {
  const contact = await crmService.getContactById(req.companyId!, req.params.id as string);
  ApiResponse.success(res, contact);
});

export const updateContact = catchAsync(async (req: AuthRequest, res: Response) => {
  const contact = await crmService.updateContact(req.companyId!, req.params.id as string, req.body);
  ApiResponse.success(res, contact);
});

export const deleteContact = catchAsync(async (req: AuthRequest, res: Response) => {
  await crmService.removeContact(req.companyId!, req.params.id as string);
  ApiResponse.success(res, null, 204);
});

export const mergeContacts = catchAsync(async (req: AuthRequest, res: Response) => {
  const { primaryContactId, duplicateContactIds } = req.body;
  const contact = await crmService.mergeContacts(req.companyId!, primaryContactId, duplicateContactIds);
  ApiResponse.success(res, contact);
});

// ─── Accounts ─────────────────────────────────────────────────────────────────
export const listAccounts = catchAsync(async (req: AuthRequest, res: Response) => {
  const result = await crmService.listAccounts(req.companyId!, req.query);
  ApiResponse.paginated(res, result.data, result.meta);
});

export const createAccount = catchAsync(async (req: AuthRequest, res: Response) => {
  const account = await crmService.createAccount(req.companyId!, req.body);
  ApiResponse.created(res, account);
});

export const getAccount = catchAsync(async (req: AuthRequest, res: Response) => {
  const account = await crmService.getAccountById(req.companyId!, req.params.id as string);
  ApiResponse.success(res, account);
});

export const updateAccount = catchAsync(async (req: AuthRequest, res: Response) => {
  const account = await crmService.updateAccount(req.companyId!, req.params.id as string, req.body);
  ApiResponse.success(res, account);
});

export const deleteAccount = catchAsync(async (req: AuthRequest, res: Response) => {
  await crmService.removeAccount(req.companyId!, req.params.id as string);
  ApiResponse.success(res, null, 204);
});

// ─── Deals ────────────────────────────────────────────────────────────────────
export const listDeals = catchAsync(async (req: AuthRequest, res: Response) => {
  const result = await crmService.listDeals(req.companyId!, req.query);
  ApiResponse.paginated(res, result.data, result.meta);
});

export const createDeal = catchAsync(async (req: AuthRequest, res: Response) => {
  const deal = await crmService.createDeal(req.companyId!, req.body);
  ApiResponse.created(res, deal);
});

export const getDeal = catchAsync(async (req: AuthRequest, res: Response) => {
  const deal = await crmService.getDealById(req.companyId!, req.params.id as string);
  ApiResponse.success(res, deal);
});

export const updateDeal = catchAsync(async (req: AuthRequest, res: Response) => {
  const deal = await crmService.updateDeal(req.companyId!, req.params.id as string, req.body);
  ApiResponse.success(res, deal);
});

export const deleteDeal = catchAsync(async (req: AuthRequest, res: Response) => {
  await crmService.removeDeal(req.companyId!, req.params.id as string);
  ApiResponse.success(res, null, 204);
});

export const changeDealStage = catchAsync(async (req: AuthRequest, res: Response) => {
  const deal = await crmService.changeDealStage(req.companyId!, req.params.id as string, req.body.stage);
  ApiResponse.success(res, deal);
});

export const closeWonDeal = catchAsync(async (req: AuthRequest, res: Response) => {
  const deal = await crmService.closeWonDeal(req.companyId!, req.params.id as string, req.body);
  ApiResponse.success(res, deal);
});

export const closeLostDeal = catchAsync(async (req: AuthRequest, res: Response) => {
  const deal = await crmService.closeLostDeal(req.companyId!, req.params.id as string, req.body);
  ApiResponse.success(res, deal);
});

// ─── Pipeline ─────────────────────────────────────────────────────────────────
export const getPipeline = catchAsync(async (req: AuthRequest, res: Response) => {
  const data = await crmService.getPipeline(req.companyId!);
  ApiResponse.success(res, data);
});

export const reorderPipeline = catchAsync(async (req: AuthRequest, res: Response) => {
  const { dealId, stage, position } = req.body;
  const deal = await crmService.reorderPipeline(req.companyId!, dealId, stage, position);
  ApiResponse.success(res, deal);
});

// ─── Activities ───────────────────────────────────────────────────────────────
export const listActivities = catchAsync(async (req: AuthRequest, res: Response) => {
  const result = await crmService.listActivities(req.companyId!, req.query);
  ApiResponse.paginated(res, result.data, result.meta);
});

export const createActivity = catchAsync(async (req: AuthRequest, res: Response) => {
  const activity = await crmService.createActivity(req.companyId!, req.user!._id.toString(), req.body);
  ApiResponse.created(res, activity);
});

export const updateActivity = catchAsync(async (req: AuthRequest, res: Response) => {
  const activity = await crmService.updateActivity(req.companyId!, req.params.id as string, req.body);
  ApiResponse.success(res, activity);
});

export const deleteActivity = catchAsync(async (req: AuthRequest, res: Response) => {
  await crmService.removeActivity(req.companyId!, req.params.id as string);
  ApiResponse.success(res, null, 204);
});
