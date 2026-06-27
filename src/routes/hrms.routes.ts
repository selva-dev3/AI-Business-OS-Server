import express from 'express';
const router = express.Router();
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import auditLog from '../middleware/auditLogger';
import * as hrmsController from '../controllers/hrms.controller';
import {
  createEmployeeSchema,
  updateEmployeeSchema,
  createDepartmentSchema,
  updateDepartmentSchema,
  createDesignationSchema,
  updateDesignationSchema,
  createAttendanceSchema,
  updateAttendanceSchema,
  bulkAttendanceSchema,
  createLeaveTypeSchema,
  updateLeaveTypeSchema,
  createLeaveRequestSchema,
  approveRejectLeaveSchema,
  createHolidaySchema,
  updateHolidaySchema,
  createAssetSchema,
  updateAssetSchema,
  assignAssetSchema,
  returnAssetSchema,
  runPayrollSchema,
  createSalaryStructureSchema,
  updateSalaryStructureSchema,
} from '../validators/hrms.validator';

router.use(authenticate);

// Dashboard
router.get('/dashboard', hrmsController.getDashboard);

// Employees
router.get('/employees', hrmsController.listEmployees);
router.post('/employees', validate(createEmployeeSchema), auditLog('hrms', 'CREATE', 'employee'), hrmsController.createEmployee);
router.get('/employees/export', hrmsController.exportEmployees);
router.post('/employees/bulk-import', hrmsController.bulkImportEmployees);
router.get('/employees/:id', hrmsController.getEmployeeById);
router.patch('/employees/:id', validate(updateEmployeeSchema), auditLog('hrms', 'UPDATE', 'employee'), hrmsController.updateEmployee);
router.delete('/employees/:id', auditLog('hrms', 'DELETE', 'employee'), hrmsController.removeEmployee);
router.patch('/employees/:id/activate', hrmsController.activateEmployee);

// Departments
router.get('/departments', hrmsController.listDepartments);
router.post('/departments', validate(createDepartmentSchema), auditLog('hrms', 'CREATE', 'department'), hrmsController.createDepartment);
router.patch('/departments/:id', validate(updateDepartmentSchema), hrmsController.updateDepartment);
router.delete('/departments/:id', auditLog('hrms', 'DELETE', 'department'), hrmsController.removeDepartment);
router.get('/departments/:id/employees', hrmsController.listDepartmentEmployees);

// Designations
router.get('/designations', hrmsController.listDesignations);
router.post('/designations', validate(createDesignationSchema), auditLog('hrms', 'CREATE', 'designation'), hrmsController.createDesignation);
router.patch('/designations/:id', validate(updateDesignationSchema), hrmsController.updateDesignation);
router.delete('/designations/:id', auditLog('hrms', 'DELETE', 'designation'), hrmsController.removeDesignation);

// Attendance
router.get('/attendance', hrmsController.listAttendance);
router.post('/attendance', validate(createAttendanceSchema), auditLog('hrms', 'CREATE', 'attendance'), hrmsController.createAttendance);
router.patch('/attendance/:id', validate(updateAttendanceSchema), hrmsController.updateAttendance);
router.post('/attendance/bulk', validate(bulkAttendanceSchema), hrmsController.bulkCreateAttendance);
router.get('/attendance/summary', hrmsController.getAttendanceSummary);
router.get('/attendance/export', hrmsController.exportAttendance);

// Leave Types
router.get('/leave-types', hrmsController.listLeaveTypes);
router.post('/leave-types', validate(createLeaveTypeSchema), auditLog('hrms', 'CREATE', 'leave_type'), hrmsController.createLeaveType);
router.patch('/leave-types/:id', validate(updateLeaveTypeSchema), hrmsController.updateLeaveType);
router.delete('/leave-types/:id', auditLog('hrms', 'DELETE', 'leave_type'), hrmsController.removeLeaveType);

// Leave Requests
router.get('/leave-requests', hrmsController.listLeaveRequests);
router.post('/leave-requests', validate(createLeaveRequestSchema), auditLog('hrms', 'CREATE', 'leave_request'), hrmsController.createLeaveRequest);
router.get('/leave-requests/:id', hrmsController.getLeaveRequestById);
router.post('/leave-requests/:id/approve', validate(approveRejectLeaveSchema), auditLog('hrms', 'APPROVE', 'leave_request'), hrmsController.approveLeaveRequest);
router.post('/leave-requests/:id/reject', validate(approveRejectLeaveSchema), auditLog('hrms', 'REJECT', 'leave_request'), hrmsController.rejectLeaveRequest);
router.delete('/leave-requests/:id', hrmsController.removeLeaveRequest);

// Leave Balance & Calendar
router.get('/leave-balance', hrmsController.getLeaveBalance);
router.get('/leave-calendar', hrmsController.getLeaveCalendar);

// Holidays
router.get('/holidays', hrmsController.listHolidays);
router.post('/holidays', validate(createHolidaySchema), auditLog('hrms', 'CREATE', 'holiday'), hrmsController.createHoliday);
router.patch('/holidays/:id', validate(updateHolidaySchema), hrmsController.updateHoliday);
router.delete('/holidays/:id', auditLog('hrms', 'DELETE', 'holiday'), hrmsController.removeHoliday);

// Payroll
router.get('/payroll', hrmsController.listPayroll);
router.post('/payroll/run', validate(runPayrollSchema), auditLog('hrms', 'RUN', 'payroll'), hrmsController.runPayroll);
router.get('/payroll/:runId', hrmsController.getPayrollById);
router.get('/payroll/payslip/:id', hrmsController.getPayslip);
router.get('/payroll/export', hrmsController.exportPayslips);

// Salary Structure
router.get('/salary-structure/:employeeId', hrmsController.getSalaryStructure);
router.post('/salary-structure', validate(createSalaryStructureSchema), auditLog('hrms', 'CREATE', 'salary_structure'), hrmsController.createSalaryStructure);
router.patch('/salary-structure/:employeeId', validate(updateSalaryStructureSchema), hrmsController.updateSalaryStructure);

// Assets
router.get('/assets', hrmsController.listAssets);
router.post('/assets', validate(createAssetSchema), auditLog('hrms', 'CREATE', 'asset'), hrmsController.createAsset);
router.patch('/assets/:id', validate(updateAssetSchema), hrmsController.updateAsset);
router.delete('/assets/:id', auditLog('hrms', 'DELETE', 'asset'), hrmsController.removeAsset);
router.post('/assets/:id/assign', validate(assignAssetSchema), auditLog('hrms', 'ASSIGN', 'asset'), hrmsController.assignAsset);
router.post('/assets/:id/return', validate(returnAssetSchema), hrmsController.returnAsset);

// Reports
router.get('/reports/attendance', hrmsController.getAttendanceReport);
router.get('/reports/leave', hrmsController.getLeaveReport);
router.get('/reports/payroll', hrmsController.getPayrollReport);
router.get('/reports/headcount', hrmsController.getHeadcountReport);
router.get('/reports/attrition', hrmsController.getAttritionReport);

export default router;
