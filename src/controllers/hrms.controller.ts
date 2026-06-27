import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import catchAsync from '../utils/catchAsync';
import * as hrmsService from '../services/hrms.service';
import ApiResponse from '../utils/apiResponse';

// ─── DASHBOARD ────────────────────────────────────────────────────────────────────

export const getDashboard = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const from = req.query.from as string | undefined;
  const to = req.query.to as string | undefined;
  const data = await hrmsService.getDashboard(req.companyId!, from, to);
  ApiResponse.success(res, data);
});

// ─── EMPLOYEES ────────────────────────────────────────────────────────────────────

export const listEmployees = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const { employees, meta } = await hrmsService.listEmployees(req.companyId!, req.query);
  ApiResponse.paginated(res, employees, meta);
});

export const createEmployee = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const employee = await hrmsService.createEmployee(req.companyId!, req.body);
  ApiResponse.created(res, employee);
});

export const getEmployeeById = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const employee = await hrmsService.getEmployeeById(req.companyId!, req.params.id as string);
  ApiResponse.success(res, employee);
});

export const updateEmployee = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const employee = await hrmsService.updateEmployee(req.companyId!, req.params.id as string, req.body);
  ApiResponse.success(res, employee);
});

export const removeEmployee = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const employee = await hrmsService.removeEmployee(req.companyId!, req.params.id as string);
  ApiResponse.success(res, employee);
});

export const activateEmployee = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const employee = await hrmsService.activateEmployee(req.companyId!, req.params.id as string);
  ApiResponse.success(res, employee);
});

export const bulkImportEmployees = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const result = await hrmsService.bulkImportEmployees(req.companyId!, req.body.employees || []);
  ApiResponse.success(res, result);
});

export const exportEmployees = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const employees = await hrmsService.exportEmployees(req.companyId!, req.query);
  ApiResponse.success(res, employees);
});

// ─── DEPARTMENTS ──────────────────────────────────────────────────────────────────

export const listDepartments = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const data = await hrmsService.listDepartments(req.companyId!);
  ApiResponse.success(res, data);
});

export const createDepartment = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const department = await hrmsService.createDepartment(req.companyId!, req.body);
  ApiResponse.created(res, department);
});

export const updateDepartment = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const department = await hrmsService.updateDepartment(req.companyId!, req.params.id as string, req.body);
  ApiResponse.success(res, department);
});

export const removeDepartment = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const department = await hrmsService.removeDepartment(req.companyId!, req.params.id as string);
  ApiResponse.success(res, department);
});

export const listDepartmentEmployees = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const { employees, meta } = await hrmsService.listDepartmentEmployees(req.companyId!, req.params.id as string, req.query);
  ApiResponse.paginated(res, employees, meta);
});

// ─── DESIGNATIONS ─────────────────────────────────────────────────────────────────

export const listDesignations = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const data = await hrmsService.listDesignations(req.companyId!);
  ApiResponse.success(res, data);
});

export const createDesignation = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const designation = await hrmsService.createDesignation(req.companyId!, req.body);
  ApiResponse.created(res, designation);
});

export const updateDesignation = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const designation = await hrmsService.updateDesignation(req.companyId!, req.params.id as string, req.body);
  ApiResponse.success(res, designation);
});

export const removeDesignation = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const designation = await hrmsService.removeDesignation(req.companyId!, req.params.id as string);
  ApiResponse.success(res, designation);
});

// ─── ATTENDANCE ───────────────────────────────────────────────────────────────────

export const listAttendance = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const { records, meta } = await hrmsService.listAttendance(req.companyId!, req.query);
  ApiResponse.paginated(res, records, meta);
});

export const createAttendance = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const record = await hrmsService.createAttendance(req.companyId!, req.body);
  ApiResponse.created(res, record);
});

export const updateAttendance = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const record = await hrmsService.updateAttendance(req.companyId!, req.params.id as string, req.body);
  ApiResponse.success(res, record);
});

export const getAttendanceSummary = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const summary = await hrmsService.getAttendanceSummary(req.companyId!, req.query);
  ApiResponse.success(res, summary);
});

export const bulkCreateAttendance = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const result = await hrmsService.bulkCreateAttendance(req.companyId!, req.body);
  ApiResponse.success(res, result);
});

export const exportAttendance = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const records = await hrmsService.exportAttendance(req.companyId!, req.query);
  ApiResponse.success(res, records);
});

// ─── LEAVE TYPES ──────────────────────────────────────────────────────────────────

export const listLeaveTypes = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const data = await hrmsService.listLeaveTypes(req.companyId!);
  ApiResponse.success(res, data);
});

export const createLeaveType = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const leaveType = await hrmsService.createLeaveType(req.companyId!, req.body);
  ApiResponse.created(res, leaveType);
});

export const updateLeaveType = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const leaveType = await hrmsService.updateLeaveType(req.companyId!, req.params.id as string, req.body);
  ApiResponse.success(res, leaveType);
});

export const removeLeaveType = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const leaveType = await hrmsService.removeLeaveType(req.companyId!, req.params.id as string);
  ApiResponse.success(res, leaveType);
});

// ─── LEAVE REQUESTS ───────────────────────────────────────────────────────────────

export const listLeaveRequests = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const { requests, meta } = await hrmsService.listLeaveRequests(req.companyId!, req.query);
  ApiResponse.paginated(res, requests, meta);
});

export const createLeaveRequest = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const request = await hrmsService.createLeaveRequest(req.companyId!, req.body, req.user!._id.toString());
  ApiResponse.created(res, request);
});

export const getLeaveRequestById = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const request = await hrmsService.getLeaveRequestById(req.companyId!, req.params.id as string);
  ApiResponse.success(res, request);
});

export const approveLeaveRequest = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const request = await hrmsService.approveLeaveRequest(req.companyId!, req.params.id as string, req.user!._id.toString(), req.body);
  ApiResponse.success(res, request);
});

export const rejectLeaveRequest = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const request = await hrmsService.rejectLeaveRequest(req.companyId!, req.params.id as string, req.user!._id.toString(), req.body);
  ApiResponse.success(res, request);
});

export const removeLeaveRequest = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const request = await hrmsService.removeLeaveRequest(req.companyId!, req.params.id as string);
  ApiResponse.success(res, request);
});

export const getLeaveBalance = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const data = await hrmsService.getLeaveBalance(req.companyId!, req.query);
  ApiResponse.success(res, data);
});

export const getLeaveCalendar = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const data = await hrmsService.getLeaveCalendar(req.companyId!, req.query);
  ApiResponse.success(res, data);
});

// ─── HOLIDAYS ─────────────────────────────────────────────────────────────────────

export const listHolidays = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const data = await hrmsService.listHolidays(req.companyId!, req.query);
  ApiResponse.success(res, data);
});

export const createHoliday = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const holiday = await hrmsService.createHoliday(req.companyId!, req.body);
  ApiResponse.created(res, holiday);
});

export const updateHoliday = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const holiday = await hrmsService.updateHoliday(req.companyId!, req.params.id as string, req.body);
  ApiResponse.success(res, holiday);
});

export const removeHoliday = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const holiday = await hrmsService.removeHoliday(req.companyId!, req.params.id as string);
  ApiResponse.success(res, holiday);
});

// ─── PAYROLL ──────────────────────────────────────────────────────────────────────

export const listPayroll = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const { payrolls, meta } = await hrmsService.listPayroll(req.companyId!, req.query);
  ApiResponse.paginated(res, payrolls, meta);
});

export const runPayroll = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const payroll = await hrmsService.runPayroll(req.companyId!, req.body, req.user!._id.toString());
  ApiResponse.created(res, payroll);
});

export const getPayrollById = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const payroll = await hrmsService.getPayrollById(req.companyId!, req.params.runId as string);
  ApiResponse.success(res, payroll);
});

export const getPayslip = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const payslip = await hrmsService.getPayslip(req.companyId!, req.params.id as string);
  ApiResponse.success(res, payslip);
});

export const exportPayslips = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const payslips = await hrmsService.exportPayslips(req.companyId!, req.query);
  ApiResponse.success(res, payslips);
});

// ─── SALARY STRUCTURE ─────────────────────────────────────────────────────────────

export const getSalaryStructure = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const ss = await hrmsService.getSalaryStructure(req.companyId!, req.params.employeeId as string);
  ApiResponse.success(res, ss);
});

export const createSalaryStructure = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const ss = await hrmsService.createSalaryStructure(req.companyId!, req.body);
  ApiResponse.created(res, ss);
});

export const updateSalaryStructure = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const ss = await hrmsService.updateSalaryStructure(req.companyId!, req.params.employeeId as string, req.body);
  ApiResponse.success(res, ss);
});

// ─── ASSETS ───────────────────────────────────────────────────────────────────────

export const listAssets = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const { assets, meta } = await hrmsService.listAssets(req.companyId!, req.query);
  ApiResponse.paginated(res, assets, meta);
});

export const createAsset = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const asset = await hrmsService.createAsset(req.companyId!, req.body);
  ApiResponse.created(res, asset);
});

export const updateAsset = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const asset = await hrmsService.updateAsset(req.companyId!, req.params.id as string, req.body);
  ApiResponse.success(res, asset);
});

export const removeAsset = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const asset = await hrmsService.removeAsset(req.companyId!, req.params.id as string);
  ApiResponse.success(res, asset);
});

export const assignAsset = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const result = await hrmsService.assignAsset(req.companyId!, req.params.id as string, req.body);
  ApiResponse.success(res, result);
});

export const returnAsset = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const asset = await hrmsService.returnAsset(req.companyId!, req.params.id as string, req.body);
  ApiResponse.success(res, asset);
});

// ─── REPORTS ──────────────────────────────────────────────────────────────────────

export const getAttendanceReport = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const data = await hrmsService.getAttendanceReport(req.companyId!, req.query);
  ApiResponse.success(res, data);
});

export const getLeaveReport = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const data = await hrmsService.getLeaveReport(req.companyId!, req.query);
  ApiResponse.success(res, data);
});

export const getPayrollReport = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const data = await hrmsService.getPayrollReport(req.companyId!, req.query);
  ApiResponse.success(res, data);
});

export const getHeadcountReport = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const data = await hrmsService.getHeadcountReport(req.companyId!, req.query);
  ApiResponse.success(res, data);
});

export const getAttritionReport = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const data = await hrmsService.getAttritionReport(req.companyId!, req.query);
  ApiResponse.success(res, data);
});
