"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAsset = exports.listAssets = exports.updateSalaryStructure = exports.createSalaryStructure = exports.getSalaryStructure = exports.exportPayslips = exports.getPayslip = exports.getPayrollById = exports.runPayroll = exports.listPayroll = exports.removeHoliday = exports.updateHoliday = exports.createHoliday = exports.listHolidays = exports.getLeaveCalendar = exports.getLeaveBalance = exports.removeLeaveRequest = exports.rejectLeaveRequest = exports.approveLeaveRequest = exports.getLeaveRequestById = exports.createLeaveRequest = exports.listLeaveRequests = exports.removeLeaveType = exports.updateLeaveType = exports.createLeaveType = exports.listLeaveTypes = exports.exportAttendance = exports.bulkCreateAttendance = exports.getAttendanceSummary = exports.updateAttendance = exports.createAttendance = exports.listAttendance = exports.removeDesignation = exports.updateDesignation = exports.createDesignation = exports.listDesignations = exports.listDepartmentEmployees = exports.removeDepartment = exports.updateDepartment = exports.createDepartment = exports.listDepartments = exports.exportEmployees = exports.bulkImportEmployees = exports.activateEmployee = exports.removeEmployee = exports.updateEmployee = exports.getEmployeeById = exports.createEmployee = exports.listEmployees = exports.getDashboard = void 0;
exports.getAttritionReport = exports.getHeadcountReport = exports.getPayrollReport = exports.getLeaveReport = exports.getAttendanceReport = exports.returnAsset = exports.assignAsset = exports.removeAsset = exports.updateAsset = void 0;
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
                : result.designationId;
        }
        else {
            result.designationId = result.designationId.toString();
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
    const [employees, total] = await Promise.all([
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
    ]);
    return { employees: employees.map(transformEmployee), meta: (0, helpers_1.buildMeta)(total, page, limit) };
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
        if (!['ACTIVE', 'INACTIVE', 'TERMINATED'].includes(data.status)) {
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
    if (data.designationId && !isValidObjectId(data.designationId)) {
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
const bulkImportEmployees = async (companyId, employeesData) => {
    const errors = [];
    const valid = [];
    for (let i = 0; i < employeesData.length; i++) {
        const row = employeesData[i];
        try {
            if (!row.email)
                throw new appError_1.default(400, 'BAD_REQUEST', 'Email is required');
            if (!row.employeeCode)
                throw new appError_1.default(400, 'BAD_REQUEST', 'Employee code is required');
            if (row.departmentCode) {
                const dept = await Department_1.default.findOne({ code: row.departmentCode, companyId });
                if (!dept)
                    throw new appError_1.default(400, 'BAD_REQUEST', `Department ${row.departmentCode} not found`);
                row.departmentId = dept._id;
            }
            if (row.designationName) {
                const desig = await Designation_1.default.findOne({ name: row.designationName, companyId });
                if (!desig)
                    throw new appError_1.default(400, 'BAD_REQUEST', `Designation ${row.designationName} not found`);
                row.designationId = desig._id;
            }
            valid.push({
                firstName: row.firstName,
                lastName: row.lastName || '',
                email: row.email,
                employeeCode: row.employeeCode,
                departmentId: row.departmentId,
                designationId: row.designationId,
                employmentType: row.employmentType || 'FULL_TIME',
                joiningDate: row.joiningDate ? new Date(row.joiningDate) : new Date(),
                phone: row.phone,
                companyId,
            });
        }
        catch (err) {
            errors.push({ row: i + 1, message: err.message });
        }
    }
    let created = [];
    if (valid.length > 0) {
        created = await Employee_1.default.insertMany(valid, { ordered: false });
    }
    return { created: created.length, errors };
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
const listDesignations = async (companyId) => {
    return Designation_1.default.find({ companyId }).sort({ level: 1 }).lean();
};
exports.listDesignations = listDesignations;
const createDesignation = async (companyId, data) => {
    const existing = await Designation_1.default.findOne({ name: data.name, companyId });
    if (existing)
        throw new appError_1.default(409, 'CONFLICT', 'Designation already exists');
    const designation = await Designation_1.default.create({ ...data, companyId });
    return designation;
};
exports.createDesignation = createDesignation;
const updateDesignation = async (companyId, id, data) => {
    if (data.name) {
        const existing = await Designation_1.default.findOne({ name: data.name, companyId, _id: { $ne: id } });
        if (existing)
            throw new appError_1.default(409, 'CONFLICT', 'Designation name already in use');
    }
    const designation = await Designation_1.default.findOneAndUpdate({ _id: id, companyId }, data, {
        new: true,
        runValidators: true,
    });
    if (!designation)
        throw new appError_1.default(404, 'NOT_FOUND', 'Designation not found');
    return designation;
};
exports.updateDesignation = updateDesignation;
const removeDesignation = async (companyId, id) => {
    const activeCount = await Employee_1.default.countDocuments({ designationId: id, companyId, status: 'ACTIVE' });
    if (activeCount > 0)
        throw new appError_1.default(400, 'BAD_REQUEST', 'Cannot delete designation with active employees');
    const designation = await Designation_1.default.findOneAndUpdate({ _id: id, companyId }, { isActive: false }, { new: true });
    if (!designation)
        throw new appError_1.default(404, 'NOT_FOUND', 'Designation not found');
    return designation;
};
exports.removeDesignation = removeDesignation;
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
//# sourceMappingURL=hrms.service.js.map