import { Response, NextFunction } from 'express';
import fs from 'fs';
import { parse } from 'csv-parse/sync';
import { AuthRequest } from '../types';
import catchAsync from '../utils/catchAsync';
import * as hrmsService from '../services/hrms.service';
import ApiResponse from '../utils/apiResponse';
import Employee from '../models/Employee';
import AppError from '../utils/appError';

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

export const hardRemoveEmployee = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const result = await hrmsService.hardDeleteEmployee(req.companyId!, req.params.id as string);
  ApiResponse.success(res, result);
});

export const activateEmployee = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const employee = await hrmsService.activateEmployee(req.companyId!, req.params.id as string);
  ApiResponse.success(res, employee);
});

export const bulkImportEmployees = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  if (!req.file) {
    throw new AppError(400, 'BAD_REQUEST', 'CSV file is required');
  }

  let records: Record<string, unknown>[] = [];
  try {
    const fileContent = fs.readFileSync(req.file.path, 'utf8');
    records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });
  } catch (err) {
    throw new AppError(400, 'BAD_REQUEST', `Failed to parse CSV file: ${(err as Error).message}`);
  } finally {
    try {
      fs.unlinkSync(req.file.path);
    } catch (_) {}
  }

  const result = await hrmsService.bulkImportEmployees(req.companyId!, records);

  if (result.errors && result.errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Bulk import validation failed',
      data: {
        inserted: result.inserted,
        failed: result.failed,
        errors: result.errors,
      },
    });
  }

  return res.status(200).json({
    success: true,
    message: `${result.inserted} employees imported successfully`,
    data: {
      inserted: result.inserted,
      failed: result.failed,
      errors: [],
    },
  });
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
  const result = await hrmsService.listDesignations(req.companyId!, req.query);
  ApiResponse.paginated(res, result.data, result.meta);
});

export const listAllDesignations = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const data = await hrmsService.listAllDesignations(req.companyId!);
  ApiResponse.success(res, data);
});

export const getDesignationById = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const data = await hrmsService.getDesignationById(req.companyId!, req.params.id as string);
  ApiResponse.success(res, data);
});

export const createDesignation = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const designation = await hrmsService.createDesignation(req.companyId!, req.body, req.user?._id?.toString());
  ApiResponse.created(res, designation);
});

export const updateDesignation = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const designation = await hrmsService.updateDesignation(req.companyId!, req.params.id as string, req.body, req.user?._id?.toString());
  ApiResponse.success(res, designation);
});

export const removeDesignation = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const force = req.query.force === 'true';
  const designation = await hrmsService.removeDesignation(req.companyId!, req.params.id as string, force);
  ApiResponse.success(res, designation);
});

export const restoreDesignation = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const designation = await hrmsService.restoreDesignation(req.companyId!, req.params.id as string);
  ApiResponse.success(res, designation);
});

export const bulkDeleteDesignations = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const { ids, force } = req.body;
  const result = await hrmsService.bulkDeleteDesignations(req.companyId!, ids, force);
  ApiResponse.success(res, result);
});

export const bulkRestoreDesignations = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const { ids } = req.body;
  const result = await hrmsService.bulkRestoreDesignations(req.companyId!, ids);
  ApiResponse.success(res, result);
});

export const changeDesignationStatus = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const { status } = req.body;
  const designation = await hrmsService.changeDesignationStatus(req.companyId!, req.params.id as string, status, req.user?._id?.toString());
  ApiResponse.success(res, designation);
});

export const exportDesignationsCSV = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const csv = await hrmsService.exportDesignationsCSV(req.companyId!, req.query);
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="designations.csv"');
  res.send(csv);
});

export const exportDesignationsExcel = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const data = await hrmsService.exportDesignationsExcel(req.companyId!, req.query);
  const XLSX = require('xlsx');
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(data);
  XLSX.utils.book_append_sheet(wb, ws, 'Designations');
  const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename="designations.xlsx"');
  res.send(buffer);
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
  const userId = req.user!._id ? req.user!._id.toString() : req.body.employeeId;
  const request = await hrmsService.createLeaveRequest(req.companyId!, req.body, userId);
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

// ─── EMPLOYEE FULL UPDATE (PUT) ──────────────────────────────────────────────

export const fullUpdateEmployee = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const employee = await hrmsService.fullUpdateEmployee(req.companyId!, req.params.id as string, req.body);
  ApiResponse.success(res, employee);
});

// ─── EMPLOYEE PROFILE ────────────────────────────────────────────────────────

export const getEmployeeProfile = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const profile = await hrmsService.getEmployeeProfile(req.companyId!, req.params.id as string);
  ApiResponse.success(res, profile);
});

export const updateEmployeeProfile = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const profile = await hrmsService.updateEmployeeProfile(req.companyId!, req.params.id as string, req.body);
  ApiResponse.success(res, profile);
});

// ─── EMPLOYEE STATUS ─────────────────────────────────────────────────────────

export const updateEmployeeStatus = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const employee = await hrmsService.updateEmployeeStatus(req.companyId!, req.params.id as string, req.body);
  ApiResponse.success(res, employee);
});

// ─── EMPLOYEE HISTORY ────────────────────────────────────────────────────────

export const getEmployeeHistory = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const history = await hrmsService.getEmployeeHistory(req.companyId!, req.params.id as string);
  ApiResponse.success(res, history);
});

// ─── ATTENDANCE CHECKIN/CHECKOUT ─────────────────────────────────────────────

export const checkin = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const record = await hrmsService.checkin(req.companyId!, req.body);
  ApiResponse.success(res, record);
});

export const checkout = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const record = await hrmsService.checkout(req.companyId!, req.body);
  ApiResponse.success(res, record);
});

// ─── ATTENDANCE REGULARIZE ───────────────────────────────────────────────────

export const createRegularization = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const result = await hrmsService.createRegularization(req.companyId!, req.body);
  ApiResponse.created(res, result);
});

export const approveRejectRegularization = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const result = await hrmsService.approveRejectRegularization(req.companyId!, req.params.id as string, req.body);
  ApiResponse.success(res, result);
});

// ─── PAYROLL — EMPLOYEE PAYSLIPS ─────────────────────────────────────────────

export const getEmployeePayslips = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const payslips = await hrmsService.getEmployeePayslips(req.companyId!, req.params.employeeId as string);
  ApiResponse.success(res, payslips);
});

export const getPayslipByMonthYear = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const result = await hrmsService.getPayslipByMonthYear(req.companyId!, req.params.month as string, req.params.year as string);
  ApiResponse.success(res, result);
});

export const getEmployeeTaxDetails = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const tax = await hrmsService.getEmployeeTaxDetails(req.companyId!, req.params.employeeId as string);
  ApiResponse.success(res, tax);
});

export const getEmployeeDeductions = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const deductions = await hrmsService.getEmployeeDeductions(req.companyId!, req.params.employeeId as string);
  ApiResponse.success(res, deductions);
});

// ─── DOCUMENTS — REQUEST LETTER ──────────────────────────────────────────────

export const requestLetter = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  let employeeId = req.body.employeeId as string | undefined;
  if (!employeeId) {
    const emp = await Employee.findOne({ userId: req.user!._id, companyId: req.companyId! }).select('_id');
    if (!emp) throw new AppError(404, 'NOT_FOUND', 'Employee profile not found for this user');
    employeeId = emp._id.toString();
  }
  const result = await hrmsService.requestLetter(req.companyId!, employeeId, req.body);
  ApiResponse.created(res, result);
});

// ─── PERFORMANCE GOALS ───────────────────────────────────────────────────────

export const listPerformanceGoals = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const { goals, meta } = await hrmsService.listPerformanceGoals(req.companyId!, req.params.employeeId as string, req.query);
  ApiResponse.paginated(res, goals, meta);
});

export const createPerformanceGoal = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const goal = await hrmsService.createPerformanceGoal(req.companyId!, req.body, req.user!._id.toString());
  ApiResponse.created(res, goal);
});

export const updatePerformanceGoal = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const goal = await hrmsService.updatePerformanceGoal(req.companyId!, req.params.id as string, req.body);
  ApiResponse.success(res, goal);
});

// ─── PERFORMANCE APPRAISAL ───────────────────────────────────────────────────

export const submitAppraisal = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const appraisal = await hrmsService.submitAppraisal(req.companyId!, req.body, req.user!._id.toString());
  ApiResponse.created(res, appraisal);
});

export const getAppraisalHistory = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const history = await hrmsService.getAppraisalHistory(req.companyId!, req.params.employeeId as string);
  ApiResponse.success(res, history);
});

// ─── PERFORMANCE FEEDBACK ────────────────────────────────────────────────────

export const submitFeedback = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const feedback = await hrmsService.submitFeedback(req.companyId!, req.body, req.user!._id.toString());
  ApiResponse.created(res, feedback);
});

// ─── TRAINING COURSES ────────────────────────────────────────────────────────

export const listTrainingCourses = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const { courses, meta } = await hrmsService.listTrainingCourses(req.companyId!, req.query);
  ApiResponse.paginated(res, courses, meta);
});

// ─── TRAINING ENROLLMENT ─────────────────────────────────────────────────────

export const enrollCourse = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const enrollment = await hrmsService.enrollCourse(req.companyId!, req.body);
  ApiResponse.created(res, enrollment);
});

export const completeCourse = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const enrollment = await hrmsService.completeCourse(req.companyId!, req.params.enrollmentId as string, req.body);
  ApiResponse.success(res, enrollment);
});

// ─── TRAINING HISTORY & CERTIFICATIONS ───────────────────────────────────────

export const getTrainingHistory = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const history = await hrmsService.getTrainingHistory(req.companyId!, req.params.employeeId as string);
  ApiResponse.success(res, history);
});

export const getTrainingCertifications = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const certs = await hrmsService.getTrainingCertifications(req.companyId!, req.params.employeeId as string);
  ApiResponse.success(res, certs);
});

// ─── TRANSFER REQUESTS ───────────────────────────────────────────────────────

export const createTransferRequest = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const transfer = await hrmsService.createTransferRequest(req.companyId!, req.body, req.user!._id.toString());
  ApiResponse.created(res, transfer);
});

export const approveRejectTransfer = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const transfer = await hrmsService.approveRejectTransfer(req.companyId!, req.params.id as string, req.body, req.user!._id.toString());
  ApiResponse.success(res, transfer);
});

// ─── PROMOTIONS ──────────────────────────────────────────────────────────────

export const createPromotion = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const promotion = await hrmsService.createPromotion(req.companyId!, req.body, req.user!._id.toString());
  ApiResponse.created(res, promotion);
});

// ─── EXIT RESIGNATION ────────────────────────────────────────────────────────

export const submitResignation = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  let employeeId = req.body.employeeId as string | undefined;
  if (!employeeId) {
    const emp = await Employee.findOne({ userId: req.user!._id, companyId: req.companyId! }).select('_id');
    if (!emp) throw new AppError(404, 'NOT_FOUND', 'Employee profile not found for this user');
    employeeId = emp._id.toString();
  }
  const resignation = await hrmsService.submitResignation(req.companyId!, employeeId, req.body);
  ApiResponse.created(res, resignation);
});

// ─── EXIT CHECKLIST ──────────────────────────────────────────────────────────

export const getExitChecklist = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const checklist = await hrmsService.getExitChecklist(req.companyId!, req.params.employeeId as string);
  ApiResponse.success(res, checklist);
});

// ─── EXIT CLEARANCE ──────────────────────────────────────────────────────────

export const updateClearance = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const clearance = await hrmsService.updateClearance(req.companyId!, req.params.employeeId as string, req.params.departmentId as string, req.body, req.user!._id.toString());
  ApiResponse.success(res, clearance);
});

// ─── EXIT FNF ────────────────────────────────────────────────────────────────

export const getFnF = catchAsync(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const settlement = await hrmsService.getFnF(req.companyId!, req.params.employeeId as string);
  ApiResponse.success(res, settlement);
});
