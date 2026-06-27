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
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const auth_1 = require("../middleware/auth");
const validate_1 = require("../middleware/validate");
const auditLogger_1 = __importDefault(require("../middleware/auditLogger"));
const hrmsController = __importStar(require("../controllers/hrms.controller"));
const hrms_validator_1 = require("../validators/hrms.validator");
router.use(auth_1.authenticate);
// Dashboard
router.get('/dashboard', hrmsController.getDashboard);
// Employees
router.get('/employees', hrmsController.listEmployees);
router.post('/employees', (0, validate_1.validate)(hrms_validator_1.createEmployeeSchema), (0, auditLogger_1.default)('hrms', 'CREATE', 'employee'), hrmsController.createEmployee);
router.get('/employees/export', hrmsController.exportEmployees);
router.post('/employees/bulk-import', hrmsController.bulkImportEmployees);
router.get('/employees/:id', hrmsController.getEmployeeById);
router.patch('/employees/:id', (0, validate_1.validate)(hrms_validator_1.updateEmployeeSchema), (0, auditLogger_1.default)('hrms', 'UPDATE', 'employee'), hrmsController.updateEmployee);
router.delete('/employees/:id', (0, auditLogger_1.default)('hrms', 'DELETE', 'employee'), hrmsController.removeEmployee);
router.patch('/employees/:id/activate', hrmsController.activateEmployee);
// Departments
router.get('/departments', hrmsController.listDepartments);
router.post('/departments', (0, validate_1.validate)(hrms_validator_1.createDepartmentSchema), (0, auditLogger_1.default)('hrms', 'CREATE', 'department'), hrmsController.createDepartment);
router.patch('/departments/:id', (0, validate_1.validate)(hrms_validator_1.updateDepartmentSchema), hrmsController.updateDepartment);
router.delete('/departments/:id', (0, auditLogger_1.default)('hrms', 'DELETE', 'department'), hrmsController.removeDepartment);
router.get('/departments/:id/employees', hrmsController.listDepartmentEmployees);
// Designations
router.get('/designations', hrmsController.listDesignations);
router.post('/designations', (0, validate_1.validate)(hrms_validator_1.createDesignationSchema), (0, auditLogger_1.default)('hrms', 'CREATE', 'designation'), hrmsController.createDesignation);
router.patch('/designations/:id', (0, validate_1.validate)(hrms_validator_1.updateDesignationSchema), hrmsController.updateDesignation);
router.delete('/designations/:id', (0, auditLogger_1.default)('hrms', 'DELETE', 'designation'), hrmsController.removeDesignation);
// Attendance
router.get('/attendance', hrmsController.listAttendance);
router.post('/attendance', (0, validate_1.validate)(hrms_validator_1.createAttendanceSchema), (0, auditLogger_1.default)('hrms', 'CREATE', 'attendance'), hrmsController.createAttendance);
router.patch('/attendance/:id', (0, validate_1.validate)(hrms_validator_1.updateAttendanceSchema), hrmsController.updateAttendance);
router.post('/attendance/bulk', (0, validate_1.validate)(hrms_validator_1.bulkAttendanceSchema), hrmsController.bulkCreateAttendance);
router.get('/attendance/summary', hrmsController.getAttendanceSummary);
router.get('/attendance/export', hrmsController.exportAttendance);
// Leave Types
router.get('/leave-types', hrmsController.listLeaveTypes);
router.post('/leave-types', (0, validate_1.validate)(hrms_validator_1.createLeaveTypeSchema), (0, auditLogger_1.default)('hrms', 'CREATE', 'leave_type'), hrmsController.createLeaveType);
router.patch('/leave-types/:id', (0, validate_1.validate)(hrms_validator_1.updateLeaveTypeSchema), hrmsController.updateLeaveType);
router.delete('/leave-types/:id', (0, auditLogger_1.default)('hrms', 'DELETE', 'leave_type'), hrmsController.removeLeaveType);
// Leave Requests
router.get('/leave-requests', hrmsController.listLeaveRequests);
router.post('/leave-requests', (0, validate_1.validate)(hrms_validator_1.createLeaveRequestSchema), (0, auditLogger_1.default)('hrms', 'CREATE', 'leave_request'), hrmsController.createLeaveRequest);
router.get('/leave-requests/:id', hrmsController.getLeaveRequestById);
router.post('/leave-requests/:id/approve', (0, validate_1.validate)(hrms_validator_1.approveRejectLeaveSchema), (0, auditLogger_1.default)('hrms', 'APPROVE', 'leave_request'), hrmsController.approveLeaveRequest);
router.post('/leave-requests/:id/reject', (0, validate_1.validate)(hrms_validator_1.approveRejectLeaveSchema), (0, auditLogger_1.default)('hrms', 'REJECT', 'leave_request'), hrmsController.rejectLeaveRequest);
router.delete('/leave-requests/:id', hrmsController.removeLeaveRequest);
// Leave Balance & Calendar
router.get('/leave-balance', hrmsController.getLeaveBalance);
router.get('/leave-calendar', hrmsController.getLeaveCalendar);
// Holidays
router.get('/holidays', hrmsController.listHolidays);
router.post('/holidays', (0, validate_1.validate)(hrms_validator_1.createHolidaySchema), (0, auditLogger_1.default)('hrms', 'CREATE', 'holiday'), hrmsController.createHoliday);
router.patch('/holidays/:id', (0, validate_1.validate)(hrms_validator_1.updateHolidaySchema), hrmsController.updateHoliday);
router.delete('/holidays/:id', (0, auditLogger_1.default)('hrms', 'DELETE', 'holiday'), hrmsController.removeHoliday);
// Payroll
router.get('/payroll', hrmsController.listPayroll);
router.post('/payroll/run', (0, validate_1.validate)(hrms_validator_1.runPayrollSchema), (0, auditLogger_1.default)('hrms', 'RUN', 'payroll'), hrmsController.runPayroll);
router.get('/payroll/:runId', hrmsController.getPayrollById);
router.get('/payroll/payslip/:id', hrmsController.getPayslip);
router.get('/payroll/export', hrmsController.exportPayslips);
// Salary Structure
router.get('/salary-structure/:employeeId', hrmsController.getSalaryStructure);
router.post('/salary-structure', (0, validate_1.validate)(hrms_validator_1.createSalaryStructureSchema), (0, auditLogger_1.default)('hrms', 'CREATE', 'salary_structure'), hrmsController.createSalaryStructure);
router.patch('/salary-structure/:employeeId', (0, validate_1.validate)(hrms_validator_1.updateSalaryStructureSchema), hrmsController.updateSalaryStructure);
// Assets
router.get('/assets', hrmsController.listAssets);
router.post('/assets', (0, validate_1.validate)(hrms_validator_1.createAssetSchema), (0, auditLogger_1.default)('hrms', 'CREATE', 'asset'), hrmsController.createAsset);
router.patch('/assets/:id', (0, validate_1.validate)(hrms_validator_1.updateAssetSchema), hrmsController.updateAsset);
router.delete('/assets/:id', (0, auditLogger_1.default)('hrms', 'DELETE', 'asset'), hrmsController.removeAsset);
router.post('/assets/:id/assign', (0, validate_1.validate)(hrms_validator_1.assignAssetSchema), (0, auditLogger_1.default)('hrms', 'ASSIGN', 'asset'), hrmsController.assignAsset);
router.post('/assets/:id/return', (0, validate_1.validate)(hrms_validator_1.returnAssetSchema), hrmsController.returnAsset);
// Reports
router.get('/reports/attendance', hrmsController.getAttendanceReport);
router.get('/reports/leave', hrmsController.getLeaveReport);
router.get('/reports/payroll', hrmsController.getPayrollReport);
router.get('/reports/headcount', hrmsController.getHeadcountReport);
router.get('/reports/attrition', hrmsController.getAttritionReport);
exports.default = router;
//# sourceMappingURL=hrms.routes.js.map