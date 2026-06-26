const express = require('express');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: HRMS
 *   description: Human Resource Management System (Employees, Attendance, Leave, Payroll, Assets)
 */


const { authenticate } = require('../middleware/auth');
const { checkPermission } = require('../middleware/rbac');
const { validate } = require('../middleware/validate');
const auditLog = require('../middleware/auditLogger');
const ctrl = require('../controllers/hrms.controller');
const {
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
} = require('../validators/hrms.validator');

router.use(authenticate);

// ─── DASHBOARD ────────────────────────────────────────────────────────────────────
/**
 * @swagger
 * /hrms/dashboard:
 *   get:
 *     summary: Get dashboard data for Dashboard
 *     tags: [HRMS]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.get(
  '/dashboard',
  checkPermission('hrms', 'read'),
  ctrl.getDashboard
);

// ─── EMPLOYEES ────────────────────────────────────────────────────────────────────
/**
 * @swagger
 * /hrms/employees/export:
 *   get:
 *     summary: Export Employees Export
 *     tags: [HRMS]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.get(
  '/employees/export',
  checkPermission('hrms', 'read'),
  ctrl.exportEmployees
);

/**
 * @swagger
 * /hrms/employees/bulk-import:
 *   post:
 *     summary: Bulk import Employees Bulk-import
 *     tags: [HRMS]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.post(
  '/employees/bulk-import',
  checkPermission('hrms', 'create'),
  ctrl.bulkImportEmployees
);

/**
 * @swagger
 * /hrms/employees:
 *   get:
 *     summary: Get Employees
 *     tags: [HRMS]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.get(
  '/employees',
  checkPermission('hrms', 'read'),
  ctrl.listEmployees
);

/**
 * @swagger
 * /hrms/employees:
 *   post:
 *     summary: Create Employees
 *     tags: [HRMS]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.post(
  '/employees',
  checkPermission('hrms', 'create'),
  validate(createEmployeeSchema),
  auditLog('hrms', 'CREATE', 'Employee'),
  ctrl.createEmployee
);

/**
 * @swagger
 * /hrms/employees/{id}:
 *   get:
 *     summary: Get Employees
 *     tags: [HRMS]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The id parameter
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.get(
  '/employees/:id',
  checkPermission('hrms', 'read'),
  ctrl.getEmployeeById
);

/**
 * @swagger
 * /hrms/employees/{id}:
 *   patch:
 *     summary: Update Employees
 *     tags: [HRMS]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The id parameter
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.patch(
  '/employees/:id',
  checkPermission('hrms', 'update'),
  validate(updateEmployeeSchema),
  auditLog('hrms', 'UPDATE', 'Employee'),
  ctrl.updateEmployee
);

/**
 * @swagger
 * /hrms/employees/{id}:
 *   delete:
 *     summary: Delete Employees
 *     tags: [HRMS]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The id parameter
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.delete(
  '/employees/:id',
  checkPermission('hrms', 'delete'),
  auditLog('hrms', 'DELETE', 'Employee'),
  ctrl.removeEmployee
);

/**
 * @swagger
 * /hrms/employees/{id}/activate:
 *   post:
 *     summary: Create Employees Activate
 *     tags: [HRMS]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The id parameter
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.post(
  '/employees/:id/activate',
  checkPermission('hrms', 'update'),
  auditLog('hrms', 'UPDATE', 'Employee'),
  ctrl.activateEmployee
);

// ─── DEPARTMENTS ──────────────────────────────────────────────────────────────────
/**
 * @swagger
 * /hrms/departments:
 *   get:
 *     summary: Get Departments
 *     tags: [HRMS]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.get(
  '/departments',
  checkPermission('hrms', 'read'),
  ctrl.listDepartments
);

/**
 * @swagger
 * /hrms/departments:
 *   post:
 *     summary: Create Departments
 *     tags: [HRMS]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.post(
  '/departments',
  checkPermission('hrms', 'create'),
  validate(createDepartmentSchema),
  auditLog('hrms', 'CREATE', 'Department'),
  ctrl.createDepartment
);

/**
 * @swagger
 * /hrms/departments/{id}:
 *   patch:
 *     summary: Update Departments
 *     tags: [HRMS]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The id parameter
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.patch(
  '/departments/:id',
  checkPermission('hrms', 'update'),
  validate(updateDepartmentSchema),
  auditLog('hrms', 'UPDATE', 'Department'),
  ctrl.updateDepartment
);

/**
 * @swagger
 * /hrms/departments/{id}:
 *   delete:
 *     summary: Delete Departments
 *     tags: [HRMS]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The id parameter
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.delete(
  '/departments/:id',
  checkPermission('hrms', 'delete'),
  auditLog('hrms', 'DELETE', 'Department'),
  ctrl.removeDepartment
);

/**
 * @swagger
 * /hrms/departments/{id}/employees:
 *   get:
 *     summary: Get Departments Employees
 *     tags: [HRMS]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The id parameter
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.get(
  '/departments/:id/employees',
  checkPermission('hrms', 'read'),
  ctrl.listDepartmentEmployees
);

// ─── DESIGNATIONS ─────────────────────────────────────────────────────────────────
/**
 * @swagger
 * /hrms/designations:
 *   get:
 *     summary: Get Designations
 *     tags: [HRMS]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.get(
  '/designations',
  checkPermission('hrms', 'read'),
  ctrl.listDesignations
);

/**
 * @swagger
 * /hrms/designations:
 *   post:
 *     summary: Create Designations
 *     tags: [HRMS]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.post(
  '/designations',
  checkPermission('hrms', 'create'),
  validate(createDesignationSchema),
  auditLog('hrms', 'CREATE', 'Designation'),
  ctrl.createDesignation
);

/**
 * @swagger
 * /hrms/designations/{id}:
 *   patch:
 *     summary: Update Designations
 *     tags: [HRMS]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The id parameter
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.patch(
  '/designations/:id',
  checkPermission('hrms', 'update'),
  validate(updateDesignationSchema),
  auditLog('hrms', 'UPDATE', 'Designation'),
  ctrl.updateDesignation
);

/**
 * @swagger
 * /hrms/designations/{id}:
 *   delete:
 *     summary: Delete Designations
 *     tags: [HRMS]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The id parameter
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.delete(
  '/designations/:id',
  checkPermission('hrms', 'delete'),
  auditLog('hrms', 'DELETE', 'Designation'),
  ctrl.removeDesignation
);

// ─── ATTENDANCE ───────────────────────────────────────────────────────────────────
/**
 * @swagger
 * /hrms/attendance/summary:
 *   get:
 *     summary: Get summary of Attendance Summary
 *     tags: [HRMS]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.get(
  '/attendance/summary',
  checkPermission('hrms', 'read'),
  ctrl.getAttendanceSummary
);

/**
 * @swagger
 * /hrms/attendance/export:
 *   get:
 *     summary: Export Attendance Export
 *     tags: [HRMS]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.get(
  '/attendance/export',
  checkPermission('hrms', 'read'),
  ctrl.exportAttendance
);

/**
 * @swagger
 * /hrms/attendance/bulk:
 *   post:
 *     summary: Create Attendance Bulk
 *     tags: [HRMS]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.post(
  '/attendance/bulk',
  checkPermission('hrms', 'create'),
  validate(bulkAttendanceSchema),
  auditLog('hrms', 'CREATE', 'Attendance'),
  ctrl.bulkCreateAttendance
);

/**
 * @swagger
 * /hrms/attendance:
 *   get:
 *     summary: Get Attendance
 *     tags: [HRMS]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.get(
  '/attendance',
  checkPermission('hrms', 'read'),
  ctrl.listAttendance
);

/**
 * @swagger
 * /hrms/attendance:
 *   post:
 *     summary: Create Attendance
 *     tags: [HRMS]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.post(
  '/attendance',
  checkPermission('hrms', 'create'),
  validate(createAttendanceSchema),
  auditLog('hrms', 'CREATE', 'Attendance'),
  ctrl.createAttendance
);

/**
 * @swagger
 * /hrms/attendance/{id}:
 *   patch:
 *     summary: Update Attendance
 *     tags: [HRMS]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The id parameter
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.patch(
  '/attendance/:id',
  checkPermission('hrms', 'update'),
  validate(updateAttendanceSchema),
  auditLog('hrms', 'UPDATE', 'Attendance'),
  ctrl.updateAttendance
);

// ─── LEAVE TYPES ──────────────────────────────────────────────────────────────────
/**
 * @swagger
 * /hrms/leave-types:
 *   get:
 *     summary: Get Leave-types
 *     tags: [HRMS]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.get(
  '/leave-types',
  checkPermission('hrms', 'read'),
  ctrl.listLeaveTypes
);

/**
 * @swagger
 * /hrms/leave-types:
 *   post:
 *     summary: Create Leave-types
 *     tags: [HRMS]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.post(
  '/leave-types',
  checkPermission('hrms', 'create'),
  validate(createLeaveTypeSchema),
  auditLog('hrms', 'CREATE', 'LeaveType'),
  ctrl.createLeaveType
);

/**
 * @swagger
 * /hrms/leave-types/{id}:
 *   patch:
 *     summary: Update Leave-types
 *     tags: [HRMS]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The id parameter
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.patch(
  '/leave-types/:id',
  checkPermission('hrms', 'update'),
  validate(updateLeaveTypeSchema),
  auditLog('hrms', 'UPDATE', 'LeaveType'),
  ctrl.updateLeaveType
);

/**
 * @swagger
 * /hrms/leave-types/{id}:
 *   delete:
 *     summary: Delete Leave-types
 *     tags: [HRMS]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The id parameter
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.delete(
  '/leave-types/:id',
  checkPermission('hrms', 'delete'),
  auditLog('hrms', 'DELETE', 'LeaveType'),
  ctrl.removeLeaveType
);

// ─── LEAVE REQUESTS ───────────────────────────────────────────────────────────────
/**
 * @swagger
 * /hrms/leave-balance:
 *   get:
 *     summary: Get Leave-balance
 *     tags: [HRMS]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.get(
  '/leave-balance',
  checkPermission('hrms', 'read'),
  ctrl.getLeaveBalance
);

/**
 * @swagger
 * /hrms/leave-calendar:
 *   get:
 *     summary: Get Leave-calendar
 *     tags: [HRMS]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.get(
  '/leave-calendar',
  checkPermission('hrms', 'read'),
  ctrl.getLeaveCalendar
);

/**
 * @swagger
 * /hrms/leave-requests:
 *   get:
 *     summary: Get Leave-requests
 *     tags: [HRMS]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.get(
  '/leave-requests',
  checkPermission('hrms', 'read'),
  ctrl.listLeaveRequests
);

/**
 * @swagger
 * /hrms/leave-requests:
 *   post:
 *     summary: Create Leave-requests
 *     tags: [HRMS]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.post(
  '/leave-requests',
  checkPermission('hrms', 'create'),
  validate(createLeaveRequestSchema),
  auditLog('hrms', 'CREATE', 'LeaveRequest'),
  ctrl.createLeaveRequest
);

/**
 * @swagger
 * /hrms/leave-requests/{id}:
 *   get:
 *     summary: Get Leave-requests
 *     tags: [HRMS]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The id parameter
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.get(
  '/leave-requests/:id',
  checkPermission('hrms', 'read'),
  ctrl.getLeaveRequestById
);

/**
 * @swagger
 * /hrms/leave-requests/{id}/approve:
 *   patch:
 *     summary: Update Leave-requests Approve
 *     tags: [HRMS]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The id parameter
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.patch(
  '/leave-requests/:id/approve',
  checkPermission('hrms', 'update'),
  validate(approveRejectLeaveSchema),
  auditLog('hrms', 'UPDATE', 'LeaveRequest'),
  ctrl.approveLeaveRequest
);

/**
 * @swagger
 * /hrms/leave-requests/{id}/reject:
 *   patch:
 *     summary: Update Leave-requests Reject
 *     tags: [HRMS]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The id parameter
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.patch(
  '/leave-requests/:id/reject',
  checkPermission('hrms', 'update'),
  validate(approveRejectLeaveSchema),
  auditLog('hrms', 'UPDATE', 'LeaveRequest'),
  ctrl.rejectLeaveRequest
);

/**
 * @swagger
 * /hrms/leave-requests/{id}:
 *   delete:
 *     summary: Delete Leave-requests
 *     tags: [HRMS]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The id parameter
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.delete(
  '/leave-requests/:id',
  checkPermission('hrms', 'delete'),
  auditLog('hrms', 'DELETE', 'LeaveRequest'),
  ctrl.removeLeaveRequest
);

// ─── HOLIDAYS ─────────────────────────────────────────────────────────────────────
/**
 * @swagger
 * /hrms/holidays:
 *   get:
 *     summary: Get Holidays
 *     tags: [HRMS]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.get(
  '/holidays',
  checkPermission('hrms', 'read'),
  ctrl.listHolidays
);

/**
 * @swagger
 * /hrms/holidays:
 *   post:
 *     summary: Create Holidays
 *     tags: [HRMS]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.post(
  '/holidays',
  checkPermission('hrms', 'create'),
  validate(createHolidaySchema),
  auditLog('hrms', 'CREATE', 'Holiday'),
  ctrl.createHoliday
);

/**
 * @swagger
 * /hrms/holidays/{id}:
 *   patch:
 *     summary: Update Holidays
 *     tags: [HRMS]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The id parameter
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.patch(
  '/holidays/:id',
  checkPermission('hrms', 'update'),
  validate(updateHolidaySchema),
  auditLog('hrms', 'UPDATE', 'Holiday'),
  ctrl.updateHoliday
);

/**
 * @swagger
 * /hrms/holidays/{id}:
 *   delete:
 *     summary: Delete Holidays
 *     tags: [HRMS]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The id parameter
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.delete(
  '/holidays/:id',
  checkPermission('hrms', 'delete'),
  auditLog('hrms', 'DELETE', 'Holiday'),
  ctrl.removeHoliday
);

// ─── PAYROLL ──────────────────────────────────────────────────────────────────────
/**
 * @swagger
 * /hrms/payroll:
 *   get:
 *     summary: Get Payroll
 *     tags: [HRMS]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.get(
  '/payroll',
  checkPermission('hrms', 'read'),
  ctrl.listPayroll
);

/**
 * @swagger
 * /hrms/payroll/run:
 *   post:
 *     summary: Create Payroll Run
 *     tags: [HRMS]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.post(
  '/payroll/run',
  checkPermission('hrms', 'create'),
  validate(runPayrollSchema),
  auditLog('hrms', 'CREATE', 'Payroll'),
  ctrl.runPayroll
);

/**
 * @swagger
 * /hrms/payroll/payslips/{id}:
 *   get:
 *     summary: Get Payroll Payslips
 *     tags: [HRMS]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The id parameter
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.get(
  '/payroll/payslips/:id',
  checkPermission('hrms', 'read'),
  ctrl.getPayslip
);

/**
 * @swagger
 * /hrms/payroll/payslips/export:
 *   post:
 *     summary: Create Payroll Payslips Export
 *     tags: [HRMS]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.post(
  '/payroll/payslips/export',
  checkPermission('hrms', 'read'),
  ctrl.exportPayslips
);

/**
 * @swagger
 * /hrms/payroll/{runId}:
 *   get:
 *     summary: Get Payroll
 *     tags: [HRMS]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: runId
 *         required: true
 *         schema:
 *           type: string
 *         description: The runId parameter
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.get(
  '/payroll/:runId',
  checkPermission('hrms', 'read'),
  ctrl.getPayrollById
);

// ─── SALARY STRUCTURE ─────────────────────────────────────────────────────────────
/**
 * @swagger
 * /hrms/salary-structure/{employeeId}:
 *   get:
 *     summary: Get Salary-structure
 *     tags: [HRMS]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: employeeId
 *         required: true
 *         schema:
 *           type: string
 *         description: The employeeId parameter
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.get(
  '/salary-structure/:employeeId',
  checkPermission('hrms', 'read'),
  ctrl.getSalaryStructure
);

/**
 * @swagger
 * /hrms/salary-structure:
 *   post:
 *     summary: Create Salary-structure
 *     tags: [HRMS]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.post(
  '/salary-structure',
  checkPermission('hrms', 'create'),
  validate(createSalaryStructureSchema),
  auditLog('hrms', 'CREATE', 'SalaryStructure'),
  ctrl.createSalaryStructure
);

/**
 * @swagger
 * /hrms/salary-structure/{employeeId}:
 *   patch:
 *     summary: Update Salary-structure
 *     tags: [HRMS]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: employeeId
 *         required: true
 *         schema:
 *           type: string
 *         description: The employeeId parameter
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.patch(
  '/salary-structure/:employeeId',
  checkPermission('hrms', 'update'),
  validate(updateSalaryStructureSchema),
  auditLog('hrms', 'UPDATE', 'SalaryStructure'),
  ctrl.updateSalaryStructure
);

// ─── ASSETS ───────────────────────────────────────────────────────────────────────
/**
 * @swagger
 * /hrms/assets:
 *   get:
 *     summary: Get Assets
 *     tags: [HRMS]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.get(
  '/assets',
  checkPermission('hrms', 'read'),
  ctrl.listAssets
);

/**
 * @swagger
 * /hrms/assets:
 *   post:
 *     summary: Create Assets
 *     tags: [HRMS]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.post(
  '/assets',
  checkPermission('hrms', 'create'),
  validate(createAssetSchema),
  auditLog('hrms', 'CREATE', 'Asset'),
  ctrl.createAsset
);

/**
 * @swagger
 * /hrms/assets/{id}:
 *   patch:
 *     summary: Update Assets
 *     tags: [HRMS]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The id parameter
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.patch(
  '/assets/:id',
  checkPermission('hrms', 'update'),
  validate(updateAssetSchema),
  auditLog('hrms', 'UPDATE', 'Asset'),
  ctrl.updateAsset
);

/**
 * @swagger
 * /hrms/assets/{id}:
 *   delete:
 *     summary: Delete Assets
 *     tags: [HRMS]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The id parameter
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.delete(
  '/assets/:id',
  checkPermission('hrms', 'delete'),
  auditLog('hrms', 'DELETE', 'Asset'),
  ctrl.removeAsset
);

/**
 * @swagger
 * /hrms/assets/{id}/assign:
 *   post:
 *     summary: Create Assets Assign
 *     tags: [HRMS]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The id parameter
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.post(
  '/assets/:id/assign',
  checkPermission('hrms', 'update'),
  validate(assignAssetSchema),
  auditLog('hrms', 'UPDATE', 'Asset'),
  ctrl.assignAsset
);

/**
 * @swagger
 * /hrms/assets/{id}/return:
 *   post:
 *     summary: Create Assets Return
 *     tags: [HRMS]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The id parameter
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.post(
  '/assets/:id/return',
  checkPermission('hrms', 'update'),
  validate(returnAssetSchema),
  auditLog('hrms', 'UPDATE', 'Asset'),
  ctrl.returnAsset
);

// ─── REPORTS ──────────────────────────────────────────────────────────────────────
/**
 * @swagger
 * /hrms/reports/attendance:
 *   get:
 *     summary: Get Reports Attendance
 *     tags: [HRMS]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.get(
  '/reports/attendance',
  checkPermission('hrms', 'read'),
  ctrl.getAttendanceReport
);

/**
 * @swagger
 * /hrms/reports/leave:
 *   get:
 *     summary: Get Reports Leave
 *     tags: [HRMS]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.get(
  '/reports/leave',
  checkPermission('hrms', 'read'),
  ctrl.getLeaveReport
);

/**
 * @swagger
 * /hrms/reports/payroll:
 *   get:
 *     summary: Get Reports Payroll
 *     tags: [HRMS]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.get(
  '/reports/payroll',
  checkPermission('hrms', 'read'),
  ctrl.getPayrollReport
);

/**
 * @swagger
 * /hrms/reports/headcount:
 *   get:
 *     summary: Get Reports Headcount
 *     tags: [HRMS]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.get(
  '/reports/headcount',
  checkPermission('hrms', 'read'),
  ctrl.getHeadcountReport
);

/**
 * @swagger
 * /hrms/reports/attrition:
 *   get:
 *     summary: Get Reports Attrition
 *     tags: [HRMS]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.get(
  '/reports/attrition',
  checkPermission('hrms', 'read'),
  ctrl.getAttritionReport
);

module.exports = router;
