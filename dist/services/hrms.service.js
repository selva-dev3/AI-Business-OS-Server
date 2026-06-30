"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createHoliday = exports.listHolidays = exports.getLeaveCalendar = exports.getLeaveBalance = exports.removeLeaveRequest = exports.rejectLeaveRequest = exports.approveLeaveRequest = exports.getLeaveRequestById = exports.createLeaveRequest = exports.listLeaveRequests = exports.removeLeaveType = exports.updateLeaveType = exports.createLeaveType = exports.listLeaveTypes = exports.exportAttendance = exports.bulkCreateAttendance = exports.getAttendanceSummary = exports.getAttendanceById = exports.updateAttendance = exports.createAttendance = exports.listAttendance = exports.exportDesignationsExcel = exports.exportDesignationsCSV = exports.changeDesignationStatus = exports.bulkRestoreDesignations = exports.bulkDeleteDesignations = exports.restoreDesignation = exports.removeDesignation = exports.updateDesignation = exports.createDesignation = exports.getDesignationById = exports.listAllDesignations = exports.listDesignations = exports.listDepartmentEmployees = exports.removeDepartment = exports.updateDepartment = exports.createDepartment = exports.listDepartments = exports.exportEmployees = exports.bulkImportEmployees = exports.reinstateEmployee = exports.suspendEmployee = exports.activateEmployee = exports.hardDeleteEmployee = exports.removeEmployee = exports.updateEmployee = exports.getEmployeeById = exports.createEmployee = exports.listEmployees = exports.getDashboard = void 0;
exports.approveRejectTransfer = exports.createTransferRequest = exports.getTrainingCertifications = exports.getTrainingHistory = exports.completeCourse = exports.enrollCourse = exports.listTrainingCourses = exports.submitFeedback = exports.getAppraisalHistory = exports.submitAppraisal = exports.updatePerformanceGoal = exports.createPerformanceGoal = exports.listPerformanceGoals = exports.requestLetter = exports.getEmployeeDeductions = exports.getEmployeeTaxDetails = exports.getPayslipByMonthYear = exports.getEmployeePayslips = exports.getRegularization = exports.listRegularizations = exports.approveRejectRegularization = exports.createRegularization = exports.checkout = exports.checkin = exports.getEmployeeHistory = exports.updateEmployeeStatus = exports.updateEmployeeProfile = exports.getEmployeeProfile = exports.fullUpdateEmployee = exports.getAttritionReport = exports.getHeadcountReport = exports.getPayrollReport = exports.getLeaveReport = exports.getAttendanceReport = exports.returnAsset = exports.assignAsset = exports.removeAsset = exports.updateAsset = exports.createAsset = exports.listAssets = exports.updateSalaryStructure = exports.createSalaryStructure = exports.getSalaryStructure = exports.exportPayslips = exports.getPayslip = exports.getPayrollById = exports.runPayroll = exports.listPayroll = exports.removeHoliday = exports.updateHoliday = void 0;
exports.deleteEmployeeNote = exports.updateEmployeeNote = exports.listEmployeeNotes = exports.createEmployeeNote = exports.getEmployeeDocument = exports.listEmployeeDocuments = exports.createEmployeeDocument = exports.resetEmployeePassword = exports.assignEmployeeRole = exports.terminateEmployee = exports.initiateLeaveOnBehalf = exports.getEmployeePayroll = exports.getEmployeeLeaves = exports.getEmployeeAttendance = exports.getFnF = exports.updateClearance = exports.getExitChecklist = exports.submitResignation = exports.createPromotion = void 0;
const Employee_1 = __importDefault(require("../models/Employee"));
const Department_1 = __importDefault(require("../models/Department"));
const Designation_1 = __importDefault(require("../models/Designation"));
const Attendance_1 = __importDefault(require("../models/Attendance"));
const LeaveType_1 = __importDefault(require("../models/LeaveType"));
const LeaveRequest_1 = __importDefault(require("../models/LeaveRequest"));
const LeaveBalance_1 = __importDefault(require("../models/LeaveBalance"));
const Holiday_1 = __importDefault(require("../models/Holiday"));
const Payroll_1 = __importDefault(require("../models/Payroll"));
const Payslip_1 = __importDefault(require("../models/Payslip"));
const SalaryStructure_1 = __importDefault(require("../models/SalaryStructure"));
const Asset_1 = __importDefault(require("../models/Asset"));
const AssetAssignment_1 = __importDefault(require("../models/AssetAssignment"));
const RegularizationRequest_1 = __importDefault(require("../models/RegularizationRequest"));
const PerformanceGoal_1 = __importDefault(require("../models/PerformanceGoal"));
const PerformanceAppraisal_1 = __importDefault(require("../models/PerformanceAppraisal"));
const PerformanceFeedback_1 = __importDefault(require("../models/PerformanceFeedback"));
const TrainingCourse_1 = __importDefault(require("../models/TrainingCourse"));
const TrainingEnrollment_1 = __importDefault(require("../models/TrainingEnrollment"));
const TrainingCertification_1 = __importDefault(require("../models/TrainingCertification"));
const TransferRequest_1 = __importDefault(require("../models/TransferRequest"));
const Promotion_1 = __importDefault(require("../models/Promotion"));
const EmployeeHistory_1 = __importDefault(require("../models/EmployeeHistory"));
const ExitResignation_1 = __importDefault(require("../models/ExitResignation"));
const ExitChecklist_1 = __importDefault(require("../models/ExitChecklist"));
const ExitClearance_1 = __importDefault(require("../models/ExitClearance"));
const ExitSettlement_1 = __importDefault(require("../models/ExitSettlement"));
const crypto_1 = __importDefault(require("crypto"));
const mongoose_1 = __importDefault(require("mongoose"));
const appError_1 = __importDefault(require("../utils/appError"));
const helpers_1 = require("../utils/helpers");
const transformEmployee = (emp) => {
    if (!emp)
        return null;
    const result = { ...emp };
    if (result._id) {
        result.id = result._id.toString();
    }
    if (result.employeeCode) {
        result.employeeId = result.employeeCode;
    }
    if (result.status) {
        result.status = result.status.toLowerCase();
    }
    if (result.employmentType) {
        result.employmentType = result.employmentType.toLowerCase();
    }
    if (result.joiningDate) {
        try {
            result.dateOfJoining = new Date(result.joiningDate).toISOString().split('T')[0];
        }
        catch (_e) {
            result.dateOfJoining = result.joiningDate;
        }
    }
    if (result.designationId) {
        if (typeof result.designationId === 'object') {
            result.designation = result.designationId.name || '';
            result.designationId = result.designationId._id
                ? result.designationId._id.toString()
                : String(result.designationId);
        }
        else {
            result.designationId = String(result.designationId);
        }
    }
    if (result.departmentId) {
        if (typeof result.departmentId === 'object') {
            result.department = {
                id: result.departmentId._id ? result.departmentId._id.toString() : '',
                name: result.departmentId.name || '',
            };
            result.departmentId = result.departmentId._id
                ? result.departmentId._id.toString()
                : '';
        }
        else {
            result.departmentId = result.departmentId.toString();
        }
    }
    if (result.reportingManagerId) {
        if (typeof result.reportingManagerId === 'object') {
            result.manager = {
                id: result.reportingManagerId._id ? result.reportingManagerId._id.toString() : '',
                firstName: result.reportingManagerId.firstName || '',
                lastName: result.reportingManagerId.lastName || '',
            };
            result.managerId = result.reportingManagerId._id
                ? result.reportingManagerId._id.toString()
                : '';
        }
        else {
            result.managerId = result.reportingManagerId.toString();
        }
    }
    if (result.address && typeof result.address === 'object') {
        const addr = result.address;
        result.street = addr.street || '';
        result.city = addr.city || '';
        result.state = addr.state || '';
        result.country = addr.country || '';
        result.zipCode = addr.zip || '';
        result.address = addr.street || '';
    }
    return result;
};
const getDashboard = async (companyId, from, to) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayEnd = new Date(today);
    todayEnd.setHours(23, 59, 59, 999);
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);
    const [totalEmployees, presentToday, onLeaveToday, newHiresThisMonth, pendingLeaveRequests] = await Promise.all([
        Employee_1.default.countDocuments({ companyId, status: 'ACTIVE' }),
        Attendance_1.default.countDocuments({ companyId, date: { $gte: today, $lte: todayEnd }, status: 'PRESENT' }),
        Attendance_1.default.countDocuments({ companyId, date: { $gte: today, $lte: todayEnd }, status: 'ON_LEAVE' }),
        Employee_1.default.countDocuments({ companyId, joiningDate: { $gte: startOfMonth, $lte: endOfMonth } }),
        LeaveRequest_1.default.countDocuments({ companyId, status: 'PENDING' }),
    ]);
    const sixMonthsBack = new Date(today);
    sixMonthsBack.setMonth(sixMonthsBack.getMonth() - 6);
    const employeesBeforeSixMonths = await Employee_1.default.countDocuments({
        companyId,
        status: 'ACTIVE',
        joiningDate: { $lt: startOfMonth },
    });
    const leftThisMonth = await Employee_1.default.countDocuments({
        companyId,
        status: { $in: ['INACTIVE', 'TERMINATED'] },
        exitDate: { $gte: startOfMonth, $lte: endOfMonth },
    });
    const totalBefore = employeesBeforeSixMonths + leftThisMonth;
    const attritionRate = totalBefore > 0 ? Math.round((leftThisMonth / totalBefore) * 10000) / 100 : 0;
    const headcountTrendRaw = await Employee_1.default.aggregate([
        { $match: { companyId: companyId, status: 'ACTIVE' } },
        {
            $group: {
                _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
                count: { $sum: 1 },
            },
        },
        { $sort: { _id: 1 } },
        { $limit: 12 },
    ]);
    const headcountTrend = headcountTrendRaw.map(h => ({ month: h._id, count: h.count }));
    const departmentWise = await Employee_1.default.aggregate([
        { $match: { companyId: companyId, status: 'ACTIVE' } },
        { $group: { _id: '$departmentId', count: { $sum: 1 } } },
        {
            $lookup: { from: 'departments', localField: '_id', foreignField: '_id', as: 'department' },
        },
        { $unwind: { path: '$department', preserveNullAndEmptyArrays: true } },
        { $project: { _id: 0, department: '$department.name', count: 1 } },
    ]);
    const fromDate = from ? new Date(from) : new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const toDate = to ? new Date(to) : todayEnd;
    const weeklyAttendanceRaw = await Attendance_1.default.aggregate([
        {
            $match: {
                companyId: companyId,
                date: { $gte: fromDate, $lte: toDate },
            },
        },
        {
            $group: {
                _id: { date: { $dateToString: { format: '%Y-%m-%d', date: '$date' } }, status: '$status' },
                count: { $sum: 1 },
            },
        },
        { $sort: { '_id.date': 1 } },
    ]);
    const weeklyAttendance = {};
    weeklyAttendanceRaw.forEach(w => {
        const date = w._id.date;
        const status = w._id.status;
        if (!weeklyAttendance[date])
            weeklyAttendance[date] = {};
        weeklyAttendance[date][status] = w.count;
    });
    return {
        totalEmployees,
        presentToday,
        onLeaveToday,
        newHiresThisMonth,
        attritionRate,
        pendingLeaveRequests,
        headcountTrend,
        departmentWise,
        weeklyAttendance,
    };
};
exports.getDashboard = getDashboard;
const listEmployees = async (companyId, query) => {
    const { page, limit, skip } = (0, helpers_1.paginateQuery)(query.page, Number(query.limit));
    const filter = { companyId };
    if (query.status)
        filter.status = query.status.toUpperCase();
    if (query.departmentId)
        filter.departmentId = query.departmentId;
    if (query.designationId)
        filter.designationId = query.designationId;
    if (query.employmentType)
        filter.employmentType = query.employmentType.toUpperCase();
    if (query.search) {
        Object.assign(filter, (0, helpers_1.buildSearchQuery)(query.search, ['firstName', 'lastName', 'email', 'employeeCode']));
    }
    // Clone filter for summary aggregation, omitting status criteria so headcount counts stay visible
    const summaryFilter = { ...filter };
    delete summaryFilter.status;
    // Cast string IDs to Mongoose ObjectIds for aggregate match stage
    if (summaryFilter.companyId && typeof summaryFilter.companyId === 'string') {
        summaryFilter.companyId = new mongoose_1.default.Types.ObjectId(summaryFilter.companyId);
    }
    if (summaryFilter.departmentId && typeof summaryFilter.departmentId === 'string') {
        summaryFilter.departmentId = new mongoose_1.default.Types.ObjectId(summaryFilter.departmentId);
    }
    if (summaryFilter.designationId && typeof summaryFilter.designationId === 'string') {
        summaryFilter.designationId = new mongoose_1.default.Types.ObjectId(summaryFilter.designationId);
    }
    const [employees, total, summaryAgg] = await Promise.all([
        Employee_1.default.find(filter)
            .populate('departmentId', 'name code')
            .populate('designationId', 'name level')
            .populate('branchId', 'name')
            .populate('reportingManagerId', 'firstName lastName employeeCode')
            .populate('userId', 'email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        Employee_1.default.countDocuments(filter),
        Employee_1.default.aggregate([
            { $match: summaryFilter },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                },
            },
        ]),
    ]);
    let totalHeadcount = 0;
    let activeStaff = 0;
    let onLeave = 0;
    let inactive = 0;
    let suspended = 0;
    summaryAgg.forEach((item) => {
        const count = item.count || 0;
        totalHeadcount += count;
        const statusKey = String(item._id || '').toUpperCase();
        if (statusKey === 'ACTIVE') {
            activeStaff = count;
        }
        else if (statusKey === 'ON_LEAVE' || statusKey === 'ONLEAVE') {
            onLeave = count;
        }
        else if (statusKey === 'INACTIVE' || statusKey === 'TERMINATED') {
            inactive += count;
        }
        else if (statusKey === 'SUSPENDED') {
            suspended = count;
        }
    });
    const summary = {
        totalHeadcount,
        activeStaff,
        onLeave,
        inactive,
        suspended,
    };
    return { employees: employees.map(transformEmployee), meta: (0, helpers_1.buildMeta)(total, page, limit), summary };
};
exports.listEmployees = listEmployees;
const normalizeEmployeeData = async (companyId, inputData) => {
    const data = { ...inputData };
    if (data.employeeId && !data.employeeCode) {
        data.employeeCode = data.employeeId;
    }
    delete data.employeeId;
    if (data.gender) {
        data.gender = data.gender.toUpperCase();
        if (!['MALE', 'FEMALE', 'OTHER'].includes(data.gender)) {
            data.gender = undefined;
        }
    }
    if (data.employmentType) {
        data.employmentType = data.employmentType.toUpperCase();
        if (!['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERN'].includes(data.employmentType)) {
            data.employmentType = 'FULL_TIME';
        }
    }
    if (data.status) {
        data.status = data.status.toUpperCase();
        if (data.status === 'ON_LEAVE') {
            data.status = 'ACTIVE';
        }
        if (!['ACTIVE', 'INACTIVE', 'TERMINATED', 'SUSPENDED'].includes(data.status)) {
            data.status = 'ACTIVE';
        }
    }
    if (!data.joiningDate && data.dateOfJoining) {
        data.joiningDate = data.dateOfJoining;
    }
    delete data.dateOfJoining;
    if (typeof data.address === 'string' || data.city || data.state || data.country || data.zipCode || data.zip) {
        data.address = {
            street: typeof data.address === 'string' ? data.address : data.address?.street || '',
            city: data.city || data.address?.city || '',
            state: data.state || data.address?.state || '',
            country: data.country || data.address?.country || '',
            zip: data.zipCode || data.zip || data.address?.zip || '',
        };
        delete data.city;
        delete data.state;
        delete data.country;
        delete data.zipCode;
        delete data.zip;
    }
    if (data.managerId && !data.reportingManagerId) {
        data.reportingManagerId = data.managerId;
    }
    delete data.managerId;
    const isValidObjectId = (id) => typeof id === 'string' && /^[0-9a-fA-F]{24}$/.test(id);
    const deptMapping = {
        'dept-1': { name: 'Engineering', code: 'ENG' },
        'dept-2': { name: 'Product & Design', code: 'PROD' },
        'dept-3': { name: 'Sales & Marketing', code: 'SALES' },
        'dept-4': { name: 'Human Resources', code: 'HR' },
        'dept-5': { name: 'Finance & Legal', code: 'FIN' },
        'dept-6': { name: 'Customer Support', code: 'SUPPORT' },
    };
    if (data.departmentId) {
        if (!isValidObjectId(data.departmentId)) {
            const deptInfo = deptMapping[data.departmentId];
            if (deptInfo) {
                let dept = await Department_1.default.findOne({ code: deptInfo.code, companyId });
                if (!dept) {
                    dept = await Department_1.default.create({
                        name: deptInfo.name,
                        code: deptInfo.code,
                        companyId,
                        description: `${deptInfo.name} Department`,
                    });
                }
                data.departmentId = dept._id;
            }
            else {
                delete data.departmentId;
            }
        }
    }
    if (data.designation && !data.designationId) {
        let desig = await Designation_1.default.findOne({ name: data.designation, companyId });
        if (!desig) {
            desig = await Designation_1.default.create({
                name: data.designation,
                companyId,
                level: 1,
                description: `${data.designation} Designation`,
            });
        }
        data.designationId = desig._id;
    }
    delete data.designation;
    if (data.designationId && !isValidObjectId(String(data.designationId))) {
        delete data.designationId;
    }
    if (data.branchId && !isValidObjectId(data.branchId)) {
        delete data.branchId;
    }
    if (data.reportingManagerId && !isValidObjectId(data.reportingManagerId)) {
        delete data.reportingManagerId;
    }
    return data;
};
const createEmployee = async (companyId, rawData) => {
    const data = await normalizeEmployeeData(companyId, rawData);
    const existing = await Employee_1.default.findOne({ email: data.email });
    if (existing)
        throw new appError_1.default(409, 'CONFLICT', 'Employee with this email already exists');
    if (!data.employeeCode) {
        const count = await Employee_1.default.countDocuments({ companyId });
        data.employeeCode = `EMP-${(count + 1).toString().padStart(4, '0')}`;
    }
    else {
        const codeExists = await Employee_1.default.findOne({ employeeCode: data.employeeCode, companyId });
        if (codeExists)
            throw new appError_1.default(409, 'CONFLICT', 'Employee code already exists');
    }
    const employee = await Employee_1.default.create({ ...data, companyId });
    const populated = await Employee_1.default.findById(employee._id)
        .populate('departmentId', 'name code')
        .populate('designationId', 'name level')
        .populate('branchId', 'name')
        .populate('reportingManagerId', 'firstName lastName employeeCode')
        .populate('userId', 'email');
    return transformEmployee(populated.toObject());
};
exports.createEmployee = createEmployee;
const getEmployeeById = async (companyId, id) => {
    const employee = await Employee_1.default.findOne({ _id: id, companyId })
        .populate('departmentId', 'name code')
        .populate('designationId', 'name level')
        .populate('branchId', 'name')
        .populate('reportingManagerId', 'firstName lastName employeeCode')
        .populate('userId', 'email');
    if (!employee)
        throw new appError_1.default(404, 'NOT_FOUND', 'Employee not found');
    return transformEmployee(employee.toObject());
};
exports.getEmployeeById = getEmployeeById;
const updateEmployee = async (companyId, id, rawData) => {
    const data = await normalizeEmployeeData(companyId, rawData);
    if (data.email) {
        const existing = await Employee_1.default.findOne({ email: data.email, _id: { $ne: id } });
        if (existing)
            throw new appError_1.default(409, 'CONFLICT', 'Email already in use');
    }
    const employee = await Employee_1.default.findOneAndUpdate({ _id: id, companyId }, data, {
        new: true,
        runValidators: true,
    });
    if (!employee)
        throw new appError_1.default(404, 'NOT_FOUND', 'Employee not found');
    const populated = await Employee_1.default.findById(employee._id)
        .populate('departmentId', 'name code')
        .populate('designationId', 'name level')
        .populate('branchId', 'name')
        .populate('reportingManagerId', 'firstName lastName employeeCode')
        .populate('userId', 'email');
    return transformEmployee(populated.toObject());
};
exports.updateEmployee = updateEmployee;
const removeEmployee = async (companyId, id) => {
    const employee = await Employee_1.default.findOneAndUpdate({ _id: id, companyId }, { status: 'INACTIVE', exitDate: new Date() }, { new: true });
    if (!employee)
        throw new appError_1.default(404, 'NOT_FOUND', 'Employee not found');
    const populated = await Employee_1.default.findById(employee._id)
        .populate('departmentId', 'name code')
        .populate('designationId', 'name level')
        .populate('branchId', 'name')
        .populate('reportingManagerId', 'firstName lastName employeeCode')
        .populate('userId', 'email');
    return transformEmployee(populated.toObject());
};
exports.removeEmployee = removeEmployee;
const hardDeleteEmployee = async (companyId, id) => {
    const employee = await Employee_1.default.findOne({ _id: id, companyId });
    if (!employee)
        throw new appError_1.default(404, 'NOT_FOUND', 'Employee not found');
    if (employee.status === 'ACTIVE') {
        throw new appError_1.default(400, 'BAD_REQUEST', 'Cannot permanently delete an active employee. Deactivate first.');
    }
    await Promise.all([
        Attendance_1.default.deleteMany({ employeeId: id }),
        LeaveRequest_1.default.deleteMany({ employeeId: id }),
        LeaveBalance_1.default.deleteMany({ employeeId: id }),
        Payslip_1.default.deleteMany({ employeeId: id }),
        SalaryStructure_1.default.deleteMany({ employeeId: id }),
        AssetAssignment_1.default.deleteMany({ employeeId: id }),
    ]);
    await Employee_1.default.findOneAndDelete({ _id: id, companyId });
    return { message: 'Employee permanently deleted', employeeId: id };
};
exports.hardDeleteEmployee = hardDeleteEmployee;
const activateEmployee = async (companyId, id) => {
    const employee = await Employee_1.default.findOneAndUpdate({ _id: id, companyId }, { status: 'ACTIVE', $unset: { exitDate: 1 } }, { new: true });
    if (!employee)
        throw new appError_1.default(404, 'NOT_FOUND', 'Employee not found');
    const populated = await Employee_1.default.findById(employee._id)
        .populate('departmentId', 'name code')
        .populate('designationId', 'name level')
        .populate('branchId', 'name')
        .populate('reportingManagerId', 'firstName lastName employeeCode')
        .populate('userId', 'email');
    return transformEmployee(populated.toObject());
};
exports.activateEmployee = activateEmployee;
const suspendEmployee = async (companyId, id, userId, data) => {
    const employee = await Employee_1.default.findOne({ _id: id, companyId });
    if (!employee)
        throw new appError_1.default(404, 'NOT_FOUND', 'Employee not found');
    if (employee.status === 'SUSPENDED')
        throw new appError_1.default(400, 'BAD_REQUEST', 'Employee is already suspended');
    const reason = data.reason || '';
    if (!reason || reason.trim().length < 10) {
        throw new appError_1.default(400, 'BAD_REQUEST', 'Suspension reason is required and must be at least 10 characters');
    }
    employee.status = 'SUSPENDED';
    employee.suspensionDetails = {
        reason: reason.trim(),
        suspendedBy: new mongoose_1.default.Types.ObjectId(userId),
        suspendedAt: new Date(),
        expectedReinstatement: data.expectedReinstatement ? new Date(data.expectedReinstatement) : undefined,
        notes: data.notes || undefined,
    };
    await employee.save();
    const populated = await Employee_1.default.findById(employee._id)
        .populate('departmentId', 'name code')
        .populate('designationId', 'name level')
        .populate('branchId', 'name')
        .populate('reportingManagerId', 'firstName lastName employeeCode')
        .populate('userId', 'email');
    return transformEmployee(populated.toObject());
};
exports.suspendEmployee = suspendEmployee;
const reinstateEmployee = async (companyId, id, userId, data) => {
    const employee = await Employee_1.default.findOne({ _id: id, companyId });
    if (!employee)
        throw new appError_1.default(404, 'NOT_FOUND', 'Employee not found');
    if (employee.status !== 'SUSPENDED')
        throw new appError_1.default(400, 'BAD_REQUEST', 'Employee is not suspended');
    const currentDetails = employee.suspensionDetails;
    if (currentDetails) {
        const historyEntry = {
            reason: currentDetails.reason,
            suspendedBy: currentDetails.suspendedBy,
            suspendedAt: currentDetails.suspendedAt,
            reinstatedBy: new mongoose_1.default.Types.ObjectId(userId),
            reinstatedAt: new Date(),
            expectedReinstatement: currentDetails.expectedReinstatement,
            notes: data.notes || currentDetails.notes,
        };
        employee.suspensionHistory = employee.suspensionHistory || [];
        employee.suspensionHistory.push(historyEntry);
    }
    employee.status = 'ACTIVE';
    employee.suspensionDetails = null;
    await employee.save();
    const populated = await Employee_1.default.findById(employee._id)
        .populate('departmentId', 'name code')
        .populate('designationId', 'name level')
        .populate('branchId', 'name')
        .populate('reportingManagerId', 'firstName lastName employeeCode')
        .populate('userId', 'email');
    return transformEmployee(populated.toObject());
};
exports.reinstateEmployee = reinstateEmployee;
const bulkImportEmployees = async (companyId, employeesData) => {
    const errors = [];
    const valid = [];
    // Helper function to normalize keys
    const normalizeKey = (key) => {
        return key.toLowerCase().replace(/[^a-z0-9]/g, '');
    };
    // Fetch existing departments and designations for lookup
    const departments = await Department_1.default.find({ companyId }).lean();
    const departmentMap = new Map();
    departments.forEach(dept => {
        departmentMap.set(dept.name.toLowerCase(), dept);
        if (dept.code) {
            departmentMap.set(dept.code.toLowerCase(), dept);
        }
        departmentMap.set(dept._id.toString(), dept);
    });
    const designations = await Designation_1.default.find({ companyId, deletedAt: null }).lean();
    const designationMap = new Map();
    designations.forEach(desig => {
        designationMap.set(desig.name.toLowerCase(), desig);
        if (desig.designationCode) {
            designationMap.set(desig.designationCode.toLowerCase(), desig);
        }
        designationMap.set(desig._id.toString(), desig);
    });
    // Fetch existing employees to verify email & employee code uniqueness
    const existingEmployees = await Employee_1.default.find({ companyId }, '_id employeeCode email').lean();
    const existingCodes = new Set(existingEmployees.map(emp => emp.employeeCode.toLowerCase()));
    const existingEmails = new Set(existingEmployees.map(emp => emp.email.toLowerCase()));
    // Map existing employees for manager lookup
    const employeeMap = new Map();
    existingEmployees.forEach(emp => {
        employeeMap.set(emp._id.toString(), emp);
        if (emp.employeeCode) {
            employeeMap.set(emp.employeeCode.toLowerCase(), emp);
        }
        if (emp.email) {
            employeeMap.set(emp.email.toLowerCase(), emp);
        }
    });
    // Tracking unique values in the current CSV
    const csvCodes = new Set();
    const csvEmails = new Set();
    for (let i = 0; i < employeesData.length; i++) {
        const row = employeesData[i];
        const rowNum = i + 1;
        try {
            // Map row keys to standard keys
            const mappedRow = {};
            for (const [key, val] of Object.entries(row)) {
                const normKey = normalizeKey(key);
                const strVal = typeof val === 'string' ? val.trim() : (val !== null && val !== undefined ? String(val).trim() : '');
                if (normKey === 'employeecode' || normKey === 'code') {
                    mappedRow.employeeCode = strVal;
                }
                else if (normKey === 'firstname' || normKey === 'fname') {
                    mappedRow.firstName = strVal;
                }
                else if (normKey === 'lastname' || normKey === 'lname') {
                    mappedRow.lastName = strVal;
                }
                else if (normKey === 'email') {
                    mappedRow.email = strVal;
                }
                else if (normKey === 'designation' || normKey === 'designationname' || normKey === 'designationcode') {
                    mappedRow.designation = strVal;
                }
                else if (normKey === 'employmenttype' || normKey === 'type') {
                    mappedRow.employmentType = strVal;
                }
                else if (normKey === 'phone' || normKey === 'phonenumber') {
                    mappedRow.phone = strVal;
                }
                else if (normKey === 'department' || normKey === 'departmentname' || normKey === 'departmentcode' || normKey === 'departmentid') {
                    mappedRow.department = strVal;
                }
                else if (normKey === 'manager' || normKey === 'managerid' || normKey === 'reportingmanager' || normKey === 'reportingmanagerid') {
                    mappedRow.manager = strVal;
                }
                else if (normKey === 'dateofjoining' || normKey === 'joiningdate' || normKey === 'date') {
                    mappedRow.joiningDate = strVal;
                }
                else {
                    mappedRow[normKey] = strVal;
                }
            }
            // 1. Validate employeeCode (required, unique)
            if (!mappedRow.employeeCode) {
                throw new Error('Employee Code is required');
            }
            const codeLower = mappedRow.employeeCode.toLowerCase();
            if (csvCodes.has(codeLower)) {
                throw new Error(`Duplicate Employee Code "${mappedRow.employeeCode}" in CSV`);
            }
            if (existingCodes.has(codeLower)) {
                throw new Error(`Employee Code "${mappedRow.employeeCode}" already exists in database`);
            }
            csvCodes.add(codeLower);
            // 2. Validate firstName (required, non-empty)
            if (!mappedRow.firstName) {
                throw new Error('First Name is required');
            }
            // 3. Validate lastName (required, non-empty)
            if (!mappedRow.lastName) {
                throw new Error('Last Name is required');
            }
            // 4. Validate email (required, valid format, unique)
            if (!mappedRow.email) {
                throw new Error('Email is required');
            }
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(mappedRow.email)) {
                throw new Error(`Invalid email format: "${mappedRow.email}"`);
            }
            const emailLower = mappedRow.email.toLowerCase();
            if (csvEmails.has(emailLower)) {
                throw new Error(`Duplicate email "${mappedRow.email}" in CSV`);
            }
            if (existingEmails.has(emailLower)) {
                throw new Error(`Email "${mappedRow.email}" already exists in database`);
            }
            csvEmails.add(emailLower);
            // 5. Validate designation (required, must exist in DB)
            if (!mappedRow.designation) {
                throw new Error('Designation is required');
            }
            const desigMatch = designationMap.get(mappedRow.designation.toLowerCase());
            if (!desigMatch) {
                throw new Error(`Designation "${mappedRow.designation}" not found`);
            }
            const designationId = desigMatch._id;
            // 6. Validate employmentType (required, must map to valid enum)
            if (!mappedRow.employmentType) {
                throw new Error('Employment Type is required');
            }
            const typeLower = mappedRow.employmentType.toLowerCase().replace(/[^a-z]/g, '');
            let employmentType;
            if (typeLower === 'fulltime' || typeLower === 'full') {
                employmentType = 'FULL_TIME';
            }
            else if (typeLower === 'parttime' || typeLower === 'part') {
                employmentType = 'PART_TIME';
            }
            else if (typeLower === 'contract') {
                employmentType = 'CONTRACT';
            }
            else if (typeLower === 'intern') {
                employmentType = 'INTERN';
            }
            else {
                throw new Error(`Invalid Employment Type: "${mappedRow.employmentType}". Allowed: Full-Time, Part-Time, Contract`);
            }
            // 7. Resolve optional departmentId
            let departmentId = null;
            if (mappedRow.department) {
                const deptMatch = departmentMap.get(mappedRow.department.toLowerCase());
                if (!deptMatch) {
                    throw new Error(`Department "${mappedRow.department}" not found`);
                }
                departmentId = deptMatch._id;
            }
            // 8. Resolve optional managerId
            let reportingManagerId = null;
            if (mappedRow.manager) {
                const managerMatch = employeeMap.get(mappedRow.manager.toLowerCase());
                if (!managerMatch) {
                    throw new Error(`Reporting Manager "${mappedRow.manager}" not found`);
                }
                reportingManagerId = managerMatch._id;
            }
            // 9. Resolve optional dateOfJoining
            let joiningDate = new Date();
            if (mappedRow.joiningDate) {
                const parsedDate = new Date(mappedRow.joiningDate);
                if (isNaN(parsedDate.getTime())) {
                    throw new Error(`Invalid Joining Date format: "${mappedRow.joiningDate}"`);
                }
                joiningDate = parsedDate;
            }
            valid.push({
                employeeCode: mappedRow.employeeCode,
                firstName: mappedRow.firstName,
                lastName: mappedRow.lastName,
                email: mappedRow.email,
                designationId,
                employmentType,
                phone: mappedRow.phone || undefined,
                departmentId,
                reportingManagerId,
                joiningDate,
                companyId,
                status: 'ACTIVE',
            });
        }
        catch (err) {
            errors.push({ row: rowNum, message: err.message });
        }
    }
    if (errors.length > 0) {
        console.error('HRMS Bulk Import Validation Errors:');
        errors.forEach(err => {
            console.error(`Row ${err.row}: ${err.message}`);
        });
        return { inserted: 0, failed: errors.length, errors };
    }
    let createdCount = 0;
    if (valid.length > 0) {
        const created = await Employee_1.default.insertMany(valid, { ordered: true });
        createdCount = created.length;
        console.log(`Successfully bulk imported ${createdCount} employees`);
    }
    return { inserted: createdCount, failed: 0, errors: [] };
};
exports.bulkImportEmployees = bulkImportEmployees;
const exportEmployees = async (companyId, query) => {
    const filter = { companyId, status: 'ACTIVE' };
    if (query.departmentId)
        filter.departmentId = query.departmentId;
    if (query.designationId)
        filter.designationId = query.designationId;
    return Employee_1.default.find(filter)
        .populate('departmentId', 'name')
        .populate('designationId', 'name')
        .sort({ firstName: 1 })
        .lean();
};
exports.exportEmployees = exportEmployees;
const listDepartments = async (companyId) => {
    const departments = await Department_1.default.find({ companyId }).populate('headId', 'firstName lastName').lean();
    const employeeCounts = await Employee_1.default.aggregate([
        { $match: { companyId: companyId, status: 'ACTIVE' } },
        { $group: { _id: '$departmentId', count: { $sum: 1 } } },
    ]);
    const countMap = {};
    employeeCounts.forEach(e => { countMap[String(e._id)] = e.count; });
    const deptMap = {};
    departments.forEach(d => {
        const id = String(d._id);
        deptMap[id] = { ...d, employeeCount: countMap[id] || 0, children: [] };
    });
    const roots = [];
    departments.forEach(d => {
        const id = String(d._id);
        const node = deptMap[id];
        const parentKey = String(d.parentId);
        if (d.parentId && deptMap[parentKey]) {
            deptMap[parentKey].children.push(node);
        }
        else {
            roots.push(node);
        }
    });
    return roots;
};
exports.listDepartments = listDepartments;
const createDepartment = async (companyId, data) => {
    const existing = await Department_1.default.findOne({ code: data.code, companyId });
    if (existing)
        throw new appError_1.default(409, 'CONFLICT', 'Department code already exists');
    const department = await Department_1.default.create({ ...data, companyId });
    return department;
};
exports.createDepartment = createDepartment;
const updateDepartment = async (companyId, id, data) => {
    if (data.code) {
        const existing = await Department_1.default.findOne({ code: data.code, companyId, _id: { $ne: id } });
        if (existing)
            throw new appError_1.default(409, 'CONFLICT', 'Department code already in use');
    }
    const department = await Department_1.default.findOneAndUpdate({ _id: id, companyId }, data, {
        new: true,
        runValidators: true,
    });
    if (!department)
        throw new appError_1.default(404, 'NOT_FOUND', 'Department not found');
    return department;
};
exports.updateDepartment = updateDepartment;
const removeDepartment = async (companyId, id) => {
    const activeCount = await Employee_1.default.countDocuments({ departmentId: id, companyId, status: 'ACTIVE' });
    if (activeCount > 0)
        throw new appError_1.default(400, 'BAD_REQUEST', 'Cannot delete department with active employees');
    const childCount = await Department_1.default.countDocuments({ parentId: id, companyId, isActive: true });
    if (childCount > 0)
        throw new appError_1.default(400, 'BAD_REQUEST', 'Cannot delete department with child departments');
    const department = await Department_1.default.findOneAndUpdate({ _id: id, companyId }, { isActive: false }, { new: true });
    if (!department)
        throw new appError_1.default(404, 'NOT_FOUND', 'Department not found');
    return department;
};
exports.removeDepartment = removeDepartment;
const listDepartmentEmployees = async (companyId, id, query) => {
    const { page, limit, skip } = (0, helpers_1.paginateQuery)(query.page, Number(query.limit));
    const filter = { companyId, departmentId: id, status: 'ACTIVE' };
    if (query.search) {
        Object.assign(filter, (0, helpers_1.buildSearchQuery)(query.search, ['firstName', 'lastName', 'email', 'employeeCode']));
    }
    const [employees, total] = await Promise.all([
        Employee_1.default.find(filter)
            .populate('designationId', 'name level')
            .sort({ firstName: 1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        Employee_1.default.countDocuments(filter),
    ]);
    return { employees, meta: (0, helpers_1.buildMeta)(total, page, limit) };
};
exports.listDepartmentEmployees = listDepartmentEmployees;
const listDesignations = async (companyId, query) => {
    const { page, limit, skip } = (0, helpers_1.paginateQuery)(query.page, Number(query.limit));
    const filter = { companyId, deletedAt: null };
    if (query.search) {
        const searchRegex = new RegExp(String(query.search), 'i');
        filter.$or = [
            { name: searchRegex },
            { designationCode: searchRegex },
        ];
    }
    if (query.departmentId)
        filter.departmentId = query.departmentId;
    if (query.status)
        filter.status = query.status;
    if (query.isActive !== undefined)
        filter.isActive = query.isActive === 'true' || query.isActive === true;
    const sortField = query.sortBy || 'hierarchyOrder';
    const sortOrder = query.sortOrder === 'desc' ? -1 : 1;
    const [designations, total] = await Promise.all([
        Designation_1.default.find(filter)
            .sort({ [sortField]: sortOrder })
            .skip(skip)
            .limit(limit)
            .populate('departmentId', 'name')
            .populate('createdBy', 'firstName lastName')
            .populate('updatedBy', 'firstName lastName')
            .lean(),
        Designation_1.default.countDocuments(filter),
    ]);
    const meta = (0, helpers_1.buildMeta)(total, page, limit);
    return { data: designations, meta };
};
exports.listDesignations = listDesignations;
const listAllDesignations = async (companyId) => {
    return Designation_1.default.find({ companyId, deletedAt: null })
        .sort({ hierarchyOrder: 1, level: 1 })
        .populate('departmentId', 'name')
        .lean();
};
exports.listAllDesignations = listAllDesignations;
const getDesignationById = async (companyId, id) => {
    const designation = await Designation_1.default.findOne({ _id: id, companyId, deletedAt: null })
        .populate('departmentId', 'name')
        .populate('createdBy', 'firstName lastName')
        .populate('updatedBy', 'firstName lastName')
        .lean();
    if (!designation)
        throw new appError_1.default(404, 'NOT_FOUND', 'Designation not found');
    return designation;
};
exports.getDesignationById = getDesignationById;
const createDesignation = async (companyId, data, userId) => {
    const existing = await Designation_1.default.findOne({
        name: data.name,
        companyId,
        deletedAt: null,
    });
    if (existing)
        throw new appError_1.default(409, 'CONFLICT', 'Designation name already exists in this company');
    if (data.departmentId) {
        const dept = await Department_1.default.findById(data.departmentId);
        if (!dept)
            throw new appError_1.default(404, 'NOT_FOUND', 'Department not found');
    }
    if (data.designationCode) {
        const codeExists = await Designation_1.default.findOne({
            designationCode: data.designationCode,
            companyId,
            deletedAt: null,
        });
        if (codeExists)
            throw new appError_1.default(409, 'CONFLICT', 'Designation code already exists');
    }
    const designation = await Designation_1.default.create({
        ...data,
        companyId,
        createdBy: userId,
        updatedBy: userId,
    });
    return designation;
};
exports.createDesignation = createDesignation;
const updateDesignation = async (companyId, id, data, userId) => {
    const existing = await Designation_1.default.findOne({ _id: id, companyId, deletedAt: null });
    if (!existing)
        throw new appError_1.default(404, 'NOT_FOUND', 'Designation not found');
    if (data.name) {
        const nameExists = await Designation_1.default.findOne({
            name: data.name,
            companyId,
            _id: { $ne: id },
            deletedAt: null,
        });
        if (nameExists)
            throw new appError_1.default(409, 'CONFLICT', 'Designation name already in use');
    }
    if (data.designationCode) {
        const codeExists = await Designation_1.default.findOne({
            designationCode: data.designationCode,
            companyId,
            _id: { $ne: id },
            deletedAt: null,
        });
        if (codeExists)
            throw new appError_1.default(409, 'CONFLICT', 'Designation code already in use');
    }
    if (data.departmentId) {
        const dept = await Department_1.default.findById(data.departmentId);
        if (!dept)
            throw new appError_1.default(404, 'NOT_FOUND', 'Department not found');
    }
    const designation = await Designation_1.default.findOneAndUpdate({ _id: id, companyId, deletedAt: null }, { ...data, updatedBy: userId }, { new: true, runValidators: true });
    if (!designation)
        throw new appError_1.default(404, 'NOT_FOUND', 'Designation not found');
    return designation;
};
exports.updateDesignation = updateDesignation;
const removeDesignation = async (companyId, id, force) => {
    const activeCount = await Employee_1.default.countDocuments({ designationId: id, companyId, status: { $in: ['ACTIVE', 'active'] } });
    if (activeCount > 0 && !force) {
        throw new appError_1.default(400, 'BAD_REQUEST', `Cannot delete designation with ${activeCount} active employee(s). Use force=true to override.`);
    }
    const designation = await Designation_1.default.findOneAndUpdate({ _id: id, companyId, deletedAt: null }, { deletedAt: new Date(), isActive: false }, { new: true });
    if (!designation)
        throw new appError_1.default(404, 'NOT_FOUND', 'Designation not found');
    return designation;
};
exports.removeDesignation = removeDesignation;
const restoreDesignation = async (companyId, id) => {
    const designation = await Designation_1.default.findOneAndUpdate({ _id: id, companyId, deletedAt: { $ne: null } }, { deletedAt: null, isActive: true }, { new: true });
    if (!designation)
        throw new appError_1.default(404, 'NOT_FOUND', 'Designation not found or not deleted');
    return designation;
};
exports.restoreDesignation = restoreDesignation;
const bulkDeleteDesignations = async (companyId, ids, force) => {
    const activeEmployees = await Employee_1.default.countDocuments({
        designationId: { $in: ids },
        companyId,
        status: { $in: ['ACTIVE', 'active'] },
    });
    if (activeEmployees > 0 && !force) {
        throw new appError_1.default(400, 'BAD_REQUEST', `${activeEmployees} active employee(s) have these designations. Use force=true to override.`);
    }
    const result = await Designation_1.default.updateMany({ _id: { $in: ids }, companyId, deletedAt: null }, { $set: { deletedAt: new Date(), isActive: false } });
    return { modifiedCount: result.modifiedCount };
};
exports.bulkDeleteDesignations = bulkDeleteDesignations;
const bulkRestoreDesignations = async (companyId, ids) => {
    const result = await Designation_1.default.updateMany({ _id: { $in: ids }, companyId, deletedAt: { $ne: null } }, { $set: { deletedAt: null, isActive: true } });
    return { modifiedCount: result.modifiedCount };
};
exports.bulkRestoreDesignations = bulkRestoreDesignations;
const changeDesignationStatus = async (companyId, id, status, userId) => {
    const designation = await Designation_1.default.findOneAndUpdate({ _id: id, companyId, deletedAt: null }, { status, updatedBy: userId }, { new: true });
    if (!designation)
        throw new appError_1.default(404, 'NOT_FOUND', 'Designation not found');
    return designation;
};
exports.changeDesignationStatus = changeDesignationStatus;
const exportDesignationsCSV = async (companyId, filter) => {
    const query = { companyId, deletedAt: null };
    if (filter.departmentId)
        query.departmentId = filter.departmentId;
    if (filter.status)
        query.status = filter.status;
    const designations = await Designation_1.default.find(query)
        .populate('departmentId', 'name')
        .sort({ hierarchyOrder: 1 })
        .lean();
    const header = 'Name,Code,Department,Level,Status,Hierarchy Order,Employment Types\n';
    const rows = designations.map((d) => `"${d.name || ''}","${d.designationCode || ''}","${d.departmentId?.name || ''}",${d.level ?? ''},${d.status || 'ACTIVE'},${d.hierarchyOrder ?? ''},"${Array.isArray(d.employmentTypes) ? d.employmentTypes.join('; ') : ''}"`).join('\n');
    return header + rows;
};
exports.exportDesignationsCSV = exportDesignationsCSV;
const exportDesignationsExcel = async (companyId, filter) => {
    const query = { companyId, deletedAt: null };
    if (filter.departmentId)
        query.departmentId = filter.departmentId;
    if (filter.status)
        query.status = filter.status;
    const designations = await Designation_1.default.find(query)
        .populate('departmentId', 'name')
        .sort({ hierarchyOrder: 1 })
        .lean();
    return designations.map((d) => ({
        Name: d.name || '',
        Code: d.designationCode || '',
        Department: d.departmentId?.name || '',
        Level: d.level ?? '',
        Status: d.status || 'ACTIVE',
        'Hierarchy Order': d.hierarchyOrder ?? '',
        'Employment Types': Array.isArray(d.employmentTypes) ? d.employmentTypes.join('; ') : '',
    }));
};
exports.exportDesignationsExcel = exportDesignationsExcel;
const listAttendance = async (companyId, query) => {
    const { page, limit, skip } = (0, helpers_1.paginateQuery)(query.page, Number(query.limit));
    const filter = { companyId };
    if (query.employeeId)
        filter.employeeId = query.employeeId;
    if (query.status)
        filter.status = query.status;
    if (query.date) {
        const d = new Date(query.date);
        filter.date = { $gte: new Date(d.setHours(0, 0, 0, 0)), $lte: new Date(d.setHours(23, 59, 59, 999)) };
    }
    if (query.fromDate || query.toDate) {
        filter.date = {};
        if (query.fromDate)
            filter.date.$gte = new Date(query.fromDate);
        if (query.toDate)
            filter.date.$lte = new Date(query.toDate);
    }
    const [records, total] = await Promise.all([
        Attendance_1.default.find(filter)
            .populate('employeeId', 'firstName lastName employeeCode departmentId')
            .sort({ date: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        Attendance_1.default.countDocuments(filter),
    ]);
    return { records, meta: (0, helpers_1.buildMeta)(total, page, limit) };
};
exports.listAttendance = listAttendance;
const createAttendance = async (companyId, data) => {
    const existing = await Attendance_1.default.findOne({ employeeId: data.employeeId, date: data.date });
    if (existing)
        throw new appError_1.default(409, 'CONFLICT', 'Attendance already exists for this employee on this date');
    const workingHours = data.checkIn && data.checkOut
        ? (0, helpers_1.calculateWorkingHours)(data.checkIn, data.checkOut)
        : 0;
    const record = await Attendance_1.default.create({ ...data, companyId, workingHours });
    return record;
};
exports.createAttendance = createAttendance;
const updateAttendance = async (companyId, id, data) => {
    const workingHours = data.checkIn && data.checkOut
        ? (0, helpers_1.calculateWorkingHours)(data.checkIn, data.checkOut)
        : undefined;
    const updateData = { ...data };
    if (workingHours !== undefined)
        updateData.workingHours = workingHours;
    const record = await Attendance_1.default.findOneAndUpdate({ _id: id, companyId }, updateData, {
        new: true,
        runValidators: true,
    });
    if (!record)
        throw new appError_1.default(404, 'NOT_FOUND', 'Attendance record not found');
    return record;
};
exports.updateAttendance = updateAttendance;
const getAttendanceById = async (companyId, id) => {
    const record = await Attendance_1.default.findOne({ _id: id, companyId })
        .populate('employeeId', 'firstName lastName employeeCode departmentId')
        .lean();
    if (!record)
        throw new appError_1.default(404, 'NOT_FOUND', 'Attendance record not found');
    return record;
};
exports.getAttendanceById = getAttendanceById;
const getAttendanceSummary = async (companyId, query) => {
    const { fromDate, toDate, employeeId } = query;
    const match = { companyId };
    if (employeeId)
        match.employeeId = employeeId;
    if (fromDate || toDate) {
        match.date = {};
        if (fromDate)
            match.date.$gte = new Date(fromDate);
        if (toDate)
            match.date.$lte = new Date(toDate);
    }
    const summary = await Attendance_1.default.aggregate([
        { $match: match },
        {
            $group: {
                _id: employeeId ? '$employeeId' : null,
                totalPresent: { $sum: { $cond: [{ $eq: ['$status', 'PRESENT'] }, 1, 0] } },
                totalAbsent: { $sum: { $cond: [{ $eq: ['$status', 'ABSENT'] }, 1, 0] } },
                totalLate: { $sum: { $cond: [{ $eq: ['$status', 'LATE'] }, 1, 0] } },
                totalHalfDay: { $sum: { $cond: [{ $eq: ['$status', 'HALF_DAY'] }, 1, 0] } },
                totalOnLeave: { $sum: { $cond: [{ $eq: ['$status', 'ON_LEAVE'] }, 1, 0] } },
                totalWorkingHours: { $sum: '$workingHours' },
                totalOvertime: { $sum: '$overtime' },
            },
        },
    ]);
    if (employeeId && summary.length > 0) {
        const emp = await Employee_1.default.findById(employeeId).select('firstName lastName employeeCode').lean();
        return { employee: emp, ...summary[0] };
    }
    return summary[0] || {};
};
exports.getAttendanceSummary = getAttendanceSummary;
const bulkCreateAttendance = async (companyId, data) => {
    const { date, entries } = data;
    const results = { created: 0, skipped: 0, errors: [] };
    for (const entry of entries) {
        try {
            const existing = await Attendance_1.default.findOne({ employeeId: entry.employeeId, date });
            if (existing) {
                results.skipped++;
                continue;
            }
            const workingHours = entry.checkIn && entry.checkOut
                ? (0, helpers_1.calculateWorkingHours)(entry.checkIn, entry.checkOut)
                : 0;
            await Attendance_1.default.create({ ...entry, date, companyId, workingHours });
            results.created++;
        }
        catch (err) {
            results.errors.push({ employeeId: entry.employeeId, message: err.message });
        }
    }
    return results;
};
exports.bulkCreateAttendance = bulkCreateAttendance;
const exportAttendance = async (companyId, query) => {
    const filter = { companyId };
    if (query.fromDate || query.toDate) {
        filter.date = {};
        if (query.fromDate)
            filter.date.$gte = new Date(query.fromDate);
        if (query.toDate)
            filter.date.$lte = new Date(query.toDate);
    }
    if (query.employeeId)
        filter.employeeId = query.employeeId;
    return Attendance_1.default.find(filter)
        .populate('employeeId', 'firstName lastName employeeCode')
        .sort({ date: -1 })
        .lean();
};
exports.exportAttendance = exportAttendance;
const listLeaveTypes = async (companyId) => {
    return LeaveType_1.default.find({ companyId }).lean();
};
exports.listLeaveTypes = listLeaveTypes;
const createLeaveType = async (companyId, data) => {
    const existing = await LeaveType_1.default.findOne({ code: data.code, companyId });
    if (existing)
        throw new appError_1.default(409, 'CONFLICT', 'Leave type code already exists');
    return LeaveType_1.default.create({ ...data, companyId });
};
exports.createLeaveType = createLeaveType;
const updateLeaveType = async (companyId, id, data) => {
    if (data.code) {
        const existing = await LeaveType_1.default.findOne({ code: data.code, companyId, _id: { $ne: id } });
        if (existing)
            throw new appError_1.default(409, 'CONFLICT', 'Leave type code already in use');
    }
    const leaveType = await LeaveType_1.default.findOneAndUpdate({ _id: id, companyId }, data, {
        new: true,
        runValidators: true,
    });
    if (!leaveType)
        throw new appError_1.default(404, 'NOT_FOUND', 'Leave type not found');
    return leaveType;
};
exports.updateLeaveType = updateLeaveType;
const removeLeaveType = async (companyId, id) => {
    const pendingRequests = await LeaveRequest_1.default.countDocuments({ leaveTypeId: id, companyId, status: 'PENDING' });
    if (pendingRequests > 0)
        throw new appError_1.default(400, 'BAD_REQUEST', 'Cannot delete leave type with pending requests');
    const leaveType = await LeaveType_1.default.findOneAndUpdate({ _id: id, companyId }, { isActive: false }, { new: true });
    if (!leaveType)
        throw new appError_1.default(404, 'NOT_FOUND', 'Leave type not found');
    return leaveType;
};
exports.removeLeaveType = removeLeaveType;
const listLeaveRequests = async (companyId, query) => {
    const { page, limit, skip } = (0, helpers_1.paginateQuery)(query.page, Number(query.limit));
    const filter = { companyId };
    if (query.status)
        filter.status = query.status;
    if (query.employeeId)
        filter.employeeId = query.employeeId;
    if (query.leaveTypeId)
        filter.leaveTypeId = query.leaveTypeId;
    if (query.fromDate || query.toDate) {
        filter.createdAt = {};
        if (query.fromDate)
            filter.createdAt.$gte = new Date(query.fromDate);
        if (query.toDate)
            filter.createdAt.$lte = new Date(query.toDate);
    }
    const [requests, total] = await Promise.all([
        LeaveRequest_1.default.find(filter)
            .populate('employeeId', 'firstName lastName employeeCode')
            .populate('leaveTypeId', 'name code')
            .populate('approvedBy', 'email')
            .populate('rejectedBy', 'email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        LeaveRequest_1.default.countDocuments(filter),
    ]);
    return { requests, meta: (0, helpers_1.buildMeta)(total, page, limit) };
};
exports.listLeaveRequests = listLeaveRequests;
const createLeaveRequest = async (companyId, data, userId) => {
    const { leaveTypeId, fromDate, toDate, employeeId } = data;
    const leaveType = await LeaveType_1.default.findOne({ _id: leaveTypeId, companyId, isActive: true });
    if (!leaveType)
        throw new appError_1.default(404, 'NOT_FOUND', 'Leave type not found');
    const days = (0, helpers_1.calculateDaysBetween)(fromDate, toDate);
    if (days < 0.5)
        throw new appError_1.default(400, 'BAD_REQUEST', 'Leave duration must be at least 0.5 days');
    const year = new Date(fromDate).getFullYear();
    const empId = employeeId || (await getEmployeeIdFromUser(companyId, userId));
    const balance = await LeaveBalance_1.default.findOne({ employeeId: empId, leaveTypeId, year });
    if (balance && days > (balance.balance ?? 0)) {
        throw new appError_1.default(400, 'BAD_REQUEST', `Insufficient leave balance. Available: ${balance.balance}, Requested: ${days}`);
    }
    if (leaveType.requiresApproval) {
        await LeaveBalance_1.default.findOneAndUpdate({ employeeId: empId, leaveTypeId, year }, { $inc: { pending: days } }, { upsert: true });
    }
    const request = await LeaveRequest_1.default.create({
        ...data,
        employeeId: empId,
        companyId,
        days,
        status: leaveType.requiresApproval ? 'PENDING' : 'APPROVED',
        approvedBy: leaveType.requiresApproval ? undefined : userId,
        approvedAt: leaveType.requiresApproval ? undefined : new Date(),
    });
    return request;
};
exports.createLeaveRequest = createLeaveRequest;
const getLeaveRequestById = async (companyId, id) => {
    const request = await LeaveRequest_1.default.findOne({ _id: id, companyId })
        .populate('employeeId', 'firstName lastName employeeCode departmentId')
        .populate('leaveTypeId', 'name code')
        .populate('approvedBy', 'email')
        .populate('rejectedBy', 'email');
    if (!request)
        throw new appError_1.default(404, 'NOT_FOUND', 'Leave request not found');
    return request;
};
exports.getLeaveRequestById = getLeaveRequestById;
const approveLeaveRequest = async (companyId, id, userId, data) => {
    const request = await LeaveRequest_1.default.findOne({ _id: id, companyId, status: 'PENDING' });
    if (!request)
        throw new appError_1.default(404, 'NOT_FOUND', 'Leave request not found or already processed');
    const year = new Date(request.fromDate).getFullYear();
    await LeaveBalance_1.default.findOneAndUpdate({ employeeId: request.employeeId, leaveTypeId: request.leaveTypeId, year }, { $inc: { pending: -(request.days ?? 0), taken: request.days, balance: -(request.days ?? 0) } }, { upsert: true });
    request.status = 'APPROVED';
    request.approvedBy = userId;
    request.approvedAt = new Date();
    request.comments = data.comments || request.comments;
    await request.save();
    return request;
};
exports.approveLeaveRequest = approveLeaveRequest;
const rejectLeaveRequest = async (companyId, id, userId, data) => {
    const request = await LeaveRequest_1.default.findOne({ _id: id, companyId, status: 'PENDING' });
    if (!request)
        throw new appError_1.default(404, 'NOT_FOUND', 'Leave request not found or already processed');
    const year = new Date(request.fromDate).getFullYear();
    await LeaveBalance_1.default.findOneAndUpdate({ employeeId: request.employeeId, leaveTypeId: request.leaveTypeId, year }, { $inc: { pending: -(request.days ?? 0) } }, { upsert: true });
    request.status = 'REJECTED';
    request.rejectedBy = userId;
    request.rejectedAt = new Date();
    request.comments = data.comments || request.comments;
    await request.save();
    return request;
};
exports.rejectLeaveRequest = rejectLeaveRequest;
const removeLeaveRequest = async (companyId, id) => {
    const request = await LeaveRequest_1.default.findOne({ _id: id, companyId });
    if (!request)
        throw new appError_1.default(404, 'NOT_FOUND', 'Leave request not found');
    if (request.status === 'PENDING') {
        const year = new Date(request.fromDate).getFullYear();
        await LeaveBalance_1.default.findOneAndUpdate({ employeeId: request.employeeId, leaveTypeId: request.leaveTypeId, year }, { $inc: { pending: -(request.days ?? 0) } }, { upsert: true });
    }
    request.status = 'CANCELLED';
    await request.save();
    return request;
};
exports.removeLeaveRequest = removeLeaveRequest;
const getLeaveBalance = async (companyId, query) => {
    const { employeeId, year } = query;
    const filter = { companyId };
    if (employeeId)
        filter.employeeId = employeeId;
    if (year)
        filter.year = parseInt(year);
    else
        filter.year = new Date().getFullYear();
    const balances = await LeaveBalance_1.default.find(filter)
        .populate('employeeId', 'firstName lastName employeeCode')
        .populate('leaveTypeId', 'name code')
        .lean();
    return balances;
};
exports.getLeaveBalance = getLeaveBalance;
const getLeaveCalendar = async (companyId, query) => {
    const { year, month } = query;
    const filter = { companyId, status: 'APPROVED' };
    if (year && month) {
        const start = new Date(parseInt(year), parseInt(month) - 1, 1);
        const end = new Date(parseInt(year), parseInt(month), 0, 23, 59, 59, 999);
        filter.fromDate = { $lte: end };
        filter.toDate = { $gte: start };
    }
    else if (year) {
        const start = new Date(parseInt(year), 0, 1);
        const end = new Date(parseInt(year), 11, 31, 23, 59, 59, 999);
        filter.fromDate = { $lte: end };
        filter.toDate = { $gte: start };
    }
    return LeaveRequest_1.default.find(filter)
        .populate('employeeId', 'firstName lastName employeeCode')
        .populate('leaveTypeId', 'name code color')
        .sort({ fromDate: 1 })
        .lean();
};
exports.getLeaveCalendar = getLeaveCalendar;
const getEmployeeIdFromUser = async (companyId, userId) => {
    const emp = await Employee_1.default.findOne({ userId, companyId }).select('_id');
    if (!emp)
        throw new appError_1.default(404, 'NOT_FOUND', 'Employee profile not found for this user');
    return emp._id;
};
const listHolidays = async (companyId, query) => {
    const filter = { companyId };
    if (query.year) {
        const y = parseInt(query.year);
        filter.date = { $gte: new Date(y, 0, 1), $lte: new Date(y, 11, 31, 23, 59, 59, 999) };
    }
    if (query.type)
        filter.type = query.type;
    return Holiday_1.default.find(filter).sort({ date: 1 }).lean();
};
exports.listHolidays = listHolidays;
const createHoliday = async (companyId, data) => {
    const existing = await Holiday_1.default.findOne({ companyId, date: data.date });
    if (existing)
        throw new appError_1.default(409, 'CONFLICT', 'Holiday already exists on this date');
    return Holiday_1.default.create({ ...data, companyId });
};
exports.createHoliday = createHoliday;
const updateHoliday = async (companyId, id, data) => {
    if (data.date) {
        const existing = await Holiday_1.default.findOne({ companyId, date: data.date, _id: { $ne: id } });
        if (existing)
            throw new appError_1.default(409, 'CONFLICT', 'Holiday already exists on this date');
    }
    const holiday = await Holiday_1.default.findOneAndUpdate({ _id: id, companyId }, data, {
        new: true,
        runValidators: true,
    });
    if (!holiday)
        throw new appError_1.default(404, 'NOT_FOUND', 'Holiday not found');
    return holiday;
};
exports.updateHoliday = updateHoliday;
const removeHoliday = async (companyId, id) => {
    const holiday = await Holiday_1.default.findOneAndDelete({ _id: id, companyId });
    if (!holiday)
        throw new appError_1.default(404, 'NOT_FOUND', 'Holiday not found');
    return holiday;
};
exports.removeHoliday = removeHoliday;
const listPayroll = async (companyId, query) => {
    const { page, limit, skip } = (0, helpers_1.paginateQuery)(query.page, Number(query.limit));
    const filter = { companyId };
    if (query.status)
        filter.status = query.status;
    if (query.year)
        filter.year = parseInt(query.year);
    if (query.month)
        filter.month = parseInt(query.month);
    const [payrolls, total] = await Promise.all([
        Payroll_1.default.find(filter)
            .populate('processedBy', 'email')
            .sort({ year: -1, month: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        Payroll_1.default.countDocuments(filter),
    ]);
    return { payrolls, meta: (0, helpers_1.buildMeta)(total, page, limit) };
};
exports.listPayroll = listPayroll;
const runPayroll = async (companyId, data, userId) => {
    const { month, year } = data;
    const existing = await Payroll_1.default.findOne({ companyId, month, year });
    if (existing)
        throw new appError_1.default(409, 'CONFLICT', 'Payroll already exists for this period');
    const employees = await Employee_1.default.find({ companyId, status: 'ACTIVE' }).lean();
    if (employees.length === 0)
        throw new appError_1.default(400, 'BAD_REQUEST', 'No active employees found');
    const salaryStructures = await SalaryStructure_1.default.find({ companyId }).lean();
    const salaryMap = {};
    salaryStructures.forEach(ss => { salaryMap[String(ss.employeeId)] = ss; });
    const payroll = await Payroll_1.default.create({
        companyId,
        month,
        year,
        status: 'PROCESSING',
        processedBy: userId,
        processedAt: new Date(),
        totalEmployees: employees.length,
    });
    const payslips = [];
    let totalAmount = 0;
    for (const emp of employees) {
        const ss = salaryMap[String(emp._id)];
        if (!ss)
            continue;
        const grossSalary = ss.grossSalary;
        const netSalary = ss.netSalary;
        totalAmount += netSalary;
        payslips.push({
            payrollId: payroll._id,
            employeeId: emp._id,
            companyId,
            basicSalary: ss.basicSalary,
            hra: ss.hra,
            ta: ss.ta,
            da: ss.da,
            pf: ss.pf,
            esi: ss.esi,
            otherAllowances: ss.otherAllowances,
            deductions: ss.deductions,
            grossSalary,
            netSalary,
            status: 'GENERATED',
        });
    }
    if (payslips.length > 0) {
        await Payslip_1.default.insertMany(payslips);
    }
    payroll.totalAmount = totalAmount;
    payroll.status = 'PROCESSED';
    await payroll.save();
    return payroll;
};
exports.runPayroll = runPayroll;
const getPayrollById = async (companyId, id) => {
    const payroll = await Payroll_1.default.findOne({ _id: id, companyId })
        .populate('processedBy', 'email')
        .lean();
    if (!payroll)
        throw new appError_1.default(404, 'NOT_FOUND', 'Payroll not found');
    const payslips = await Payslip_1.default.find({ payrollId: id })
        .populate('employeeId', 'firstName lastName employeeCode departmentId')
        .lean();
    return { ...payroll, payslips };
};
exports.getPayrollById = getPayrollById;
const getPayslip = async (companyId, id) => {
    const payslip = await Payslip_1.default.findOne({ _id: id, companyId })
        .populate('employeeId', 'firstName lastName employeeCode departmentId designationId')
        .populate({
        path: 'payrollId',
        select: 'month year status',
    })
        .lean();
    if (!payslip)
        throw new appError_1.default(404, 'NOT_FOUND', 'Payslip not found');
    return payslip;
};
exports.getPayslip = getPayslip;
const exportPayslips = async (companyId, query) => {
    const filter = { companyId };
    if (query.payrollId)
        filter.payrollId = query.payrollId;
    if (query.employeeId)
        filter.employeeId = query.employeeId;
    return Payslip_1.default.find(filter)
        .populate('employeeId', 'firstName lastName employeeCode')
        .populate('payrollId', 'month year')
        .sort({ 'payrollId.year': -1, 'payrollId.month': -1 })
        .lean();
};
exports.exportPayslips = exportPayslips;
const getSalaryStructure = async (companyId, employeeId) => {
    const ss = await SalaryStructure_1.default.findOne({ employeeId, companyId })
        .populate('employeeId', 'firstName lastName employeeCode')
        .lean();
    if (!ss)
        throw new appError_1.default(404, 'NOT_FOUND', 'Salary structure not found');
    return ss;
};
exports.getSalaryStructure = getSalaryStructure;
const createSalaryStructure = async (companyId, data) => {
    const existing = await SalaryStructure_1.default.findOne({ employeeId: data.employeeId });
    if (existing)
        throw new appError_1.default(409, 'CONFLICT', 'Salary structure already exists for this employee');
    const otherAllowances = data.otherAllowances || [];
    const deductions = data.deductions || [];
    const totalAllowances = otherAllowances.reduce((sum, a) => sum + a.amount, 0);
    const totalDeductions = deductions.reduce((sum, d) => sum + d.amount, 0);
    const grossSalary = data.basicSalary + data.hra + data.ta + data.da + totalAllowances;
    const netSalary = grossSalary - (data.pf || 0) - (data.esi || 0) - totalDeductions;
    if (netSalary < 0)
        throw new appError_1.default(400, 'BAD_REQUEST', 'Net salary cannot be negative');
    return SalaryStructure_1.default.create({
        ...data,
        companyId,
        grossSalary,
        netSalary,
    });
};
exports.createSalaryStructure = createSalaryStructure;
const updateSalaryStructure = async (companyId, employeeId, data) => {
    const ss = await SalaryStructure_1.default.findOne({ employeeId, companyId });
    if (!ss)
        throw new appError_1.default(404, 'NOT_FOUND', 'Salary structure not found');
    const merged = { ...ss.toObject(), ...data };
    const otherAllowances = merged.otherAllowances || [];
    const deductions = merged.deductions || [];
    const totalAllowances = otherAllowances.reduce((sum, a) => sum + a.amount, 0);
    const totalDeductions = deductions.reduce((sum, d) => sum + d.amount, 0);
    const grossSalary = merged.basicSalary + merged.hra + merged.ta + merged.da + totalAllowances;
    const netSalary = grossSalary - (merged.pf || 0) - (merged.esi || 0) - totalDeductions;
    if (netSalary < 0)
        throw new appError_1.default(400, 'BAD_REQUEST', 'Net salary cannot be negative');
    const updated = await SalaryStructure_1.default.findOneAndUpdate({ employeeId, companyId }, { ...data, grossSalary, netSalary }, { new: true, runValidators: true });
    return updated;
};
exports.updateSalaryStructure = updateSalaryStructure;
const listAssets = async (companyId, query) => {
    const { page, limit, skip } = (0, helpers_1.paginateQuery)(query.page, Number(query.limit));
    const filter = { companyId };
    if (query.status)
        filter.status = query.status;
    if (query.category)
        filter.category = query.category;
    if (query.search) {
        Object.assign(filter, (0, helpers_1.buildSearchQuery)(query.search, ['name', 'code', 'serialNumber']));
    }
    const [assets, total] = await Promise.all([
        Asset_1.default.find(filter)
            .populate('currentAssigneeId', 'firstName lastName employeeCode')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        Asset_1.default.countDocuments(filter),
    ]);
    return { assets, meta: (0, helpers_1.buildMeta)(total, page, limit) };
};
exports.listAssets = listAssets;
const createAsset = async (companyId, data) => {
    const existing = await Asset_1.default.findOne({ code: data.code, companyId });
    if (existing)
        throw new appError_1.default(409, 'CONFLICT', 'Asset code already exists');
    return Asset_1.default.create({ ...data, companyId });
};
exports.createAsset = createAsset;
const updateAsset = async (companyId, id, data) => {
    if (data.code) {
        const existing = await Asset_1.default.findOne({ code: data.code, companyId, _id: { $ne: id } });
        if (existing)
            throw new appError_1.default(409, 'CONFLICT', 'Asset code already in use');
    }
    const asset = await Asset_1.default.findOneAndUpdate({ _id: id, companyId }, data, {
        new: true,
        runValidators: true,
    });
    if (!asset)
        throw new appError_1.default(404, 'NOT_FOUND', 'Asset not found');
    return asset;
};
exports.updateAsset = updateAsset;
const removeAsset = async (companyId, id) => {
    const asset = await Asset_1.default.findOneAndDelete({ _id: id, companyId });
    if (!asset)
        throw new appError_1.default(404, 'NOT_FOUND', 'Asset not found');
    return asset;
};
exports.removeAsset = removeAsset;
const assignAsset = async (companyId, id, data) => {
    const asset = await Asset_1.default.findOne({ _id: id, companyId });
    if (!asset)
        throw new appError_1.default(404, 'NOT_FOUND', 'Asset not found');
    if (asset.status !== 'AVAILABLE')
        throw new appError_1.default(400, 'BAD_REQUEST', 'Asset is not available');
    const assignment = await AssetAssignment_1.default.create({
        assetId: id,
        employeeId: data.employeeId,
        companyId,
        assignedAt: new Date(),
        condition: data.condition,
        notes: data.notes,
    });
    asset.currentAssigneeId = data.employeeId;
    asset.status = 'ASSIGNED';
    await asset.save();
    return { assignment, asset };
};
exports.assignAsset = assignAsset;
const returnAsset = async (companyId, id, data) => {
    const asset = await Asset_1.default.findOne({ _id: id, companyId });
    if (!asset)
        throw new appError_1.default(404, 'NOT_FOUND', 'Asset not found');
    if (asset.status !== 'ASSIGNED')
        throw new appError_1.default(400, 'BAD_REQUEST', 'Asset is not currently assigned');
    const currentAssignment = await AssetAssignment_1.default.findOne({
        assetId: id,
        returnedAt: { $exists: false },
    });
    if (currentAssignment) {
        currentAssignment.returnedAt = new Date();
        currentAssignment.condition = data.condition || currentAssignment.condition;
        currentAssignment.notes = data.notes || currentAssignment.notes;
        await currentAssignment.save();
    }
    asset.currentAssigneeId = null;
    asset.status = 'AVAILABLE';
    await asset.save();
    return asset;
};
exports.returnAsset = returnAsset;
const getAttendanceReport = async (companyId, query) => {
    const { fromDate, toDate, departmentId } = query;
    const match = { companyId };
    if (fromDate || toDate) {
        match.date = {};
        if (fromDate)
            match.date.$gte = new Date(fromDate);
        if (toDate)
            match.date.$lte = new Date(toDate);
    }
    const pipeline = [
        { $match: match },
        {
            $lookup: {
                from: 'employees',
                localField: 'employeeId',
                foreignField: '_id',
                as: 'employee',
            },
        },
        { $unwind: { path: '$employee', preserveNullAndEmptyArrays: true } },
    ];
    if (departmentId) {
        pipeline.push({ $match: { 'employee.departmentId': departmentId } });
    }
    pipeline.push({
        $group: {
            _id: '$employee.departmentId',
            departmentName: { $first: '$employee.departmentId' },
            totalPresent: { $sum: { $cond: [{ $eq: ['$status', 'PRESENT'] }, 1, 0] } },
            totalAbsent: { $sum: { $cond: [{ $eq: ['$status', 'ABSENT'] }, 1, 0] } },
            totalLate: { $sum: { $cond: [{ $eq: ['$status', 'LATE'] }, 1, 0] } },
            totalHalfDay: { $sum: { $cond: [{ $eq: ['$status', 'HALF_DAY'] }, 1, 0] } },
            totalOnLeave: { $sum: { $cond: [{ $eq: ['$status', 'ON_LEAVE'] }, 1, 0] } },
        },
    }, {
        $lookup: {
            from: 'departments',
            localField: '_id',
            foreignField: '_id',
            as: 'department',
        },
    }, { $unwind: { path: '$department', preserveNullAndEmptyArrays: true } }, { $project: { _id: 0, department: '$department.name', totalPresent: 1, totalAbsent: 1, totalLate: 1, totalHalfDay: 1, totalOnLeave: 1 } });
    return Attendance_1.default.aggregate(pipeline);
};
exports.getAttendanceReport = getAttendanceReport;
const getLeaveReport = async (companyId, query) => {
    const { fromDate, toDate, departmentId } = query;
    const match = { companyId, status: { $ne: 'CANCELLED' } };
    if (fromDate || toDate) {
        match.createdAt = {};
        if (fromDate)
            match.createdAt.$gte = new Date(fromDate);
        if (toDate)
            match.createdAt.$lte = new Date(toDate);
    }
    const pipeline = [
        { $match: match },
        {
            $lookup: {
                from: 'employees',
                localField: 'employeeId',
                foreignField: '_id',
                as: 'employee',
            },
        },
        { $unwind: { path: '$employee', preserveNullAndEmptyArrays: true } },
    ];
    if (departmentId) {
        pipeline.push({ $match: { 'employee.departmentId': departmentId } });
    }
    pipeline.push({
        $group: {
            _id: '$leaveTypeId',
            totalRequests: { $sum: 1 },
            totalDays: { $sum: '$days' },
            approved: { $sum: { $cond: [{ $eq: ['$status', 'APPROVED'] }, 1, 0] } },
            rejected: { $sum: { $cond: [{ $eq: ['$status', 'REJECTED'] }, 1, 0] } },
            pending: { $sum: { $cond: [{ $eq: ['$status', 'PENDING'] }, 1, 0] } },
        },
    }, {
        $lookup: {
            from: 'leavetypes',
            localField: '_id',
            foreignField: '_id',
            as: 'leaveType',
        },
    }, { $unwind: { path: '$leaveType', preserveNullAndEmptyArrays: true } }, { $project: { _id: 0, leaveType: '$leaveType.name', totalRequests: 1, totalDays: 1, approved: 1, rejected: 1, pending: 1 } });
    return LeaveRequest_1.default.aggregate(pipeline);
};
exports.getLeaveReport = getLeaveReport;
const getPayrollReport = async (companyId, query) => {
    const { fromDate, toDate } = query;
    const match = { companyId, status: 'PROCESSED' };
    if (fromDate || toDate) {
        match.createdAt = {};
        if (fromDate)
            match.createdAt.$gte = new Date(fromDate);
        if (toDate)
            match.createdAt.$lte = new Date(toDate);
    }
    return Payroll_1.default.aggregate([
        { $match: match },
        {
            $group: {
                _id: { year: '$year', month: '$month' },
                totalAmount: { $sum: '$totalAmount' },
                totalEmployees: { $sum: '$totalEmployees' },
            },
        },
        { $sort: { '_id.year': -1, '_id.month': -1 } },
        { $project: { _id: 0, year: '$_id.year', month: '$_id.month', totalAmount: 1, totalEmployees: 1 } },
    ]);
};
exports.getPayrollReport = getPayrollReport;
const getHeadcountReport = async (companyId, query) => {
    const { departmentId } = query;
    const match = { companyId, status: 'ACTIVE' };
    if (departmentId)
        match.departmentId = departmentId;
    return Employee_1.default.aggregate([
        { $match: match },
        {
            $group: {
                _id: '$departmentId',
                count: { $sum: 1 },
                fullTime: { $sum: { $cond: [{ $eq: ['$employmentType', 'FULL_TIME'] }, 1, 0] } },
                partTime: { $sum: { $cond: [{ $eq: ['$employmentType', 'PART_TIME'] }, 1, 0] } },
                contract: { $sum: { $cond: [{ $eq: ['$employmentType', 'CONTRACT'] }, 1, 0] } },
                intern: { $sum: { $cond: [{ $eq: ['$employmentType', 'INTERN'] }, 1, 0] } },
            },
        },
        {
            $lookup: {
                from: 'departments',
                localField: '_id',
                foreignField: '_id',
                as: 'department',
            },
        },
        { $unwind: { path: '$department', preserveNullAndEmptyArrays: true } },
        { $project: { _id: 0, department: '$department.name', count: 1, fullTime: 1, partTime: 1, contract: 1, intern: 1 } },
        { $sort: { department: 1 } },
    ]);
};
exports.getHeadcountReport = getHeadcountReport;
const getAttritionReport = async (companyId, query) => {
    const { fromDate, toDate } = query;
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const startDate = fromDate ? new Date(fromDate) : sixMonthsAgo;
    const endDate = toDate ? new Date(toDate) : new Date();
    const [activeStart, terminations, newHires] = await Promise.all([
        Employee_1.default.countDocuments({
            companyId,
            status: 'ACTIVE',
            joiningDate: { $lte: startDate },
        }),
        Employee_1.default.countDocuments({
            companyId,
            status: { $in: ['INACTIVE', 'TERMINATED'] },
            exitDate: { $gte: startDate, $lte: endDate },
        }),
        Employee_1.default.countDocuments({
            companyId,
            status: 'ACTIVE',
            joiningDate: { $gte: startDate, $lte: endDate },
        }),
    ]);
    const avgHeadcount = activeStart + terminations;
    const attritionRate = avgHeadcount > 0 ? Math.round((terminations / avgHeadcount) * 10000) / 100 : 0;
    return {
        period: { from: startDate, to: endDate },
        headcountAtStart: activeStart,
        terminations,
        newHires,
        attritionRate,
    };
};
exports.getAttritionReport = getAttritionReport;
// ─── EMPLOYEE FULL UPDATE (PUT) ─────────────────────────────────────────────
const fullUpdateEmployee = async (companyId, id, rawData) => {
    const data = await normalizeEmployeeData(companyId, rawData);
    if (data.email) {
        const existing = await Employee_1.default.findOne({ email: data.email, _id: { $ne: id } });
        if (existing)
            throw new appError_1.default(409, 'CONFLICT', 'Email already in use');
    }
    const employee = await Employee_1.default.findOneAndUpdate({ _id: id, companyId }, data, {
        new: true,
        runValidators: true,
        overwrite: true,
    });
    if (!employee)
        throw new appError_1.default(404, 'NOT_FOUND', 'Employee not found');
    const populated = await Employee_1.default.findById(employee._id)
        .populate('departmentId', 'name code')
        .populate('designationId', 'name level')
        .populate('branchId', 'name')
        .populate('reportingManagerId', 'firstName lastName employeeCode')
        .populate('userId', 'email');
    return transformEmployee(populated.toObject());
};
exports.fullUpdateEmployee = fullUpdateEmployee;
// ─── EMPLOYEE PROFILE ────────────────────────────────────────────────────────
const getEmployeeProfile = async (companyId, id) => {
    const employee = await Employee_1.default.findOne({ _id: id, companyId })
        .select('personalEmail phone alternatePhone dob gender bloodGroup maritalStatus avatar address emergencyContact bankDetails panNumber aadharNumber')
        .lean();
    if (!employee)
        throw new appError_1.default(404, 'NOT_FOUND', 'Employee not found');
    return employee;
};
exports.getEmployeeProfile = getEmployeeProfile;
const updateEmployeeProfile = async (companyId, id, data) => {
    const upd = {};
    const personalFields = ['personalEmail', 'phone', 'alternatePhone', 'dob', 'gender', 'bloodGroup', 'maritalStatus', 'avatar', 'panNumber', 'aadharNumber'];
    personalFields.forEach(f => { if (data[f] !== undefined)
        upd[f] = data[f]; });
    if (data.gender)
        upd.gender = data.gender.toUpperCase();
    if (data.address && typeof data.address === 'object') {
        upd.address = data.address;
    }
    else if (typeof data.address === 'string') {
        upd.address = { street: data.address, city: '', state: '', country: '', zip: '' };
    }
    if (data.emergencyContact)
        upd.emergencyContact = data.emergencyContact;
    if (data.bankDetails)
        upd.bankDetails = data.bankDetails;
    const employee = await Employee_1.default.findOneAndUpdate({ _id: id, companyId }, upd, {
        new: true,
        runValidators: true,
    });
    if (!employee)
        throw new appError_1.default(404, 'NOT_FOUND', 'Employee not found');
    return employee;
};
exports.updateEmployeeProfile = updateEmployeeProfile;
// ─── EMPLOYEE STATUS ─────────────────────────────────────────────────────────
const updateEmployeeStatus = async (companyId, id, data) => {
    const upd = { status: data.status.toUpperCase() };
    if (data.exitDate)
        upd.exitDate = new Date(data.exitDate);
    if (data.exitReason)
        upd.exitReason = data.exitReason;
    const employee = await Employee_1.default.findOneAndUpdate({ _id: id, companyId }, upd, {
        new: true,
        runValidators: true,
    });
    if (!employee)
        throw new appError_1.default(404, 'NOT_FOUND', 'Employee not found');
    await EmployeeHistory_1.default.create({
        employeeId: id,
        companyId,
        changeType: 'STATUS_CHANGE',
        newValue: upd.status,
        effectiveDate: new Date(),
        reason: data.exitReason || undefined,
    });
    return employee;
};
exports.updateEmployeeStatus = updateEmployeeStatus;
// ─── EMPLOYEE HISTORY ────────────────────────────────────────────────────────
const getEmployeeHistory = async (companyId, id) => {
    return EmployeeHistory_1.default.find({ employeeId: id, companyId })
        .populate('changedBy', 'firstName lastName email')
        .populate('oldDepartmentId', 'name')
        .populate('newDepartmentId', 'name')
        .populate('oldDesignationId', 'name')
        .populate('newDesignationId', 'name')
        .sort({ createdAt: -1 })
        .lean();
};
exports.getEmployeeHistory = getEmployeeHistory;
// ─── ATTENDANCE CHECKIN ──────────────────────────────────────────────────────
const checkin = async (companyId, data) => {
    const today = data.date ? new Date(data.date) : new Date();
    today.setHours(0, 0, 0, 0);
    const todayEnd = new Date(today);
    todayEnd.setHours(23, 59, 59, 999);
    const existing = await Attendance_1.default.findOne({
        employeeId: data.employeeId,
        companyId,
        date: { $gte: today, $lte: todayEnd },
    });
    if (existing) {
        if (existing.checkIn)
            throw new appError_1.default(409, 'CONFLICT', 'Already checked in today');
        existing.checkIn = data.checkIn ? new Date(data.checkIn) : new Date();
        existing.source = data.source || 'APP';
        if (data.notes)
            existing.notes = data.notes;
        existing.status = 'PRESENT';
        await existing.save();
        return existing;
    }
    const checkInTime = data.checkIn ? new Date(data.checkIn) : new Date();
    const record = await Attendance_1.default.create({
        employeeId: data.employeeId,
        companyId,
        date: today,
        checkIn: checkInTime,
        source: data.source || 'APP',
        notes: data.notes,
        status: 'PRESENT',
    });
    return record;
};
exports.checkin = checkin;
// ─── ATTENDANCE CHECKOUT ─────────────────────────────────────────────────────
const checkout = async (companyId, data) => {
    const today = data.date ? new Date(data.date) : new Date();
    today.setHours(0, 0, 0, 0);
    const todayEnd = new Date(today);
    todayEnd.setHours(23, 59, 59, 999);
    const record = await Attendance_1.default.findOne({
        employeeId: data.employeeId,
        companyId,
        date: { $gte: today, $lte: todayEnd },
    });
    if (!record)
        throw new appError_1.default(404, 'NOT_FOUND', 'No check-in found for today');
    if (record.checkOut)
        throw new appError_1.default(409, 'CONFLICT', 'Already checked out today');
    record.checkOut = data.checkOut ? new Date(data.checkOut) : new Date();
    record.workingHours = (0, helpers_1.calculateWorkingHours)(record.checkIn, record.checkOut);
    if (data.notes)
        record.notes = data.notes;
    await record.save();
    return record;
};
exports.checkout = checkout;
// ─── ATTENDANCE REGULARIZE ───────────────────────────────────────────────────
const createRegularization = async (companyId, data) => {
    const existing = await RegularizationRequest_1.default.findOne({
        employeeId: data.employeeId,
        date: data.date,
        status: 'PENDING',
    });
    if (existing)
        throw new appError_1.default(409, 'CONFLICT', 'A pending regularization request already exists for this date');
    return RegularizationRequest_1.default.create({ ...data, companyId });
};
exports.createRegularization = createRegularization;
const approveRejectRegularization = async (companyId, id, data) => {
    const req = await RegularizationRequest_1.default.findOne({ _id: id, companyId, status: 'PENDING' });
    if (!req)
        throw new appError_1.default(404, 'NOT_FOUND', 'Regularization request not found or already processed');
    req.status = data.status;
    req.comments = data.comments || req.comments;
    if (data.status === 'APPROVED') {
        const existing = await Attendance_1.default.findOne({ employeeId: req.employeeId, date: req.date });
        if (existing) {
            if (req.checkIn)
                existing.checkIn = req.checkIn;
            if (req.checkOut)
                existing.checkOut = req.checkOut;
            if (existing.checkIn && existing.checkOut) {
                existing.workingHours = (0, helpers_1.calculateWorkingHours)(existing.checkIn, existing.checkOut);
            }
            await existing.save();
        }
        else {
            await Attendance_1.default.create({
                employeeId: req.employeeId,
                companyId,
                date: req.date,
                checkIn: req.checkIn,
                checkOut: req.checkOut,
                status: req.checkIn ? 'PRESENT' : 'ABSENT',
                source: 'MANUAL',
                notes: `Regularized: ${req.reason}`,
            });
        }
        req.approvedAt = new Date();
    }
    await req.save();
    return req;
};
exports.approveRejectRegularization = approveRejectRegularization;
const listRegularizations = async (companyId, query) => {
    const { page, limit, skip } = (0, helpers_1.paginateQuery)(query.page, Number(query.limit));
    const filter = { companyId };
    if (query.employeeId)
        filter.employeeId = query.employeeId;
    if (query.status)
        filter.status = query.status;
    if (query.date) {
        const d = new Date(query.date);
        filter.date = { $gte: new Date(d.setHours(0, 0, 0, 0)), $lte: new Date(d.setHours(23, 59, 59, 999)) };
    }
    if (query.fromDate || query.toDate) {
        filter.date = {};
        if (query.fromDate)
            filter.date.$gte = new Date(query.fromDate);
        if (query.toDate)
            filter.date.$lte = new Date(query.toDate);
    }
    const [records, total] = await Promise.all([
        RegularizationRequest_1.default.find(filter)
            .populate('employeeId', 'firstName lastName employeeCode departmentId')
            .populate('approvedBy', 'firstName lastName')
            .sort({ date: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        RegularizationRequest_1.default.countDocuments(filter),
    ]);
    return { records, meta: (0, helpers_1.buildMeta)(total, page, limit) };
};
exports.listRegularizations = listRegularizations;
const getRegularization = async (companyId, id) => {
    const record = await RegularizationRequest_1.default.findOne({ _id: id, companyId })
        .populate('employeeId', 'firstName lastName employeeCode departmentId email designation')
        .populate('approvedBy', 'firstName lastName')
        .lean();
    if (!record) {
        throw new appError_1.default(404, 'NOT_FOUND', 'Regularization request not found');
    }
    // Fetch original attendance log if it exists
    const attendance = await Attendance_1.default.findOne({
        employeeId: record.employeeId,
        date: record.date
    }).lean();
    return {
        ...record,
        originalCheckIn: attendance?.checkIn || null,
        originalCheckOut: attendance?.checkOut || null,
    };
};
exports.getRegularization = getRegularization;
// ─── PAYROLL — EMPLOYEE PAYSLIPS ─────────────────────────────────────────────
const getEmployeePayslips = async (companyId, employeeId) => {
    return Payslip_1.default.find({ employeeId, companyId })
        .populate({
        path: 'payrollId',
        select: 'month year status',
    })
        .sort({ createdAt: -1 })
        .lean();
};
exports.getEmployeePayslips = getEmployeePayslips;
const getPayslipByMonthYear = async (companyId, month, year) => {
    const payroll = await Payroll_1.default.findOne({ companyId, month: parseInt(month), year: parseInt(year) });
    if (!payroll)
        throw new appError_1.default(404, 'NOT_FOUND', 'Payroll not found for this period');
    const payslips = await Payslip_1.default.find({ payrollId: payroll._id, companyId })
        .populate('employeeId', 'firstName lastName employeeCode departmentId')
        .lean();
    return { payroll, payslips };
};
exports.getPayslipByMonthYear = getPayslipByMonthYear;
const getEmployeeTaxDetails = async (companyId, employeeId) => {
    const employee = await Employee_1.default.findOne({ _id: employeeId, companyId }).lean();
    if (!employee)
        throw new appError_1.default(404, 'NOT_FOUND', 'Employee not found');
    const ss = await SalaryStructure_1.default.findOne({ employeeId, companyId }).lean();
    if (!ss)
        throw new appError_1.default(404, 'NOT_FOUND', 'Salary structure not found');
    const currentYear = new Date().getFullYear();
    const payslips = await Payslip_1.default.find({
        employeeId,
        companyId,
        createdAt: {
            $gte: new Date(currentYear, 0, 1),
            $lte: new Date(currentYear, 11, 31, 23, 59, 59, 999),
        },
    }).lean();
    const totalGrossYTD = payslips.reduce((sum, p) => sum + (p.grossSalary || 0), 0);
    const totalDeductionsYTD = payslips.reduce((sum, p) => sum + (p.pf || 0) + (p.esi || 0) + (p.tds || 0), 0);
    const totalNetYTD = payslips.reduce((sum, p) => sum + (p.netSalary || 0), 0);
    return {
        employeeId,
        panNumber: employee.panNumber,
        monthlyGross: ss.grossSalary,
        monthlyNet: ss.netSalary,
        annualGross: ss.grossSalary * 12,
        annualNet: ss.netSalary * 12,
        ytdGross: totalGrossYTD,
        ytdDeductions: totalDeductionsYTD,
        ytdNet: totalNetYTD,
        pfPerMonth: ss.pf || 0,
        esiPerMonth: ss.esi || 0,
    };
};
exports.getEmployeeTaxDetails = getEmployeeTaxDetails;
const getEmployeeDeductions = async (companyId, employeeId) => {
    const employee = await Employee_1.default.findOne({ _id: employeeId, companyId }).lean();
    if (!employee)
        throw new appError_1.default(404, 'NOT_FOUND', 'Employee not found');
    const ss = await SalaryStructure_1.default.findOne({ employeeId, companyId }).lean();
    if (!ss)
        throw new appError_1.default(404, 'NOT_FOUND', 'Salary structure not found');
    const payslips = await Payslip_1.default.find({ employeeId, companyId })
        .sort({ createdAt: -1 })
        .limit(12)
        .lean();
    const deductionSummary = {
        pf: { perMonth: ss.pf || 0, annual: (ss.pf || 0) * 12 },
        esi: { perMonth: ss.esi || 0, annual: (ss.esi || 0) * 12 },
        tds: { perMonth: 0, annual: 0 },
        customDeductions: (ss.deductions || []).map(d => ({
            name: d.name,
            perMonth: d.amount,
            annual: d.amount * 12,
        })),
        recentPayslips: payslips.map(p => ({
            period: p.createdAt,
            grossSalary: p.grossSalary,
            pf: p.pf,
            esi: p.esi,
            tds: p.tds,
            deductions: p.deductions,
            netSalary: p.netSalary,
        })),
    };
    // Calculate average TDS from recent payslips
    const tdsValues = payslips.map(p => p.tds || 0).filter(v => v > 0);
    if (tdsValues.length > 0) {
        const avgTds = tdsValues.reduce((a, b) => a + b, 0) / tdsValues.length;
        deductionSummary.tds.perMonth = Math.round(avgTds * 100) / 100;
        deductionSummary.tds.annual = Math.round(avgTds * 12 * 100) / 100;
    }
    return deductionSummary;
};
exports.getEmployeeDeductions = getEmployeeDeductions;
// ─── DOCUMENTS — REQUEST LETTER ──────────────────────────────────────────────
const requestLetter = async (companyId, employeeId, data) => {
    const employee = await Employee_1.default.findOne({ _id: employeeId, companyId })
        .populate('departmentId', 'name')
        .populate('designationId', 'name')
        .lean();
    if (!employee)
        throw new appError_1.default(404, 'NOT_FOUND', 'Employee not found');
    const letterContent = data.content || '';
    const letterType = data.type;
    return {
        employeeId,
        type: letterType,
        content: letterContent,
        notes: data.notes,
        generatedAt: new Date().toISOString(),
        message: `${letterType} letter request submitted successfully`,
    };
};
exports.requestLetter = requestLetter;
// ─── PERFORMANCE GOALS ────────────────────────────────────────────────────────
const listPerformanceGoals = async (companyId, employeeId, query) => {
    const { page, limit, skip } = (0, helpers_1.paginateQuery)(query.page, Number(query.limit));
    const filter = { employeeId, companyId };
    if (query.status)
        filter.status = query.status;
    const [goals, total] = await Promise.all([
        PerformanceGoal_1.default.find(filter)
            .populate('createdBy', 'firstName lastName email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        PerformanceGoal_1.default.countDocuments(filter),
    ]);
    return { goals, meta: (0, helpers_1.buildMeta)(total, page, limit) };
};
exports.listPerformanceGoals = listPerformanceGoals;
const createPerformanceGoal = async (companyId, data, userId) => {
    return PerformanceGoal_1.default.create({ ...data, companyId, createdBy: userId });
};
exports.createPerformanceGoal = createPerformanceGoal;
const updatePerformanceGoal = async (companyId, id, data) => {
    const goal = await PerformanceGoal_1.default.findOneAndUpdate({ _id: id, companyId }, data, {
        new: true,
        runValidators: true,
    });
    if (!goal)
        throw new appError_1.default(404, 'NOT_FOUND', 'Performance goal not found');
    return goal;
};
exports.updatePerformanceGoal = updatePerformanceGoal;
// ─── PERFORMANCE APPRAISAL ───────────────────────────────────────────────────
const submitAppraisal = async (companyId, data, userId) => {
    return PerformanceAppraisal_1.default.create({ ...data, companyId, reviewerId: userId, reviewDate: new Date(), status: 'SUBMITTED' });
};
exports.submitAppraisal = submitAppraisal;
const getAppraisalHistory = async (companyId, employeeId) => {
    return PerformanceAppraisal_1.default.find({ employeeId, companyId })
        .populate('reviewerId', 'firstName lastName email')
        .sort({ createdAt: -1 })
        .lean();
};
exports.getAppraisalHistory = getAppraisalHistory;
// ─── PERFORMANCE FEEDBACK ────────────────────────────────────────────────────
const submitFeedback = async (companyId, data, userId) => {
    return PerformanceFeedback_1.default.create({ ...data, companyId, fromEmployeeId: userId, submittedAt: new Date() });
};
exports.submitFeedback = submitFeedback;
// ─── TRAINING COURSES ────────────────────────────────────────────────────────
const listTrainingCourses = async (companyId, query) => {
    const { page, limit, skip } = (0, helpers_1.paginateQuery)(query.page, Number(query.limit));
    const filter = { companyId };
    if (query.status)
        filter.status = query.status;
    if (query.category)
        filter.category = query.category;
    const [courses, total] = await Promise.all([
        TrainingCourse_1.default.find(filter)
            .sort({ startDate: 1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        TrainingCourse_1.default.countDocuments(filter),
    ]);
    return { courses, meta: (0, helpers_1.buildMeta)(total, page, limit) };
};
exports.listTrainingCourses = listTrainingCourses;
// ─── TRAINING ENROLLMENT ─────────────────────────────────────────────────────
const enrollCourse = async (companyId, data) => {
    const existing = await TrainingEnrollment_1.default.findOne({
        courseId: data.courseId,
        employeeId: data.employeeId,
    });
    if (existing)
        throw new appError_1.default(409, 'CONFLICT', 'Already enrolled in this course');
    const course = await TrainingCourse_1.default.findOne({ _id: data.courseId, companyId });
    if (!course)
        throw new appError_1.default(404, 'NOT_FOUND', 'Course not found');
    if (course.maxParticipants) {
        const enrolledCount = await TrainingEnrollment_1.default.countDocuments({
            courseId: data.courseId,
            status: { $in: ['ENROLLED', 'IN_PROGRESS'] },
        });
        if (enrolledCount >= course.maxParticipants) {
            throw new appError_1.default(400, 'BAD_REQUEST', 'Course has reached maximum participants');
        }
    }
    return TrainingEnrollment_1.default.create({
        ...data,
        companyId,
        enrolledAt: new Date(),
        status: 'ENROLLED',
    });
};
exports.enrollCourse = enrollCourse;
const completeCourse = async (companyId, enrollmentId, data) => {
    const enrollment = await TrainingEnrollment_1.default.findOne({ _id: enrollmentId, companyId });
    if (!enrollment)
        throw new appError_1.default(404, 'NOT_FOUND', 'Enrollment not found');
    enrollment.status = 'COMPLETED';
    enrollment.completionDate = new Date();
    if (data.score !== undefined)
        enrollment.score = data.score;
    if (data.feedback)
        enrollment.feedback = data.feedback;
    await enrollment.save();
    return enrollment;
};
exports.completeCourse = completeCourse;
// ─── TRAINING HISTORY & CERTIFICATIONS ──────────────────────────────────────
const getTrainingHistory = async (companyId, employeeId) => {
    return TrainingEnrollment_1.default.find({ employeeId, companyId })
        .populate('courseId', 'title provider category duration')
        .sort({ enrolledAt: -1 })
        .lean();
};
exports.getTrainingHistory = getTrainingHistory;
const getTrainingCertifications = async (companyId, employeeId) => {
    return TrainingCertification_1.default.find({ employeeId, companyId })
        .populate('courseId', 'title provider')
        .sort({ issueDate: -1 })
        .lean();
};
exports.getTrainingCertifications = getTrainingCertifications;
// ─── TRANSFER REQUESTS ───────────────────────────────────────────────────────
const createTransferRequest = async (companyId, data, userId) => {
    const employee = await Employee_1.default.findOne({ _id: data.employeeId, companyId }).lean();
    if (!employee)
        throw new appError_1.default(404, 'NOT_FOUND', 'Employee not found');
    return TransferRequest_1.default.create({
        ...data,
        companyId,
        fromDepartmentId: employee.departmentId,
        fromDesignationId: employee.designationId,
        fromBranchId: employee.branchId,
        requestedBy: userId,
        status: 'PENDING',
    });
};
exports.createTransferRequest = createTransferRequest;
const approveRejectTransfer = async (companyId, id, data, userId) => {
    const transfer = await TransferRequest_1.default.findOne({ _id: id, companyId, status: 'PENDING' });
    if (!transfer)
        throw new appError_1.default(404, 'NOT_FOUND', 'Transfer request not found or already processed');
    transfer.status = data.status;
    transfer.approvedBy = userId;
    transfer.approvedAt = new Date();
    transfer.comments = data.comments || transfer.comments;
    if (data.status === 'APPROVED') {
        const upd = {};
        if (transfer.toDepartmentId) {
            upd.departmentId = transfer.toDepartmentId;
            await EmployeeHistory_1.default.create({
                employeeId: transfer.employeeId,
                companyId,
                changeType: 'DEPARTMENT_CHANGE',
                oldDepartmentId: transfer.fromDepartmentId,
                newDepartmentId: transfer.toDepartmentId,
                effectiveDate: transfer.effectiveDate || new Date(),
                changedBy: userId,
                reason: `Transfer: ${transfer.reason}`,
            });
        }
        if (transfer.toDesignationId) {
            upd.designationId = transfer.toDesignationId;
            await EmployeeHistory_1.default.create({
                employeeId: transfer.employeeId,
                companyId,
                changeType: 'DESIGNATION_CHANGE',
                oldDesignationId: transfer.fromDesignationId,
                newDesignationId: transfer.toDesignationId,
                effectiveDate: transfer.effectiveDate || new Date(),
                changedBy: userId,
                reason: `Transfer: ${transfer.reason}`,
            });
        }
        if (transfer.toBranchId)
            upd.branchId = transfer.toBranchId;
        if (Object.keys(upd).length > 0) {
            await Employee_1.default.updateOne({ _id: transfer.employeeId }, upd);
        }
    }
    await transfer.save();
    return transfer;
};
exports.approveRejectTransfer = approveRejectTransfer;
// ─── PROMOTIONS ──────────────────────────────────────────────────────────────
const createPromotion = async (companyId, data, userId) => {
    const employee = await Employee_1.default.findOne({ _id: data.employeeId, companyId }).lean();
    if (!employee)
        throw new appError_1.default(404, 'NOT_FOUND', 'Employee not found');
    const promotion = await Promotion_1.default.create({
        ...data,
        companyId,
        fromDesignationId: employee.designationId,
        fromDepartmentId: employee.departmentId,
        fromSalary: 0,
        createdBy: userId,
        status: 'PENDING',
    });
    return promotion;
};
exports.createPromotion = createPromotion;
// ─── EMPLOYEE ATTENDANCE ─────────────────────────────────────────────────────
const getEmployeeAttendance = async (companyId, employeeId, query) => {
    const { page, limit, skip } = (0, helpers_1.paginateQuery)(query.page, Number(query.limit));
    const filter = { companyId, employeeId };
    const year = query.year ? parseInt(query.year) : new Date().getFullYear();
    const month = query.month ? parseInt(query.month) : undefined;
    if (month) {
        const start = new Date(year, month - 1, 1);
        const end = new Date(year, month, 0, 23, 59, 59, 999);
        filter.date = { $gte: start, $lte: end };
    }
    else {
        const start = new Date(year, 0, 1);
        const end = new Date(year, 11, 31, 23, 59, 59, 999);
        filter.date = { $gte: start, $lte: end };
    }
    if (query.status)
        filter.status = query.status.toUpperCase();
    const [records, total] = await Promise.all([
        Attendance_1.default.find(filter).sort({ date: -1 }).skip(skip).limit(limit).lean(),
        Attendance_1.default.countDocuments(filter),
    ]);
    const summaryAgg = await Attendance_1.default.aggregate([
        { $match: { companyId: new mongoose_1.default.Types.ObjectId(companyId), employeeId: new mongoose_1.default.Types.ObjectId(employeeId) } },
        {
            $group: {
                _id: null,
                totalPresent: { $sum: { $cond: [{ $eq: ['$status', 'PRESENT'] }, 1, 0] } },
                totalAbsent: { $sum: { $cond: [{ $eq: ['$status', 'ABSENT'] }, 1, 0] } },
                totalLate: { $sum: { $cond: [{ $eq: ['$status', 'LATE'] }, 1, 0] } },
                totalHalfDay: { $sum: { $cond: [{ $eq: ['$status', 'HALF_DAY'] }, 1, 0] } },
            },
        },
    ]);
    const summary = summaryAgg[0] || { totalPresent: 0, totalAbsent: 0, totalLate: 0, totalHalfDay: 0 };
    return { records, summary, meta: (0, helpers_1.buildMeta)(total, page, limit) };
};
exports.getEmployeeAttendance = getEmployeeAttendance;
// ─── EMPLOYEE LEAVES ─────────────────────────────────────────────────────────
const getEmployeeLeaves = async (companyId, employeeId, query) => {
    const { page, limit, skip } = (0, helpers_1.paginateQuery)(query.page, Number(query.limit));
    const filter = { companyId, employeeId };
    if (query.status)
        filter.status = query.status.toUpperCase();
    if (query.year) {
        const y = parseInt(query.year);
        filter.$or = [
            { fromDate: { $gte: new Date(y, 0, 1), $lte: new Date(y, 11, 31, 23, 59, 59, 999) } },
            { toDate: { $gte: new Date(y, 0, 1), $lte: new Date(y, 11, 31, 23, 59, 59, 999) } },
        ];
    }
    const [requests, total] = await Promise.all([
        LeaveRequest_1.default.find(filter)
            .populate('leaveTypeId', 'name code')
            .populate('approvedBy', 'firstName lastName email')
            .populate('rejectedBy', 'firstName lastName email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        LeaveRequest_1.default.countDocuments(filter),
    ]);
    const year = query.year ? parseInt(query.year) : new Date().getFullYear();
    const leaveBalances = await LeaveBalance_1.default.find({ employeeId, companyId, year })
        .populate('leaveTypeId', 'name code')
        .lean();
    const balanceMap = {};
    leaveBalances.forEach((lb) => {
        const name = lb.leaveTypeId?.name || 'Unknown';
        balanceMap[name] = {
            total: lb.allocated || 0,
            used: lb.taken || 0,
            remaining: lb.balance || 0,
        };
    });
    return { requests, leaveBalance: balanceMap, meta: (0, helpers_1.buildMeta)(total, page, limit) };
};
exports.getEmployeeLeaves = getEmployeeLeaves;
// ─── EMPLOYEE PAYROLL ────────────────────────────────────────────────────────
const getEmployeePayroll = async (companyId, employeeId, query) => {
    const { page, limit, skip } = (0, helpers_1.paginateQuery)(query.page, Number(query.limit));
    const filter = { companyId, employeeId };
    if (query.year)
        filter.year = parseInt(query.year);
    if (query.month)
        filter.month = parseInt(query.month);
    if (query.status)
        filter.status = query.status.toUpperCase();
    const [records, total] = await Promise.all([
        Payslip_1.default.find(filter)
            .populate('payrollId', 'month year status')
            .sort({ year: -1, month: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        Payslip_1.default.countDocuments(filter),
    ]);
    return { records, meta: (0, helpers_1.buildMeta)(total, page, limit) };
};
exports.getEmployeePayroll = getEmployeePayroll;
// ─── INITIATE LEAVE ON BEHALF ────────────────────────────────────────────────
const initiateLeaveOnBehalf = async (companyId, employeeId, userId, data) => {
    const employee = await Employee_1.default.findOne({ _id: employeeId, companyId });
    if (!employee)
        throw new appError_1.default(404, 'NOT_FOUND', 'Employee not found');
    if (employee.status !== 'ACTIVE')
        throw new appError_1.default(400, 'BAD_REQUEST', 'Employee must be Active to initiate leave');
    const fromDate = new Date(data.startDate);
    const toDate = new Date(data.endDate);
    const days = (0, helpers_1.calculateDaysBetween)(fromDate, toDate);
    const conflict = await LeaveRequest_1.default.findOne({
        employeeId,
        companyId,
        status: 'APPROVED',
        $or: [
            { fromDate: { $lte: toDate }, toDate: { $gte: fromDate } },
        ],
    });
    if (conflict)
        throw new appError_1.default(409, 'CONFLICT', 'Date conflicts with an existing approved leave');
    const leaveRequest = await LeaveRequest_1.default.create({
        employeeId,
        companyId,
        leaveTypeId: data.leaveTypeId,
        fromDate,
        toDate,
        days,
        reason: data.reason,
        notes: data.notes || '',
        status: 'APPROVED',
        approvedBy: userId,
        approvedAt: new Date(),
    });
    employee.status = 'ACTIVE';
    await employee.save();
    return { employee: transformEmployee(employee.toObject()), leaveRequest };
};
exports.initiateLeaveOnBehalf = initiateLeaveOnBehalf;
// ─── TERMINATE EMPLOYEE ──────────────────────────────────────────────────────
const terminateEmployee = async (companyId, employeeId, userId, data) => {
    const employee = await Employee_1.default.findOne({ _id: employeeId, companyId });
    if (!employee)
        throw new appError_1.default(404, 'NOT_FOUND', 'Employee not found');
    if (employee.status === 'TERMINATED')
        throw new appError_1.default(400, 'BAD_REQUEST', 'Employee is already terminated');
    const lastWorkingDate = new Date(data.lastWorkingDate);
    if (isNaN(lastWorkingDate.getTime())) {
        throw new appError_1.default(400, 'BAD_REQUEST', 'Invalid last working date');
    }
    employee.status = 'TERMINATED';
    employee.exitDate = lastWorkingDate;
    employee.terminationDetails = {
        lastWorkingDate,
        reason: data.reason?.toUpperCase(),
        reasonDetails: data.reasonDetails || '',
        exitChecklist: {
            laptopReturned: data.exitChecklist?.laptopReturned ?? false,
            accessRevoked: data.exitChecklist?.accessRevoked ?? false,
            fnfSettled: data.exitChecklist?.fnfSettled ?? false,
            relievingLetterIssued: data.exitChecklist?.relievingLetterIssued ?? false,
            exitInterviewDone: data.exitChecklist?.exitInterviewDone ?? false,
        },
        noticePeriodServed: data.noticePeriodServed ?? false,
        finalSalaryProcessed: data.finalSalaryProcessed ?? false,
        terminatedBy: new mongoose_1.default.Types.ObjectId(userId),
        terminatedAt: new Date(),
    };
    await employee.save();
    const populated = await Employee_1.default.findById(employee._id)
        .populate('departmentId', 'name code')
        .populate('designationId', 'name level')
        .populate('branchId', 'name')
        .populate('reportingManagerId', 'firstName lastName employeeCode')
        .populate('userId', 'email');
    return transformEmployee(populated.toObject());
};
exports.terminateEmployee = terminateEmployee;
// ─── ASSIGN EMPLOYEE ROLE ────────────────────────────────────────────────────
const assignEmployeeRole = async (companyId, employeeId, userId, data) => {
    const employee = await Employee_1.default.findOne({ _id: employeeId, companyId });
    if (!employee)
        throw new appError_1.default(404, 'NOT_FOUND', 'Employee not found');
    const hasChanges = data.designation || data.departmentId || data.employmentType || data.reportingManagerId;
    if (!hasChanges)
        throw new appError_1.default(400, 'BAD_REQUEST', 'At least one field (designation, department, employmentType, reportingManager) must be provided');
    const currentDesig = employee.designationId
        ? (await mongoose_1.default.model('Designation').findById(employee.designationId).select('name').lean())
        : null;
    const historyEntry = {
        designation: currentDesig?.name,
        departmentId: employee.departmentId,
        employmentType: employee.employmentType,
        reportingManagerId: employee.reportingManagerId,
        changedAt: new Date(),
        changedBy: new mongoose_1.default.Types.ObjectId(userId),
        reason: data.reason,
    };
    employee.roleHistory = employee.roleHistory || [];
    employee.roleHistory.push(historyEntry);
    if (data.designation) {
        const desig = (await mongoose_1.default.model('Designation').findOne({ name: data.designation, companyId }).lean());
        if (desig)
            employee.designationId = desig._id;
    }
    if (data.departmentId)
        employee.departmentId = new mongoose_1.default.Types.ObjectId(data.departmentId);
    if (data.employmentType)
        employee.employmentType = data.employmentType.toUpperCase();
    if (data.reportingManagerId)
        employee.reportingManagerId = new mongoose_1.default.Types.ObjectId(data.reportingManagerId);
    await employee.save();
    const populated = await Employee_1.default.findById(employee._id)
        .populate('departmentId', 'name code')
        .populate('designationId', 'name level')
        .populate('branchId', 'name')
        .populate('reportingManagerId', 'firstName lastName employeeCode')
        .populate('userId', 'email');
    return transformEmployee(populated.toObject());
};
exports.assignEmployeeRole = assignEmployeeRole;
// ─── RESET EMPLOYEE PASSWORD ─────────────────────────────────────────────────
const resetEmployeePassword = async (companyId, employeeId, _userId, data) => {
    const employee = await Employee_1.default.findOne({ _id: employeeId, companyId });
    if (!employee)
        throw new appError_1.default(404, 'NOT_FOUND', 'Employee not found');
    const user = await mongoose_1.default.model('User').findById(employee.userId);
    if (!user)
        throw new appError_1.default(404, 'NOT_FOUND', 'User account not found for this employee');
    const action = data.action;
    if (action === 'reset_password') {
        const resetToken = crypto_1.default.randomBytes(32).toString('hex');
        const hashedToken = crypto_1.default.createHash('sha256').update(resetToken).digest('hex');
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
        user.passwordResetToken = hashedToken;
        user.passwordResetExpires = expiresAt;
        await user.save();
        return {
            message: 'Password reset email sent',
            sentTo: user.email,
            expiresAt,
        };
    }
    if (action === 'resend_invite') {
        const tempPassword = crypto_1.default.randomBytes(8).toString('hex');
        user.password = tempPassword;
        await user.save();
        return {
            message: 'Invite email resent with new temporary password',
            sentTo: user.email,
        };
    }
    throw new appError_1.default(400, 'BAD_REQUEST', "Invalid action. Must be 'reset_password' or 'resend_invite'");
};
exports.resetEmployeePassword = resetEmployeePassword;
// ─── EMPLOYEE DOCUMENTS ──────────────────────────────────────────────────────
const EmployeeDocument_1 = __importDefault(require("../models/EmployeeDocument"));
const createEmployeeDocument = async (companyId, employeeId, userId, data) => {
    const employee = await Employee_1.default.findOne({ _id: employeeId, companyId });
    if (!employee)
        throw new appError_1.default(404, 'NOT_FOUND', 'Employee not found');
    const document = await EmployeeDocument_1.default.create({
        employeeId,
        companyId,
        documentType: data.documentType?.toUpperCase(),
        documentName: data.documentName,
        fileUrl: data.fileUrl || data.documentUrl,
        fileSize: data.fileSize || 0,
        mimeType: data.mimeType,
        isConfidential: data.isConfidential ?? false,
        expiryDate: data.expiryDate ? new Date(data.expiryDate) : undefined,
        uploadedBy: userId,
    });
    return document;
};
exports.createEmployeeDocument = createEmployeeDocument;
const listEmployeeDocuments = async (companyId, employeeId, query) => {
    const { page, limit, skip } = (0, helpers_1.paginateQuery)(query.page, Number(query.limit));
    const filter = { companyId, employeeId };
    if (query.type)
        filter.documentType = query.type.toUpperCase();
    const [records, total] = await Promise.all([
        EmployeeDocument_1.default.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
        EmployeeDocument_1.default.countDocuments(filter),
    ]);
    return { records, meta: (0, helpers_1.buildMeta)(total, page, limit) };
};
exports.listEmployeeDocuments = listEmployeeDocuments;
const getEmployeeDocument = async (companyId, employeeId, documentId) => {
    const document = await EmployeeDocument_1.default.findOne({ _id: documentId, employeeId, companyId });
    if (!document)
        throw new appError_1.default(404, 'NOT_FOUND', 'Document not found');
    return document;
};
exports.getEmployeeDocument = getEmployeeDocument;
// ─── EMPLOYEE NOTES ──────────────────────────────────────────────────────────
const EmployeeNote_1 = __importDefault(require("../models/EmployeeNote"));
const createEmployeeNote = async (companyId, employeeId, userId, data) => {
    const employee = await Employee_1.default.findOne({ _id: employeeId, companyId });
    if (!employee)
        throw new appError_1.default(404, 'NOT_FOUND', 'Employee not found');
    const note = await EmployeeNote_1.default.create({
        employeeId,
        companyId,
        content: data.content,
        category: data.category?.toUpperCase(),
        isPinned: data.isPinned ?? false,
        visibility: data.visibility?.toUpperCase() || 'HR_AND_ADMIN',
        createdBy: userId,
    });
    return note;
};
exports.createEmployeeNote = createEmployeeNote;
const listEmployeeNotes = async (companyId, employeeId, query) => {
    const { page, limit, skip } = (0, helpers_1.paginateQuery)(query.page, Number(query.limit));
    const filter = { companyId, employeeId, isDeleted: false };
    if (query.category)
        filter.category = query.category.toUpperCase();
    const [records, total] = await Promise.all([
        EmployeeNote_1.default.find(filter)
            .populate('createdBy', 'firstName lastName email')
            .sort({ isPinned: -1, createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        EmployeeNote_1.default.countDocuments(filter),
    ]);
    return { records, meta: (0, helpers_1.buildMeta)(total, page, limit) };
};
exports.listEmployeeNotes = listEmployeeNotes;
const updateEmployeeNote = async (companyId, _employeeId, noteId, userId, data) => {
    const note = await EmployeeNote_1.default.findOne({ _id: noteId, companyId, isDeleted: false });
    if (!note)
        throw new appError_1.default(404, 'NOT_FOUND', 'Note not found');
    if (note.createdBy.toString() !== userId) {
        throw new appError_1.default(403, 'FORBIDDEN', 'Only the original author can edit this note');
    }
    if (data.content)
        note.content = data.content;
    if (data.category)
        note.category = data.category.toUpperCase();
    if (data.isPinned !== undefined)
        note.isPinned = data.isPinned;
    if (data.visibility)
        note.visibility = data.visibility.toUpperCase();
    note.updatedBy = new mongoose_1.default.Types.ObjectId(userId);
    await note.save();
    return note;
};
exports.updateEmployeeNote = updateEmployeeNote;
const deleteEmployeeNote = async (companyId, _employeeId, noteId, userId) => {
    const note = await EmployeeNote_1.default.findOne({ _id: noteId, companyId, isDeleted: false });
    if (!note)
        throw new appError_1.default(404, 'NOT_FOUND', 'Note not found');
    if (note.createdBy.toString() !== userId) {
        throw new appError_1.default(403, 'FORBIDDEN', 'Only the original author can delete this note');
    }
    note.isDeleted = true;
    await note.save();
    return { message: 'Note deleted successfully', noteId };
};
exports.deleteEmployeeNote = deleteEmployeeNote;
// ─── EXIT RESIGNATION ────────────────────────────────────────────────────────
const submitResignation = async (companyId, employeeId, data) => {
    const existing = await ExitResignation_1.default.findOne({ employeeId, companyId, status: 'PENDING' });
    if (existing)
        throw new appError_1.default(409, 'CONFLICT', 'A pending resignation already exists');
    const resignation = await ExitResignation_1.default.create({
        ...data,
        employeeId,
        companyId,
        status: 'PENDING',
    });
    return resignation;
};
exports.submitResignation = submitResignation;
// ─── EXIT CHECKLIST ──────────────────────────────────────────────────────────
const getExitChecklist = async (companyId, employeeId) => {
    let checklist = await ExitChecklist_1.default.findOne({ employeeId, companyId }).lean();
    if (!checklist) {
        const departments = await Department_1.default.find({ companyId, isActive: true }).lean();
        const tasks = departments.map(d => ({
            task: `${d.name} clearance`,
            assignedTo: d._id,
            isCompleted: false,
            comments: '',
        }));
        const created = await ExitChecklist_1.default.create({ employeeId, companyId, tasks, status: 'PENDING' });
        checklist = created.toObject();
    }
    return checklist;
};
exports.getExitChecklist = getExitChecklist;
// ─── EXIT CLEARANCE ──────────────────────────────────────────────────────────
const updateClearance = async (companyId, employeeId, departmentId, data, userId) => {
    let clearance = await ExitClearance_1.default.findOne({ employeeId, departmentId, companyId });
    if (!clearance) {
        clearance = await ExitClearance_1.default.create({
            employeeId,
            companyId,
            departmentId,
            clearanceBy: userId,
            status: data.status,
            comments: data.comments || '',
            clearedAt: data.status === 'CLEARED' ? new Date() : undefined,
        });
    }
    else {
        clearance.status = data.status;
        clearance.comments = data.comments || clearance.comments;
        clearance.clearanceBy = userId;
        clearance.clearedAt = data.status === 'CLEARED' ? new Date() : undefined;
        await clearance.save();
    }
    // Update checklist task
    await ExitChecklist_1.default.updateOne({ employeeId, companyId, 'tasks.task': { $regex: 'clearance', $options: 'i' } }, { $set: { 'tasks.$.isCompleted': data.status === 'CLEARED', 'tasks.$.completedAt': data.status === 'CLEARED' ? new Date() : undefined } });
    return clearance;
};
exports.updateClearance = updateClearance;
// ─── EXIT FNF ────────────────────────────────────────────────────────────────
const getFnF = async (companyId, employeeId) => {
    let settlement = await ExitSettlement_1.default.findOne({ employeeId, companyId }).lean();
    if (!settlement) {
        const ss = await SalaryStructure_1.default.findOne({ employeeId, companyId }).lean();
        const monthlySalary = ss?.netSalary || 0;
        const oneMonthNotice = Math.round(monthlySalary * 100) / 100;
        const created = await ExitSettlement_1.default.create({
            employeeId,
            companyId,
            noticePeriodDays: 30,
            noticePeriodAmount: oneMonthNotice,
            unpaidLeaves: 0,
            unpaidLeaveDeduction: 0,
            pendingReimbursements: 0,
            bonusAmount: 0,
            otherEarnings: 0,
            otherDeductions: 0,
            totalAmount: oneMonthNotice,
            status: 'PENDING',
        });
        settlement = created.toObject();
    }
    return settlement;
};
exports.getFnF = getFnF;
//# sourceMappingURL=hrms.service.js.map