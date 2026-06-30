"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createHoliday = exports.listHolidays = exports.getLeaveCalendar = exports.getLeaveBalance = exports.removeLeaveRequest = exports.rejectLeaveRequest = exports.approveLeaveRequest = exports.getLeaveRequestById = exports.createLeaveRequest = exports.listLeaveRequests = exports.removeLeaveType = exports.updateLeaveType = exports.createLeaveType = exports.listLeaveTypes = exports.exportAttendance = exports.bulkCreateAttendance = exports.getAttendanceSummary = exports.getAttendanceById = exports.updateAttendance = exports.createAttendance = exports.listAttendance = exports.exportDesignationsExcel = exports.exportDesignationsCSV = exports.changeDesignationStatus = exports.bulkRestoreDesignations = exports.bulkDeleteDesignations = exports.restoreDesignation = exports.removeDesignation = exports.updateDesignation = exports.createDesignation = exports.getDesignationById = exports.listAllDesignations = exports.listDesignations = exports.listDepartmentEmployees = exports.removeDepartment = exports.updateDepartment = exports.createDepartment = exports.listDepartments = exports.exportEmployees = exports.bulkImportEmployees = exports.reinstateEmployee = exports.suspendEmployee = exports.activateEmployee = exports.hardRemoveEmployee = exports.removeEmployee = exports.updateEmployee = exports.getEmployeeById = exports.createEmployee = exports.listEmployees = exports.getDashboard = void 0;
exports.createPromotion = exports.approveRejectTransfer = exports.createTransferRequest = exports.getTrainingCertifications = exports.getTrainingHistory = exports.completeCourse = exports.enrollCourse = exports.listTrainingCourses = exports.submitFeedback = exports.getAppraisalHistory = exports.submitAppraisal = exports.updatePerformanceGoal = exports.createPerformanceGoal = exports.listPerformanceGoals = exports.requestLetter = exports.getEmployeeDeductions = exports.getEmployeeTaxDetails = exports.getPayslipByMonthYear = exports.getEmployeePayslips = exports.listRegularizations = exports.approveRejectRegularization = exports.createRegularization = exports.checkout = exports.checkin = exports.getEmployeeHistory = exports.updateEmployeeStatus = exports.updateEmployeeProfile = exports.getEmployeeProfile = exports.fullUpdateEmployee = exports.getAttritionReport = exports.getHeadcountReport = exports.getPayrollReport = exports.getLeaveReport = exports.getAttendanceReport = exports.returnAsset = exports.assignAsset = exports.removeAsset = exports.updateAsset = exports.createAsset = exports.listAssets = exports.updateSalaryStructure = exports.createSalaryStructure = exports.getSalaryStructure = exports.exportPayslips = exports.getPayslip = exports.getPayrollById = exports.runPayroll = exports.listPayroll = exports.removeHoliday = exports.updateHoliday = void 0;
exports.downloadEmployeeDocument = exports.deleteEmployeeNote = exports.updateEmployeeNote = exports.listEmployeeNotes = exports.createEmployeeNote = exports.listEmployeeDocuments = exports.createEmployeeDocument = exports.resetEmployeePassword = exports.assignEmployeeRole = exports.terminateEmployee = exports.initiateLeaveOnBehalf = exports.getEmployeePayroll = exports.getEmployeeLeaves = exports.getEmployeeAttendance = exports.getFnF = exports.updateClearance = exports.getExitChecklist = exports.submitResignation = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const sync_1 = require("csv-parse/sync");
const env_1 = __importDefault(require("../config/env"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const hrmsService = __importStar(require("../services/hrms.service"));
const apiResponse_1 = __importDefault(require("../utils/apiResponse"));
const Employee_1 = __importDefault(require("../models/Employee"));
const appError_1 = __importDefault(require("../utils/appError"));
// ─── DASHBOARD ────────────────────────────────────────────────────────────────────
exports.getDashboard = (0, catchAsync_1.default)(async (req, res, _next) => {
    const from = req.query.from;
    const to = req.query.to;
    const data = await hrmsService.getDashboard(req.companyId, from, to);
    apiResponse_1.default.success(res, data);
});
// ─── EMPLOYEES ────────────────────────────────────────────────────────────────────
exports.listEmployees = (0, catchAsync_1.default)(async (req, res, _next) => {
    const { employees, meta, summary } = await hrmsService.listEmployees(req.companyId, req.query);
    apiResponse_1.default.success(res, {
        employees,
        pagination: meta,
        summary,
        meta,
    });
});
exports.createEmployee = (0, catchAsync_1.default)(async (req, res, _next) => {
    const employee = await hrmsService.createEmployee(req.companyId, req.body);
    apiResponse_1.default.created(res, employee);
});
exports.getEmployeeById = (0, catchAsync_1.default)(async (req, res, _next) => {
    const employee = await hrmsService.getEmployeeById(req.companyId, req.params.id);
    apiResponse_1.default.success(res, employee);
});
exports.updateEmployee = (0, catchAsync_1.default)(async (req, res, _next) => {
    const employee = await hrmsService.updateEmployee(req.companyId, req.params.id, req.body);
    apiResponse_1.default.success(res, employee);
});
exports.removeEmployee = (0, catchAsync_1.default)(async (req, res, _next) => {
    const employee = await hrmsService.removeEmployee(req.companyId, req.params.id);
    apiResponse_1.default.success(res, employee);
});
exports.hardRemoveEmployee = (0, catchAsync_1.default)(async (req, res, _next) => {
    const result = await hrmsService.hardDeleteEmployee(req.companyId, req.params.id);
    apiResponse_1.default.success(res, result);
});
exports.activateEmployee = (0, catchAsync_1.default)(async (req, res, _next) => {
    const employee = await hrmsService.activateEmployee(req.companyId, req.params.id);
    apiResponse_1.default.success(res, employee);
});
exports.suspendEmployee = (0, catchAsync_1.default)(async (req, res, _next) => {
    const employee = await hrmsService.suspendEmployee(req.companyId, req.params.id, req.user._id.toString(), req.body);
    apiResponse_1.default.success(res, employee);
});
exports.reinstateEmployee = (0, catchAsync_1.default)(async (req, res, _next) => {
    const employee = await hrmsService.reinstateEmployee(req.companyId, req.params.id, req.user._id.toString(), req.body);
    apiResponse_1.default.success(res, employee);
});
exports.bulkImportEmployees = (0, catchAsync_1.default)(async (req, res, _next) => {
    if (!req.file) {
        throw new appError_1.default(400, 'BAD_REQUEST', 'CSV file is required');
    }
    let records = [];
    try {
        const fileContent = fs_1.default.readFileSync(req.file.path, 'utf8');
        records = (0, sync_1.parse)(fileContent, {
            columns: true,
            skip_empty_lines: true,
            trim: true,
        });
    }
    catch (err) {
        throw new appError_1.default(400, 'BAD_REQUEST', `Failed to parse CSV file: ${err.message}`);
    }
    finally {
        try {
            fs_1.default.unlinkSync(req.file.path);
        }
        catch (_) { }
    }
    const result = await hrmsService.bulkImportEmployees(req.companyId, records);
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
exports.exportEmployees = (0, catchAsync_1.default)(async (req, res, _next) => {
    const employees = await hrmsService.exportEmployees(req.companyId, req.query);
    apiResponse_1.default.success(res, employees);
});
// ─── DEPARTMENTS ──────────────────────────────────────────────────────────────────
exports.listDepartments = (0, catchAsync_1.default)(async (req, res, _next) => {
    const data = await hrmsService.listDepartments(req.companyId);
    apiResponse_1.default.success(res, data);
});
exports.createDepartment = (0, catchAsync_1.default)(async (req, res, _next) => {
    const department = await hrmsService.createDepartment(req.companyId, req.body);
    apiResponse_1.default.created(res, department);
});
exports.updateDepartment = (0, catchAsync_1.default)(async (req, res, _next) => {
    const department = await hrmsService.updateDepartment(req.companyId, req.params.id, req.body);
    apiResponse_1.default.success(res, department);
});
exports.removeDepartment = (0, catchAsync_1.default)(async (req, res, _next) => {
    const department = await hrmsService.removeDepartment(req.companyId, req.params.id);
    apiResponse_1.default.success(res, department);
});
exports.listDepartmentEmployees = (0, catchAsync_1.default)(async (req, res, _next) => {
    const { employees, meta } = await hrmsService.listDepartmentEmployees(req.companyId, req.params.id, req.query);
    apiResponse_1.default.paginated(res, employees, meta);
});
// ─── DESIGNATIONS ─────────────────────────────────────────────────────────────────
exports.listDesignations = (0, catchAsync_1.default)(async (req, res, _next) => {
    const result = await hrmsService.listDesignations(req.companyId, req.query);
    apiResponse_1.default.paginated(res, result.data, result.meta);
});
exports.listAllDesignations = (0, catchAsync_1.default)(async (req, res, _next) => {
    const data = await hrmsService.listAllDesignations(req.companyId);
    apiResponse_1.default.success(res, data);
});
exports.getDesignationById = (0, catchAsync_1.default)(async (req, res, _next) => {
    const data = await hrmsService.getDesignationById(req.companyId, req.params.id);
    apiResponse_1.default.success(res, data);
});
exports.createDesignation = (0, catchAsync_1.default)(async (req, res, _next) => {
    const designation = await hrmsService.createDesignation(req.companyId, req.body, req.user?._id?.toString());
    apiResponse_1.default.created(res, designation);
});
exports.updateDesignation = (0, catchAsync_1.default)(async (req, res, _next) => {
    const designation = await hrmsService.updateDesignation(req.companyId, req.params.id, req.body, req.user?._id?.toString());
    apiResponse_1.default.success(res, designation);
});
exports.removeDesignation = (0, catchAsync_1.default)(async (req, res, _next) => {
    const force = req.query.force === 'true';
    const designation = await hrmsService.removeDesignation(req.companyId, req.params.id, force);
    apiResponse_1.default.success(res, designation);
});
exports.restoreDesignation = (0, catchAsync_1.default)(async (req, res, _next) => {
    const designation = await hrmsService.restoreDesignation(req.companyId, req.params.id);
    apiResponse_1.default.success(res, designation);
});
exports.bulkDeleteDesignations = (0, catchAsync_1.default)(async (req, res, _next) => {
    const { ids, force } = req.body;
    const result = await hrmsService.bulkDeleteDesignations(req.companyId, ids, force);
    apiResponse_1.default.success(res, result);
});
exports.bulkRestoreDesignations = (0, catchAsync_1.default)(async (req, res, _next) => {
    const { ids } = req.body;
    const result = await hrmsService.bulkRestoreDesignations(req.companyId, ids);
    apiResponse_1.default.success(res, result);
});
exports.changeDesignationStatus = (0, catchAsync_1.default)(async (req, res, _next) => {
    const { status } = req.body;
    const designation = await hrmsService.changeDesignationStatus(req.companyId, req.params.id, status, req.user?._id?.toString());
    apiResponse_1.default.success(res, designation);
});
exports.exportDesignationsCSV = (0, catchAsync_1.default)(async (req, res, _next) => {
    const csv = await hrmsService.exportDesignationsCSV(req.companyId, req.query);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="designations.csv"');
    res.send(csv);
});
exports.exportDesignationsExcel = (0, catchAsync_1.default)(async (req, res, _next) => {
    const data = await hrmsService.exportDesignationsExcel(req.companyId, req.query);
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
exports.listAttendance = (0, catchAsync_1.default)(async (req, res, _next) => {
    const { records, meta } = await hrmsService.listAttendance(req.companyId, req.query);
    apiResponse_1.default.paginated(res, records, meta);
});
exports.createAttendance = (0, catchAsync_1.default)(async (req, res, _next) => {
    const record = await hrmsService.createAttendance(req.companyId, req.body);
    apiResponse_1.default.created(res, record);
});
exports.updateAttendance = (0, catchAsync_1.default)(async (req, res, _next) => {
    const record = await hrmsService.updateAttendance(req.companyId, req.params.id, req.body);
    apiResponse_1.default.success(res, record);
});
exports.getAttendanceById = (0, catchAsync_1.default)(async (req, res, _next) => {
    const record = await hrmsService.getAttendanceById(req.companyId, req.params.id);
    apiResponse_1.default.success(res, record);
});
exports.getAttendanceSummary = (0, catchAsync_1.default)(async (req, res, _next) => {
    const summary = await hrmsService.getAttendanceSummary(req.companyId, req.query);
    apiResponse_1.default.success(res, summary);
});
exports.bulkCreateAttendance = (0, catchAsync_1.default)(async (req, res, _next) => {
    const result = await hrmsService.bulkCreateAttendance(req.companyId, req.body);
    apiResponse_1.default.success(res, result);
});
exports.exportAttendance = (0, catchAsync_1.default)(async (req, res, _next) => {
    const records = await hrmsService.exportAttendance(req.companyId, req.query);
    apiResponse_1.default.success(res, records);
});
// ─── LEAVE TYPES ──────────────────────────────────────────────────────────────────
exports.listLeaveTypes = (0, catchAsync_1.default)(async (req, res, _next) => {
    const data = await hrmsService.listLeaveTypes(req.companyId);
    apiResponse_1.default.success(res, data);
});
exports.createLeaveType = (0, catchAsync_1.default)(async (req, res, _next) => {
    const leaveType = await hrmsService.createLeaveType(req.companyId, req.body);
    apiResponse_1.default.created(res, leaveType);
});
exports.updateLeaveType = (0, catchAsync_1.default)(async (req, res, _next) => {
    const leaveType = await hrmsService.updateLeaveType(req.companyId, req.params.id, req.body);
    apiResponse_1.default.success(res, leaveType);
});
exports.removeLeaveType = (0, catchAsync_1.default)(async (req, res, _next) => {
    const leaveType = await hrmsService.removeLeaveType(req.companyId, req.params.id);
    apiResponse_1.default.success(res, leaveType);
});
// ─── LEAVE REQUESTS ───────────────────────────────────────────────────────────────
exports.listLeaveRequests = (0, catchAsync_1.default)(async (req, res, _next) => {
    const { requests, meta } = await hrmsService.listLeaveRequests(req.companyId, req.query);
    apiResponse_1.default.paginated(res, requests, meta);
});
exports.createLeaveRequest = (0, catchAsync_1.default)(async (req, res, _next) => {
    const userId = req.user._id ? req.user._id.toString() : req.body.employeeId;
    const request = await hrmsService.createLeaveRequest(req.companyId, req.body, userId);
    apiResponse_1.default.created(res, request);
});
exports.getLeaveRequestById = (0, catchAsync_1.default)(async (req, res, _next) => {
    const request = await hrmsService.getLeaveRequestById(req.companyId, req.params.id);
    apiResponse_1.default.success(res, request);
});
exports.approveLeaveRequest = (0, catchAsync_1.default)(async (req, res, _next) => {
    const request = await hrmsService.approveLeaveRequest(req.companyId, req.params.id, req.user._id.toString(), req.body);
    apiResponse_1.default.success(res, request);
});
exports.rejectLeaveRequest = (0, catchAsync_1.default)(async (req, res, _next) => {
    const request = await hrmsService.rejectLeaveRequest(req.companyId, req.params.id, req.user._id.toString(), req.body);
    apiResponse_1.default.success(res, request);
});
exports.removeLeaveRequest = (0, catchAsync_1.default)(async (req, res, _next) => {
    const request = await hrmsService.removeLeaveRequest(req.companyId, req.params.id);
    apiResponse_1.default.success(res, request);
});
exports.getLeaveBalance = (0, catchAsync_1.default)(async (req, res, _next) => {
    const data = await hrmsService.getLeaveBalance(req.companyId, req.query);
    apiResponse_1.default.success(res, data);
});
exports.getLeaveCalendar = (0, catchAsync_1.default)(async (req, res, _next) => {
    const data = await hrmsService.getLeaveCalendar(req.companyId, req.query);
    apiResponse_1.default.success(res, data);
});
// ─── HOLIDAYS ─────────────────────────────────────────────────────────────────────
exports.listHolidays = (0, catchAsync_1.default)(async (req, res, _next) => {
    const data = await hrmsService.listHolidays(req.companyId, req.query);
    apiResponse_1.default.success(res, data);
});
exports.createHoliday = (0, catchAsync_1.default)(async (req, res, _next) => {
    const holiday = await hrmsService.createHoliday(req.companyId, req.body);
    apiResponse_1.default.created(res, holiday);
});
exports.updateHoliday = (0, catchAsync_1.default)(async (req, res, _next) => {
    const holiday = await hrmsService.updateHoliday(req.companyId, req.params.id, req.body);
    apiResponse_1.default.success(res, holiday);
});
exports.removeHoliday = (0, catchAsync_1.default)(async (req, res, _next) => {
    const holiday = await hrmsService.removeHoliday(req.companyId, req.params.id);
    apiResponse_1.default.success(res, holiday);
});
// ─── PAYROLL ──────────────────────────────────────────────────────────────────────
exports.listPayroll = (0, catchAsync_1.default)(async (req, res, _next) => {
    const { payrolls, meta } = await hrmsService.listPayroll(req.companyId, req.query);
    apiResponse_1.default.paginated(res, payrolls, meta);
});
exports.runPayroll = (0, catchAsync_1.default)(async (req, res, _next) => {
    const payroll = await hrmsService.runPayroll(req.companyId, req.body, req.user._id.toString());
    apiResponse_1.default.created(res, payroll);
});
exports.getPayrollById = (0, catchAsync_1.default)(async (req, res, _next) => {
    const payroll = await hrmsService.getPayrollById(req.companyId, req.params.runId);
    apiResponse_1.default.success(res, payroll);
});
exports.getPayslip = (0, catchAsync_1.default)(async (req, res, _next) => {
    const payslip = await hrmsService.getPayslip(req.companyId, req.params.id);
    apiResponse_1.default.success(res, payslip);
});
exports.exportPayslips = (0, catchAsync_1.default)(async (req, res, _next) => {
    const payslips = await hrmsService.exportPayslips(req.companyId, req.query);
    apiResponse_1.default.success(res, payslips);
});
// ─── SALARY STRUCTURE ─────────────────────────────────────────────────────────────
exports.getSalaryStructure = (0, catchAsync_1.default)(async (req, res, _next) => {
    const ss = await hrmsService.getSalaryStructure(req.companyId, req.params.employeeId);
    apiResponse_1.default.success(res, ss);
});
exports.createSalaryStructure = (0, catchAsync_1.default)(async (req, res, _next) => {
    const ss = await hrmsService.createSalaryStructure(req.companyId, req.body);
    apiResponse_1.default.created(res, ss);
});
exports.updateSalaryStructure = (0, catchAsync_1.default)(async (req, res, _next) => {
    const ss = await hrmsService.updateSalaryStructure(req.companyId, req.params.employeeId, req.body);
    apiResponse_1.default.success(res, ss);
});
// ─── ASSETS ───────────────────────────────────────────────────────────────────────
exports.listAssets = (0, catchAsync_1.default)(async (req, res, _next) => {
    const { assets, meta } = await hrmsService.listAssets(req.companyId, req.query);
    apiResponse_1.default.paginated(res, assets, meta);
});
exports.createAsset = (0, catchAsync_1.default)(async (req, res, _next) => {
    const asset = await hrmsService.createAsset(req.companyId, req.body);
    apiResponse_1.default.created(res, asset);
});
exports.updateAsset = (0, catchAsync_1.default)(async (req, res, _next) => {
    const asset = await hrmsService.updateAsset(req.companyId, req.params.id, req.body);
    apiResponse_1.default.success(res, asset);
});
exports.removeAsset = (0, catchAsync_1.default)(async (req, res, _next) => {
    const asset = await hrmsService.removeAsset(req.companyId, req.params.id);
    apiResponse_1.default.success(res, asset);
});
exports.assignAsset = (0, catchAsync_1.default)(async (req, res, _next) => {
    const result = await hrmsService.assignAsset(req.companyId, req.params.id, req.body);
    apiResponse_1.default.success(res, result);
});
exports.returnAsset = (0, catchAsync_1.default)(async (req, res, _next) => {
    const asset = await hrmsService.returnAsset(req.companyId, req.params.id, req.body);
    apiResponse_1.default.success(res, asset);
});
// ─── REPORTS ──────────────────────────────────────────────────────────────────────
exports.getAttendanceReport = (0, catchAsync_1.default)(async (req, res, _next) => {
    const data = await hrmsService.getAttendanceReport(req.companyId, req.query);
    apiResponse_1.default.success(res, data);
});
exports.getLeaveReport = (0, catchAsync_1.default)(async (req, res, _next) => {
    const data = await hrmsService.getLeaveReport(req.companyId, req.query);
    apiResponse_1.default.success(res, data);
});
exports.getPayrollReport = (0, catchAsync_1.default)(async (req, res, _next) => {
    const data = await hrmsService.getPayrollReport(req.companyId, req.query);
    apiResponse_1.default.success(res, data);
});
exports.getHeadcountReport = (0, catchAsync_1.default)(async (req, res, _next) => {
    const data = await hrmsService.getHeadcountReport(req.companyId, req.query);
    apiResponse_1.default.success(res, data);
});
exports.getAttritionReport = (0, catchAsync_1.default)(async (req, res, _next) => {
    const data = await hrmsService.getAttritionReport(req.companyId, req.query);
    apiResponse_1.default.success(res, data);
});
// ─── EMPLOYEE FULL UPDATE (PUT) ──────────────────────────────────────────────
exports.fullUpdateEmployee = (0, catchAsync_1.default)(async (req, res, _next) => {
    const employee = await hrmsService.fullUpdateEmployee(req.companyId, req.params.id, req.body);
    apiResponse_1.default.success(res, employee);
});
// ─── EMPLOYEE PROFILE ────────────────────────────────────────────────────────
exports.getEmployeeProfile = (0, catchAsync_1.default)(async (req, res, _next) => {
    const profile = await hrmsService.getEmployeeProfile(req.companyId, req.params.id);
    apiResponse_1.default.success(res, profile);
});
exports.updateEmployeeProfile = (0, catchAsync_1.default)(async (req, res, _next) => {
    const profile = await hrmsService.updateEmployeeProfile(req.companyId, req.params.id, req.body);
    apiResponse_1.default.success(res, profile);
});
// ─── EMPLOYEE STATUS ─────────────────────────────────────────────────────────
exports.updateEmployeeStatus = (0, catchAsync_1.default)(async (req, res, _next) => {
    const employee = await hrmsService.updateEmployeeStatus(req.companyId, req.params.id, req.body);
    apiResponse_1.default.success(res, employee);
});
// ─── EMPLOYEE HISTORY ────────────────────────────────────────────────────────
exports.getEmployeeHistory = (0, catchAsync_1.default)(async (req, res, _next) => {
    const history = await hrmsService.getEmployeeHistory(req.companyId, req.params.id);
    apiResponse_1.default.success(res, history);
});
// ─── ATTENDANCE CHECKIN/CHECKOUT ─────────────────────────────────────────────
exports.checkin = (0, catchAsync_1.default)(async (req, res, _next) => {
    const record = await hrmsService.checkin(req.companyId, req.body);
    apiResponse_1.default.success(res, record);
});
exports.checkout = (0, catchAsync_1.default)(async (req, res, _next) => {
    const record = await hrmsService.checkout(req.companyId, req.body);
    apiResponse_1.default.success(res, record);
});
// ─── ATTENDANCE REGULARIZE ───────────────────────────────────────────────────
exports.createRegularization = (0, catchAsync_1.default)(async (req, res, _next) => {
    const result = await hrmsService.createRegularization(req.companyId, req.body);
    apiResponse_1.default.created(res, result);
});
exports.approveRejectRegularization = (0, catchAsync_1.default)(async (req, res, _next) => {
    const result = await hrmsService.approveRejectRegularization(req.companyId, req.params.id, req.body);
    apiResponse_1.default.success(res, result);
});
exports.listRegularizations = (0, catchAsync_1.default)(async (req, res, _next) => {
    const result = await hrmsService.listRegularizations(req.companyId, req.query);
    apiResponse_1.default.success(res, result);
});
// ─── PAYROLL — EMPLOYEE PAYSLIPS ─────────────────────────────────────────────
exports.getEmployeePayslips = (0, catchAsync_1.default)(async (req, res, _next) => {
    const payslips = await hrmsService.getEmployeePayslips(req.companyId, req.params.employeeId);
    apiResponse_1.default.success(res, payslips);
});
exports.getPayslipByMonthYear = (0, catchAsync_1.default)(async (req, res, _next) => {
    const result = await hrmsService.getPayslipByMonthYear(req.companyId, req.params.month, req.params.year);
    apiResponse_1.default.success(res, result);
});
exports.getEmployeeTaxDetails = (0, catchAsync_1.default)(async (req, res, _next) => {
    const tax = await hrmsService.getEmployeeTaxDetails(req.companyId, req.params.employeeId);
    apiResponse_1.default.success(res, tax);
});
exports.getEmployeeDeductions = (0, catchAsync_1.default)(async (req, res, _next) => {
    const deductions = await hrmsService.getEmployeeDeductions(req.companyId, req.params.employeeId);
    apiResponse_1.default.success(res, deductions);
});
// ─── DOCUMENTS — REQUEST LETTER ──────────────────────────────────────────────
exports.requestLetter = (0, catchAsync_1.default)(async (req, res, _next) => {
    let employeeId = req.body.employeeId;
    if (!employeeId) {
        const emp = await Employee_1.default.findOne({ userId: req.user._id, companyId: req.companyId }).select('_id');
        if (!emp)
            throw new appError_1.default(404, 'NOT_FOUND', 'Employee profile not found for this user');
        employeeId = emp._id.toString();
    }
    const result = await hrmsService.requestLetter(req.companyId, employeeId, req.body);
    apiResponse_1.default.created(res, result);
});
// ─── PERFORMANCE GOALS ───────────────────────────────────────────────────────
exports.listPerformanceGoals = (0, catchAsync_1.default)(async (req, res, _next) => {
    const { goals, meta } = await hrmsService.listPerformanceGoals(req.companyId, req.params.employeeId, req.query);
    apiResponse_1.default.paginated(res, goals, meta);
});
exports.createPerformanceGoal = (0, catchAsync_1.default)(async (req, res, _next) => {
    const goal = await hrmsService.createPerformanceGoal(req.companyId, req.body, req.user._id.toString());
    apiResponse_1.default.created(res, goal);
});
exports.updatePerformanceGoal = (0, catchAsync_1.default)(async (req, res, _next) => {
    const goal = await hrmsService.updatePerformanceGoal(req.companyId, req.params.id, req.body);
    apiResponse_1.default.success(res, goal);
});
// ─── PERFORMANCE APPRAISAL ───────────────────────────────────────────────────
exports.submitAppraisal = (0, catchAsync_1.default)(async (req, res, _next) => {
    const appraisal = await hrmsService.submitAppraisal(req.companyId, req.body, req.user._id.toString());
    apiResponse_1.default.created(res, appraisal);
});
exports.getAppraisalHistory = (0, catchAsync_1.default)(async (req, res, _next) => {
    const history = await hrmsService.getAppraisalHistory(req.companyId, req.params.employeeId);
    apiResponse_1.default.success(res, history);
});
// ─── PERFORMANCE FEEDBACK ────────────────────────────────────────────────────
exports.submitFeedback = (0, catchAsync_1.default)(async (req, res, _next) => {
    const feedback = await hrmsService.submitFeedback(req.companyId, req.body, req.user._id.toString());
    apiResponse_1.default.created(res, feedback);
});
// ─── TRAINING COURSES ────────────────────────────────────────────────────────
exports.listTrainingCourses = (0, catchAsync_1.default)(async (req, res, _next) => {
    const { courses, meta } = await hrmsService.listTrainingCourses(req.companyId, req.query);
    apiResponse_1.default.paginated(res, courses, meta);
});
// ─── TRAINING ENROLLMENT ─────────────────────────────────────────────────────
exports.enrollCourse = (0, catchAsync_1.default)(async (req, res, _next) => {
    const enrollment = await hrmsService.enrollCourse(req.companyId, req.body);
    apiResponse_1.default.created(res, enrollment);
});
exports.completeCourse = (0, catchAsync_1.default)(async (req, res, _next) => {
    const enrollment = await hrmsService.completeCourse(req.companyId, req.params.enrollmentId, req.body);
    apiResponse_1.default.success(res, enrollment);
});
// ─── TRAINING HISTORY & CERTIFICATIONS ───────────────────────────────────────
exports.getTrainingHistory = (0, catchAsync_1.default)(async (req, res, _next) => {
    const history = await hrmsService.getTrainingHistory(req.companyId, req.params.employeeId);
    apiResponse_1.default.success(res, history);
});
exports.getTrainingCertifications = (0, catchAsync_1.default)(async (req, res, _next) => {
    const certs = await hrmsService.getTrainingCertifications(req.companyId, req.params.employeeId);
    apiResponse_1.default.success(res, certs);
});
// ─── TRANSFER REQUESTS ───────────────────────────────────────────────────────
exports.createTransferRequest = (0, catchAsync_1.default)(async (req, res, _next) => {
    const transfer = await hrmsService.createTransferRequest(req.companyId, req.body, req.user._id.toString());
    apiResponse_1.default.created(res, transfer);
});
exports.approveRejectTransfer = (0, catchAsync_1.default)(async (req, res, _next) => {
    const transfer = await hrmsService.approveRejectTransfer(req.companyId, req.params.id, req.body, req.user._id.toString());
    apiResponse_1.default.success(res, transfer);
});
// ─── PROMOTIONS ──────────────────────────────────────────────────────────────
exports.createPromotion = (0, catchAsync_1.default)(async (req, res, _next) => {
    const promotion = await hrmsService.createPromotion(req.companyId, req.body, req.user._id.toString());
    apiResponse_1.default.created(res, promotion);
});
// ─── EXIT RESIGNATION ────────────────────────────────────────────────────────
exports.submitResignation = (0, catchAsync_1.default)(async (req, res, _next) => {
    let employeeId = req.body.employeeId;
    if (!employeeId) {
        const emp = await Employee_1.default.findOne({ userId: req.user._id, companyId: req.companyId }).select('_id');
        if (!emp)
            throw new appError_1.default(404, 'NOT_FOUND', 'Employee profile not found for this user');
        employeeId = emp._id.toString();
    }
    const resignation = await hrmsService.submitResignation(req.companyId, employeeId, req.body);
    apiResponse_1.default.created(res, resignation);
});
// ─── EXIT CHECKLIST ──────────────────────────────────────────────────────────
exports.getExitChecklist = (0, catchAsync_1.default)(async (req, res, _next) => {
    const checklist = await hrmsService.getExitChecklist(req.companyId, req.params.employeeId);
    apiResponse_1.default.success(res, checklist);
});
// ─── EXIT CLEARANCE ──────────────────────────────────────────────────────────
exports.updateClearance = (0, catchAsync_1.default)(async (req, res, _next) => {
    const clearance = await hrmsService.updateClearance(req.companyId, req.params.employeeId, req.params.departmentId, req.body, req.user._id.toString());
    apiResponse_1.default.success(res, clearance);
});
// ─── EXIT FNF ────────────────────────────────────────────────────────────────
exports.getFnF = (0, catchAsync_1.default)(async (req, res, _next) => {
    const settlement = await hrmsService.getFnF(req.companyId, req.params.employeeId);
    apiResponse_1.default.success(res, settlement);
});
// ─── EMPLOYEE ATTENDANCE ─────────────────────────────────────────────────────
exports.getEmployeeAttendance = (0, catchAsync_1.default)(async (req, res, _next) => {
    const { records, summary, meta } = await hrmsService.getEmployeeAttendance(req.companyId, req.params.id, req.query);
    apiResponse_1.default.success(res, { records, summary, meta });
});
// ─── EMPLOYEE LEAVES ─────────────────────────────────────────────────────────
exports.getEmployeeLeaves = (0, catchAsync_1.default)(async (req, res, _next) => {
    const { requests, leaveBalance, meta } = await hrmsService.getEmployeeLeaves(req.companyId, req.params.id, req.query);
    apiResponse_1.default.success(res, { requests, leaveBalance, meta });
});
// ─── EMPLOYEE PAYROLL ────────────────────────────────────────────────────────
exports.getEmployeePayroll = (0, catchAsync_1.default)(async (req, res, _next) => {
    const { records, meta } = await hrmsService.getEmployeePayroll(req.companyId, req.params.id, req.query);
    apiResponse_1.default.success(res, { records, meta });
});
// ─── INITIATE LEAVE ON BEHALF ────────────────────────────────────────────────
exports.initiateLeaveOnBehalf = (0, catchAsync_1.default)(async (req, res, _next) => {
    const result = await hrmsService.initiateLeaveOnBehalf(req.companyId, req.params.id, req.user._id.toString(), req.body);
    apiResponse_1.default.success(res, result);
});
// ─── TERMINATE EMPLOYEE ──────────────────────────────────────────────────────
exports.terminateEmployee = (0, catchAsync_1.default)(async (req, res, _next) => {
    const employee = await hrmsService.terminateEmployee(req.companyId, req.params.id, req.user._id.toString(), req.body);
    apiResponse_1.default.success(res, employee);
});
// ─── ASSIGN EMPLOYEE ROLE ────────────────────────────────────────────────────
exports.assignEmployeeRole = (0, catchAsync_1.default)(async (req, res, _next) => {
    const employee = await hrmsService.assignEmployeeRole(req.companyId, req.params.id, req.user._id.toString(), req.body);
    apiResponse_1.default.success(res, employee);
});
// ─── RESET EMPLOYEE PASSWORD ─────────────────────────────────────────────────
exports.resetEmployeePassword = (0, catchAsync_1.default)(async (req, res, _next) => {
    const result = await hrmsService.resetEmployeePassword(req.companyId, req.params.id, req.user._id.toString(), req.body);
    apiResponse_1.default.success(res, result);
});
// ─── EMPLOYEE DOCUMENTS ──────────────────────────────────────────────────────
exports.createEmployeeDocument = (0, catchAsync_1.default)(async (req, res, _next) => {
    const document = await hrmsService.createEmployeeDocument(req.companyId, req.params.id, req.user._id.toString(), req.body);
    apiResponse_1.default.created(res, document);
});
exports.listEmployeeDocuments = (0, catchAsync_1.default)(async (req, res, _next) => {
    const { records, meta } = await hrmsService.listEmployeeDocuments(req.companyId, req.params.id, req.query);
    apiResponse_1.default.paginated(res, records, meta);
});
// ─── EMPLOYEE NOTES ──────────────────────────────────────────────────────────
exports.createEmployeeNote = (0, catchAsync_1.default)(async (req, res, _next) => {
    const note = await hrmsService.createEmployeeNote(req.companyId, req.params.id, req.user._id.toString(), req.body);
    apiResponse_1.default.created(res, note);
});
exports.listEmployeeNotes = (0, catchAsync_1.default)(async (req, res, _next) => {
    const { records, meta } = await hrmsService.listEmployeeNotes(req.companyId, req.params.id, req.query);
    apiResponse_1.default.paginated(res, records, meta);
});
exports.updateEmployeeNote = (0, catchAsync_1.default)(async (req, res, _next) => {
    const note = await hrmsService.updateEmployeeNote(req.companyId, req.params.id, req.params.noteId, req.user._id.toString(), req.body);
    apiResponse_1.default.success(res, note);
});
exports.deleteEmployeeNote = (0, catchAsync_1.default)(async (req, res, _next) => {
    const result = await hrmsService.deleteEmployeeNote(req.companyId, req.params.id, req.params.noteId, req.user._id.toString());
    apiResponse_1.default.success(res, result);
});
exports.downloadEmployeeDocument = (0, catchAsync_1.default)(async (req, res, _next) => {
    const document = await hrmsService.getEmployeeDocument(req.companyId, req.params.id, req.params.documentId);
    if (!document.fileUrl) {
        throw new appError_1.default(400, 'BAD_REQUEST', 'Document does not have an uploaded file');
    }
    if (document.fileUrl.startsWith('http://') || document.fileUrl.startsWith('https://')) {
        return res.redirect(document.fileUrl);
    }
    let relativePath = document.fileUrl;
    if (relativePath.startsWith('/uploads/')) {
        relativePath = relativePath.substring(9);
    }
    else if (relativePath.startsWith('uploads/')) {
        relativePath = relativePath.substring(8);
    }
    else if (relativePath.startsWith('/')) {
        relativePath = relativePath.substring(1);
    }
    const absolutePath = path_1.default.resolve(env_1.default.upload.dir, relativePath);
    if (!fs_1.default.existsSync(absolutePath)) {
        throw new appError_1.default(404, 'NOT_FOUND', 'File not found on server');
    }
    const ext = path_1.default.extname(absolutePath);
    let cleanName = document.documentName;
    if (!cleanName.endsWith(ext)) {
        cleanName = `${cleanName}${ext}`;
    }
    res.download(absolutePath, cleanName);
});
//# sourceMappingURL=hrms.controller.js.map