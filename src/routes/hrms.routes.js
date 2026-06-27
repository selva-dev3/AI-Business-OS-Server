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
 *     summary: Get HRMS dashboard overview
 *     description: Returns aggregate metrics for the HRMS dashboard including headcount, attendance summary, pending leaves, and payroll stats.
 *     tags: [HRMS]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Dashboard data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *       400:
 *         description: Invalid input or bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       401:
 *         description: Unauthorized - missing or invalid JWT token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       403:
 *         description: Forbidden - insufficient permissions
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       429:
 *         description: Too many requests
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.get(
  '/dashboard',
  checkPermission('EMPLOYEES', 'read'),
  ctrl.getDashboard
);

// ─── EMPLOYEES ────────────────────────────────────────────────────────────────────
/**
 * @swagger
 * /hrms/employees/export:
 *   get:
 *     summary: Export employees to file
 *     description: Exports employee records in the specified format (CSV, Excel, PDF). Supports filtering by department, status, and date range.
 *     tags: [HRMS]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: format
 *         required: false
 *         schema:
 *           type: string
 *           enum: [csv, xlsx, pdf]
 *         description: Export format (defaults to csv)
 *       - in: query
 *         name: departmentId
 *         required: false
 *         schema:
 *           type: string
 *         description: Filter by department ID
 *       - in: query
 *         name: status
 *         required: false
 *         schema:
 *           type: string
 *           enum: [active, inactive, terminated]
 *         description: Filter by employment status
 *       - in: query
 *         name: fromDate
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter records created on or after this date (YYYY-MM-DD)
 *       - in: query
 *         name: toDate
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter records created on or before this date (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: File download or export URL
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *       400:
 *         description: Invalid input or bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       401:
 *         description: Unauthorized - missing or invalid JWT token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       403:
 *         description: Forbidden - insufficient permissions
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       429:
 *         description: Too many requests
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.get(
  '/employees/export',
  checkPermission('EMPLOYEES', 'read'),
  ctrl.exportEmployees
);

/**
 * @swagger
 * /hrms/employees/bulk-import:
 *   post:
 *     summary: Bulk import employees from file
 *     description: Upload a CSV or Excel file to bulk create or update employees. The file is processed as multipart/form-data.
 *     tags: [HRMS]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: CSV or Excel file containing employee records
 *     responses:
 *       200:
 *         description: Bulk import processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *       400:
 *         description: Invalid input or bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       401:
 *         description: Unauthorized - missing or invalid JWT token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       403:
 *         description: Forbidden - insufficient permissions
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       409:
 *         description: Conflict - duplicate records found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       422:
 *         description: Unprocessable entity - file format or data validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       429:
 *         description: Too many requests
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.post(
  '/employees/bulk-import',
  checkPermission('EMPLOYEES', 'create'),
  ctrl.bulkImportEmployees
);

/**
 * @swagger
 * /hrms/employees:
 *   get:
 *     summary: List all employees
 *     description: Retrieve a paginated list of employees with optional search, sorting, and filtering by status or department.
 *     tags: [HRMS]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Number of records per page
 *       - in: query
 *         name: search
 *         required: false
 *         schema:
 *           type: string
 *         description: Search query to filter by name, email, or employee code
 *       - in: query
 *         name: sort
 *         required: false
 *         schema:
 *           type: string
 *           default: createdAt
 *         description: Field to sort by (prefix with - for descending)
 *       - in: query
 *         name: status
 *         required: false
 *         schema:
 *           type: string
 *           enum: [active, inactive, terminated]
 *         description: Filter by employment status
 *       - in: query
 *         name: departmentId
 *         required: false
 *         schema:
 *           type: string
 *         description: Filter by department ID
 *     responses:
 *       200:
 *         description: Paginated list of employees
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedResponse'
 *       400:
 *         description: Invalid input or bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       401:
 *         description: Unauthorized - missing or invalid JWT token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       403:
 *         description: Forbidden - insufficient permissions
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       429:
 *         description: Too many requests
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.get(
  '/employees',
  checkPermission('EMPLOYEES', 'read'),
  ctrl.listEmployees
);

/**
 * @swagger
 * /hrms/employees:
 *   post:
 *     summary: Create a new employee
 *     description: Create a new employee record with personal, professional, and compensation details.
 *     tags: [HRMS]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateEmployeeRequest'
 *     responses:
 *       201:
 *         description: Employee created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *       400:
 *         description: Invalid input or bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       401:
 *         description: Unauthorized - missing or invalid JWT token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       403:
 *         description: Forbidden - insufficient permissions
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       409:
 *         description: Conflict - duplicate email or employee code
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       422:
 *         description: Unprocessable entity - validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       429:
 *         description: Too many requests
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.post(
  '/employees',
  checkPermission('EMPLOYEES', 'create'),
  validate(createEmployeeSchema),
  auditLog('hrms', 'CREATE', 'Employee'),
  ctrl.createEmployee
);

/**
 * @swagger
 * /hrms/employees/{id}:
 *   get:
 *     summary: Get employee by ID
 *     description: Retrieve a single employee record by its unique ID, including department, designation, and salary structure details.
 *     tags: [HRMS]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier of the employee
 *     responses:
 *       200:
 *         description: Employee record retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *       400:
 *         description: Invalid input or bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       401:
 *         description: Unauthorized - missing or invalid JWT token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       403:
 *         description: Forbidden - insufficient permissions
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       404:
 *         description: Employee not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       429:
 *         description: Too many requests
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.get(
  '/employees/:id',
  checkPermission('EMPLOYEES', 'read'),
  ctrl.getEmployeeById
);

/**
 * @swagger
 * /hrms/employees/{id}:
 *   patch:
 *     summary: Update an existing employee
 *     description: Update one or more fields of an existing employee record. Partial updates are supported.
 *     tags: [HRMS]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier of the employee to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateEmployeeRequest'
 *     responses:
 *       200:
 *         description: Employee updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *       400:
 *         description: Invalid input or bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       401:
 *         description: Unauthorized - missing or invalid JWT token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       403:
 *         description: Forbidden - insufficient permissions
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       404:
 *         description: Employee not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       409:
 *         description: Conflict - duplicate email or employee code
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       422:
 *         description: Unprocessable entity - validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       429:
 *         description: Too many requests
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.patch(
  '/employees/:id',
  checkPermission('EMPLOYEES', 'update'),
  validate(updateEmployeeSchema),
  auditLog('hrms', 'UPDATE', 'Employee'),
  ctrl.updateEmployee
);

/**
 * @swagger
 * /hrms/employees/{id}:
 *   delete:
 *     summary: Delete an employee
 *     description: Permanently remove an employee record from the system. This action may be restricted based on business rules.
 *     tags: [HRMS]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier of the employee to delete
 *     responses:
 *       200:
 *         description: Employee deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *       400:
 *         description: Invalid input or bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       401:
 *         description: Unauthorized - missing or invalid JWT token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       403:
 *         description: Forbidden - insufficient permissions
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       404:
 *         description: Employee not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       409:
 *         description: Conflict - employee has active associations
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       429:
 *         description: Too many requests
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.delete(
  '/employees/:id',
  checkPermission('EMPLOYEES', 'delete'),
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
  checkPermission('EMPLOYEES', 'update'),
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
  checkPermission('DEPARTMENTS', 'read'),
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
  checkPermission('DEPARTMENTS', 'create'),
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
  checkPermission('DEPARTMENTS', 'update'),
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
  checkPermission('DEPARTMENTS', 'delete'),
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
  checkPermission('DEPARTMENTS', 'read'),
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
  checkPermission('ATTENDANCE', 'read'),
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
  checkPermission('ATTENDANCE', 'read'),
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
  checkPermission('ATTENDANCE', 'create'),
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
  checkPermission('ATTENDANCE', 'read'),
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
  checkPermission('ATTENDANCE', 'create'),
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
  checkPermission('ATTENDANCE', 'update'),
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
  checkPermission('LEAVES', 'read'),
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
  checkPermission('LEAVES', 'create'),
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
  checkPermission('LEAVES', 'update'),
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
  checkPermission('LEAVES', 'delete'),
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
  checkPermission('LEAVES', 'read'),
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
  checkPermission('LEAVES', 'read'),
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
  checkPermission('LEAVES', 'read'),
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
  checkPermission('LEAVES', 'create'),
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
  checkPermission('LEAVES', 'read'),
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
  checkPermission('LEAVES', 'update'),
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
  checkPermission('LEAVES', 'update'),
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
  checkPermission('LEAVES', 'delete'),
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
  checkPermission('HOLIDAYS', 'read'),
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
  checkPermission('HOLIDAYS', 'create'),
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
  checkPermission('HOLIDAYS', 'update'),
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
  checkPermission('HOLIDAYS', 'delete'),
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
  checkPermission('PAYROLL', 'read'),
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
  checkPermission('PAYROLL', 'create'),
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
  checkPermission('PAYROLL', 'read'),
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
  checkPermission('PAYROLL', 'read'),
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
  checkPermission('PAYROLL', 'read'),
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
  checkPermission('ASSETS', 'read'),
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
  checkPermission('ASSETS', 'create'),
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
  checkPermission('ASSETS', 'update'),
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
  checkPermission('ASSETS', 'delete'),
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
  checkPermission('ASSETS', 'update'),
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
  checkPermission('ASSETS', 'update'),
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
  checkPermission('REPORTS', 'read'),
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
  checkPermission('REPORTS', 'read'),
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
  checkPermission('REPORTS', 'read'),
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
  checkPermission('REPORTS', 'read'),
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
  checkPermission('REPORTS', 'read'),
  ctrl.getAttritionReport
);

module.exports = router;
