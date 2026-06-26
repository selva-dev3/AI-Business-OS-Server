const hrmsService = require('../services/hrms.service');
const ApiResponse = require('../utils/apiResponse');

// ─── DASHBOARD ────────────────────────────────────────────────────────────────────

const getDashboard = async (req, res, next) => {
  try {
    const data = await hrmsService.getDashboard(req.companyId, req.query.from, req.query.to);
    return ApiResponse.success(res, data);
  } catch (err) { next(err); }
};

// ─── EMPLOYEES ────────────────────────────────────────────────────────────────────

const listEmployees = async (req, res, next) => {
  try {
    const { employees, meta } = await hrmsService.listEmployees(req.companyId, req.query);
    return ApiResponse.paginated(res, employees, meta);
  } catch (err) { next(err); }
};

const createEmployee = async (req, res, next) => {
  try {
    const employee = await hrmsService.createEmployee(req.companyId, req.body);
    return ApiResponse.created(res, employee);
  } catch (err) { next(err); }
};

const getEmployeeById = async (req, res, next) => {
  try {
    const employee = await hrmsService.getEmployeeById(req.companyId, req.params.id);
    return ApiResponse.success(res, employee);
  } catch (err) { next(err); }
};

const updateEmployee = async (req, res, next) => {
  try {
    const employee = await hrmsService.updateEmployee(req.companyId, req.params.id, req.body);
    return ApiResponse.success(res, employee);
  } catch (err) { next(err); }
};

const removeEmployee = async (req, res, next) => {
  try {
    const employee = await hrmsService.removeEmployee(req.companyId, req.params.id);
    return ApiResponse.success(res, employee);
  } catch (err) { next(err); }
};

const activateEmployee = async (req, res, next) => {
  try {
    const employee = await hrmsService.activateEmployee(req.companyId, req.params.id);
    return ApiResponse.success(res, employee);
  } catch (err) { next(err); }
};

const bulkImportEmployees = async (req, res, next) => {
  try {
    const result = await hrmsService.bulkImportEmployees(req.companyId, req.body.employees || []);
    return ApiResponse.success(res, result);
  } catch (err) { next(err); }
};

const exportEmployees = async (req, res, next) => {
  try {
    const employees = await hrmsService.exportEmployees(req.companyId, req.query);
    return ApiResponse.success(res, employees);
  } catch (err) { next(err); }
};

// ─── DEPARTMENTS ──────────────────────────────────────────────────────────────────

const listDepartments = async (req, res, next) => {
  try {
    const data = await hrmsService.listDepartments(req.companyId);
    return ApiResponse.success(res, data);
  } catch (err) { next(err); }
};

const createDepartment = async (req, res, next) => {
  try {
    const department = await hrmsService.createDepartment(req.companyId, req.body);
    return ApiResponse.created(res, department);
  } catch (err) { next(err); }
};

const updateDepartment = async (req, res, next) => {
  try {
    const department = await hrmsService.updateDepartment(req.companyId, req.params.id, req.body);
    return ApiResponse.success(res, department);
  } catch (err) { next(err); }
};

const removeDepartment = async (req, res, next) => {
  try {
    const department = await hrmsService.removeDepartment(req.companyId, req.params.id);
    return ApiResponse.success(res, department);
  } catch (err) { next(err); }
};

const listDepartmentEmployees = async (req, res, next) => {
  try {
    const { employees, meta } = await hrmsService.listDepartmentEmployees(req.companyId, req.params.id, req.query);
    return ApiResponse.paginated(res, employees, meta);
  } catch (err) { next(err); }
};

// ─── DESIGNATIONS ─────────────────────────────────────────────────────────────────

const listDesignations = async (req, res, next) => {
  try {
    const data = await hrmsService.listDesignations(req.companyId);
    return ApiResponse.success(res, data);
  } catch (err) { next(err); }
};

const createDesignation = async (req, res, next) => {
  try {
    const designation = await hrmsService.createDesignation(req.companyId, req.body);
    return ApiResponse.created(res, designation);
  } catch (err) { next(err); }
};

const updateDesignation = async (req, res, next) => {
  try {
    const designation = await hrmsService.updateDesignation(req.companyId, req.params.id, req.body);
    return ApiResponse.success(res, designation);
  } catch (err) { next(err); }
};

const removeDesignation = async (req, res, next) => {
  try {
    const designation = await hrmsService.removeDesignation(req.companyId, req.params.id);
    return ApiResponse.success(res, designation);
  } catch (err) { next(err); }
};

// ─── ATTENDANCE ───────────────────────────────────────────────────────────────────

const listAttendance = async (req, res, next) => {
  try {
    const { records, meta } = await hrmsService.listAttendance(req.companyId, req.query);
    return ApiResponse.paginated(res, records, meta);
  } catch (err) { next(err); }
};

const createAttendance = async (req, res, next) => {
  try {
    const record = await hrmsService.createAttendance(req.companyId, req.body);
    return ApiResponse.created(res, record);
  } catch (err) { next(err); }
};

const updateAttendance = async (req, res, next) => {
  try {
    const record = await hrmsService.updateAttendance(req.companyId, req.params.id, req.body);
    return ApiResponse.success(res, record);
  } catch (err) { next(err); }
};

const getAttendanceSummary = async (req, res, next) => {
  try {
    const summary = await hrmsService.getAttendanceSummary(req.companyId, req.query);
    return ApiResponse.success(res, summary);
  } catch (err) { next(err); }
};

const bulkCreateAttendance = async (req, res, next) => {
  try {
    const result = await hrmsService.bulkCreateAttendance(req.companyId, req.body);
    return ApiResponse.success(res, result);
  } catch (err) { next(err); }
};

const exportAttendance = async (req, res, next) => {
  try {
    const records = await hrmsService.exportAttendance(req.companyId, req.query);
    return ApiResponse.success(res, records);
  } catch (err) { next(err); }
};

// ─── LEAVE TYPES ──────────────────────────────────────────────────────────────────

const listLeaveTypes = async (req, res, next) => {
  try {
    const data = await hrmsService.listLeaveTypes(req.companyId);
    return ApiResponse.success(res, data);
  } catch (err) { next(err); }
};

const createLeaveType = async (req, res, next) => {
  try {
    const leaveType = await hrmsService.createLeaveType(req.companyId, req.body);
    return ApiResponse.created(res, leaveType);
  } catch (err) { next(err); }
};

const updateLeaveType = async (req, res, next) => {
  try {
    const leaveType = await hrmsService.updateLeaveType(req.companyId, req.params.id, req.body);
    return ApiResponse.success(res, leaveType);
  } catch (err) { next(err); }
};

const removeLeaveType = async (req, res, next) => {
  try {
    const leaveType = await hrmsService.removeLeaveType(req.companyId, req.params.id);
    return ApiResponse.success(res, leaveType);
  } catch (err) { next(err); }
};

// ─── LEAVE REQUESTS ───────────────────────────────────────────────────────────────

const listLeaveRequests = async (req, res, next) => {
  try {
    const { requests, meta } = await hrmsService.listLeaveRequests(req.companyId, req.query);
    return ApiResponse.paginated(res, requests, meta);
  } catch (err) { next(err); }
};

const createLeaveRequest = async (req, res, next) => {
  try {
    const request = await hrmsService.createLeaveRequest(req.companyId, req.body, req.user._id);
    return ApiResponse.created(res, request);
  } catch (err) { next(err); }
};

const getLeaveRequestById = async (req, res, next) => {
  try {
    const request = await hrmsService.getLeaveRequestById(req.companyId, req.params.id);
    return ApiResponse.success(res, request);
  } catch (err) { next(err); }
};

const approveLeaveRequest = async (req, res, next) => {
  try {
    const request = await hrmsService.approveLeaveRequest(req.companyId, req.params.id, req.user._id, req.body);
    return ApiResponse.success(res, request);
  } catch (err) { next(err); }
};

const rejectLeaveRequest = async (req, res, next) => {
  try {
    const request = await hrmsService.rejectLeaveRequest(req.companyId, req.params.id, req.user._id, req.body);
    return ApiResponse.success(res, request);
  } catch (err) { next(err); }
};

const removeLeaveRequest = async (req, res, next) => {
  try {
    const request = await hrmsService.removeLeaveRequest(req.companyId, req.params.id);
    return ApiResponse.success(res, request);
  } catch (err) { next(err); }
};

const getLeaveBalance = async (req, res, next) => {
  try {
    const data = await hrmsService.getLeaveBalance(req.companyId, req.query);
    return ApiResponse.success(res, data);
  } catch (err) { next(err); }
};

const getLeaveCalendar = async (req, res, next) => {
  try {
    const data = await hrmsService.getLeaveCalendar(req.companyId, req.query);
    return ApiResponse.success(res, data);
  } catch (err) { next(err); }
};

// ─── HOLIDAYS ─────────────────────────────────────────────────────────────────────

const listHolidays = async (req, res, next) => {
  try {
    const data = await hrmsService.listHolidays(req.companyId, req.query);
    return ApiResponse.success(res, data);
  } catch (err) { next(err); }
};

const createHoliday = async (req, res, next) => {
  try {
    const holiday = await hrmsService.createHoliday(req.companyId, req.body);
    return ApiResponse.created(res, holiday);
  } catch (err) { next(err); }
};

const updateHoliday = async (req, res, next) => {
  try {
    const holiday = await hrmsService.updateHoliday(req.companyId, req.params.id, req.body);
    return ApiResponse.success(res, holiday);
  } catch (err) { next(err); }
};

const removeHoliday = async (req, res, next) => {
  try {
    const holiday = await hrmsService.removeHoliday(req.companyId, req.params.id);
    return ApiResponse.success(res, holiday);
  } catch (err) { next(err); }
};

// ─── PAYROLL ──────────────────────────────────────────────────────────────────────

const listPayroll = async (req, res, next) => {
  try {
    const { payrolls, meta } = await hrmsService.listPayroll(req.companyId, req.query);
    return ApiResponse.paginated(res, payrolls, meta);
  } catch (err) { next(err); }
};

const runPayroll = async (req, res, next) => {
  try {
    const payroll = await hrmsService.runPayroll(req.companyId, req.body, req.user._id);
    return ApiResponse.created(res, payroll);
  } catch (err) { next(err); }
};

const getPayrollById = async (req, res, next) => {
  try {
    const payroll = await hrmsService.getPayrollById(req.companyId, req.params.runId);
    return ApiResponse.success(res, payroll);
  } catch (err) { next(err); }
};

const getPayslip = async (req, res, next) => {
  try {
    const payslip = await hrmsService.getPayslip(req.companyId, req.params.id);
    return ApiResponse.success(res, payslip);
  } catch (err) { next(err); }
};

const exportPayslips = async (req, res, next) => {
  try {
    const payslips = await hrmsService.exportPayslips(req.companyId, req.query);
    return ApiResponse.success(res, payslips);
  } catch (err) { next(err); }
};

// ─── SALARY STRUCTURE ─────────────────────────────────────────────────────────────

const getSalaryStructure = async (req, res, next) => {
  try {
    const ss = await hrmsService.getSalaryStructure(req.companyId, req.params.employeeId);
    return ApiResponse.success(res, ss);
  } catch (err) { next(err); }
};

const createSalaryStructure = async (req, res, next) => {
  try {
    const ss = await hrmsService.createSalaryStructure(req.companyId, req.body);
    return ApiResponse.created(res, ss);
  } catch (err) { next(err); }
};

const updateSalaryStructure = async (req, res, next) => {
  try {
    const ss = await hrmsService.updateSalaryStructure(req.companyId, req.params.employeeId, req.body);
    return ApiResponse.success(res, ss);
  } catch (err) { next(err); }
};

// ─── ASSETS ───────────────────────────────────────────────────────────────────────

const listAssets = async (req, res, next) => {
  try {
    const { assets, meta } = await hrmsService.listAssets(req.companyId, req.query);
    return ApiResponse.paginated(res, assets, meta);
  } catch (err) { next(err); }
};

const createAsset = async (req, res, next) => {
  try {
    const asset = await hrmsService.createAsset(req.companyId, req.body);
    return ApiResponse.created(res, asset);
  } catch (err) { next(err); }
};

const updateAsset = async (req, res, next) => {
  try {
    const asset = await hrmsService.updateAsset(req.companyId, req.params.id, req.body);
    return ApiResponse.success(res, asset);
  } catch (err) { next(err); }
};

const removeAsset = async (req, res, next) => {
  try {
    const asset = await hrmsService.removeAsset(req.companyId, req.params.id);
    return ApiResponse.success(res, asset);
  } catch (err) { next(err); }
};

const assignAsset = async (req, res, next) => {
  try {
    const result = await hrmsService.assignAsset(req.companyId, req.params.id, req.body);
    return ApiResponse.success(res, result);
  } catch (err) { next(err); }
};

const returnAsset = async (req, res, next) => {
  try {
    const asset = await hrmsService.returnAsset(req.companyId, req.params.id, req.body);
    return ApiResponse.success(res, asset);
  } catch (err) { next(err); }
};

// ─── REPORTS ──────────────────────────────────────────────────────────────────────

const getAttendanceReport = async (req, res, next) => {
  try {
    const data = await hrmsService.getAttendanceReport(req.companyId, req.query);
    return ApiResponse.success(res, data);
  } catch (err) { next(err); }
};

const getLeaveReport = async (req, res, next) => {
  try {
    const data = await hrmsService.getLeaveReport(req.companyId, req.query);
    return ApiResponse.success(res, data);
  } catch (err) { next(err); }
};

const getPayrollReport = async (req, res, next) => {
  try {
    const data = await hrmsService.getPayrollReport(req.companyId, req.query);
    return ApiResponse.success(res, data);
  } catch (err) { next(err); }
};

const getHeadcountReport = async (req, res, next) => {
  try {
    const data = await hrmsService.getHeadcountReport(req.companyId, req.query);
    return ApiResponse.success(res, data);
  } catch (err) { next(err); }
};

const getAttritionReport = async (req, res, next) => {
  try {
    const data = await hrmsService.getAttritionReport(req.companyId, req.query);
    return ApiResponse.success(res, data);
  } catch (err) { next(err); }
};

module.exports = {
  getDashboard,
  listEmployees,
  createEmployee,
  getEmployeeById,
  updateEmployee,
  removeEmployee,
  activateEmployee,
  bulkImportEmployees,
  exportEmployees,
  listDepartments,
  createDepartment,
  updateDepartment,
  removeDepartment,
  listDepartmentEmployees,
  listDesignations,
  createDesignation,
  updateDesignation,
  removeDesignation,
  listAttendance,
  createAttendance,
  updateAttendance,
  getAttendanceSummary,
  bulkCreateAttendance,
  exportAttendance,
  listLeaveTypes,
  createLeaveType,
  updateLeaveType,
  removeLeaveType,
  listLeaveRequests,
  createLeaveRequest,
  getLeaveRequestById,
  approveLeaveRequest,
  rejectLeaveRequest,
  removeLeaveRequest,
  getLeaveBalance,
  getLeaveCalendar,
  listHolidays,
  createHoliday,
  updateHoliday,
  removeHoliday,
  listPayroll,
  runPayroll,
  getPayrollById,
  getPayslip,
  exportPayslips,
  getSalaryStructure,
  createSalaryStructure,
  updateSalaryStructure,
  listAssets,
  createAsset,
  updateAsset,
  removeAsset,
  assignAsset,
  returnAsset,
  getAttendanceReport,
  getLeaveReport,
  getPayrollReport,
  getHeadcountReport,
  getAttritionReport,
};
