const Employee = require('../models/Employee');
const Department = require('../models/Department');
const Designation = require('../models/Designation');
const Attendance = require('../models/Attendance');
const AttendanceSummary = require('../models/AttendanceSummary');
const LeaveType = require('../models/LeaveType');
const LeaveRequest = require('../models/LeaveRequest');
const LeaveBalance = require('../models/LeaveBalance');
const Holiday = require('../models/Holiday');
const Payroll = require('../models/Payroll');
const Payslip = require('../models/Payslip');
const SalaryStructure = require('../models/SalaryStructure');
const Asset = require('../models/Asset');
const AssetAssignment = require('../models/AssetAssignment');
const AppError = require('../utils/appError');
const { paginateQuery, buildMeta, buildSearchQuery, calculateWorkingHours, calculateDaysBetween } = require('../utils/helpers');

// ─── DASHBOARD ────────────────────────────────────────────────────────────────────

const getDashboard = async (companyId, from, to) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayEnd = new Date(today);
  todayEnd.setHours(23, 59, 59, 999);

  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);

  const [totalEmployees, presentToday, onLeaveToday, newHiresThisMonth, pendingLeaveRequests] =
    await Promise.all([
      Employee.countDocuments({ companyId, status: 'ACTIVE' }),
      Attendance.countDocuments({ companyId, date: { $gte: today, $lte: todayEnd }, status: 'PRESENT' }),
      Attendance.countDocuments({ companyId, date: { $gte: today, $lte: todayEnd }, status: 'ON_LEAVE' }),
      Employee.countDocuments({ companyId, joiningDate: { $gte: startOfMonth, $lte: endOfMonth } }),
      LeaveRequest.countDocuments({ companyId, status: 'PENDING' }),
    ]);

  const sixMonthsBack = new Date(today);
  sixMonthsBack.setMonth(sixMonthsBack.getMonth() - 6);

  const employeesBeforeSixMonths = await Employee.countDocuments({
    companyId,
    status: 'ACTIVE',
    joiningDate: { $lt: startOfMonth },
  });

  const leftThisMonth = await Employee.countDocuments({
    companyId,
    status: { $in: ['INACTIVE', 'TERMINATED'] },
    exitDate: { $gte: startOfMonth, $lte: endOfMonth },
  });

  const totalBefore = employeesBeforeSixMonths + leftThisMonth;
  const attritionRate = totalBefore > 0 ? Math.round((leftThisMonth / totalBefore) * 10000) / 100 : 0;

  const headcountTrendRaw = await Employee.aggregate([
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

  const departmentWise = await Employee.aggregate([
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

  const weeklyAttendanceRaw = await Attendance.aggregate([
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
    if (!weeklyAttendance[w._id.date]) weeklyAttendance[w._id.date] = {};
    weeklyAttendance[w._id.date][w._id.status] = w.count;
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

// ─── EMPLOYEES ────────────────────────────────────────────────────────────────────

const transformEmployee = (emp) => {
  if (!emp) return null;
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
    } catch (e) {
      result.dateOfJoining = result.joiningDate;
    }
  }

  if (result.designationId) {
    if (typeof result.designationId === 'object') {
      result.designation = result.designationId.name || '';
      result.designationId = result.designationId._id ? result.designationId._id.toString() : result.designationId;
    } else {
      result.designationId = result.designationId.toString();
    }
  }

  if (result.departmentId) {
    if (typeof result.departmentId === 'object') {
      result.department = {
        id: result.departmentId._id ? result.departmentId._id.toString() : '',
        name: result.departmentId.name || '',
      };
      result.departmentId = result.departmentId._id ? result.departmentId._id.toString() : '';
    } else {
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
      result.managerId = result.reportingManagerId._id ? result.reportingManagerId._id.toString() : '';
    } else {
      result.managerId = result.reportingManagerId.toString();
    }
  }

  if (result.address) {
    result.street = result.address.street || '';
    result.city = result.address.city || '';
    result.state = result.address.state || '';
    result.country = result.address.country || '';
    result.zipCode = result.address.zip || '';
    result.address = result.address.street || '';
  }

  return result;
};

const listEmployees = async (companyId, query) => {
  const { page, limit, skip } = paginateQuery(query.page, query.limit);
  const filter = { companyId };

  if (query.status) filter.status = query.status.toUpperCase();
  if (query.departmentId) filter.departmentId = query.departmentId;
  if (query.designationId) filter.designationId = query.designationId;
  if (query.employmentType) filter.employmentType = query.employmentType.toUpperCase();
  if (query.search) {
    Object.assign(filter, buildSearchQuery(query.search, ['firstName', 'lastName', 'email', 'employeeCode']));
  }

  const [employees, total] = await Promise.all([
    Employee.find(filter)
      .populate('departmentId', 'name code')
      .populate('designationId', 'name level')
      .populate('branchId', 'name')
      .populate('reportingManagerId', 'firstName lastName employeeCode')
      .populate('userId', 'email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Employee.countDocuments(filter),
  ]);

  return { employees: employees.map(transformEmployee), meta: buildMeta(total, page, limit) };
};

const normalizeEmployeeData = async (companyId, inputData) => {
  const data = { ...inputData };

  if (data.employeeId && !data.employeeCode) {
    data.employeeCode = data.employeeId;
  }
  delete data.employeeId;

  // 1. Convert gender to uppercase MALE/FEMALE/OTHER
  if (data.gender) {
    data.gender = data.gender.toUpperCase();
    if (!['MALE', 'FEMALE', 'OTHER'].includes(data.gender)) {
      data.gender = undefined;
    }
  }

  // 2. Convert employmentType to uppercase
  if (data.employmentType) {
    data.employmentType = data.employmentType.toUpperCase();
    if (!['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERN'].includes(data.employmentType)) {
      data.employmentType = 'FULL_TIME';
    }
  }

  // 3. Map status to uppercase ACTIVE/INACTIVE/TERMINATED
  if (data.status) {
    data.status = data.status.toUpperCase();
    if (data.status === 'ON_LEAVE') {
      data.status = 'ACTIVE';
    }
    if (!['ACTIVE', 'INACTIVE', 'TERMINATED'].includes(data.status)) {
      data.status = 'ACTIVE';
    }
  }

  // 4. Map joiningDate / dateOfJoining
  if (!data.joiningDate && data.dateOfJoining) {
    data.joiningDate = data.dateOfJoining;
  }
  delete data.dateOfJoining;

  // 5. Structure address
  if (typeof data.address === 'string' || data.city || data.state || data.country || data.zipCode || data.zip) {
    data.address = {
      street: typeof data.address === 'string' ? data.address : (data.address?.street || ''),
      city: data.city || data.address?.city || '',
      state: data.state || data.address?.state || '',
      country: data.country || data.address?.country || '',
      zip: data.zipCode || data.zip || data.address?.zip || '',
    };
    // Delete flat fields
    delete data.city;
    delete data.state;
    delete data.country;
    delete data.zipCode;
    delete data.zip;
  }

  // 6. Map managerId to reportingManagerId
  if (data.managerId && !data.reportingManagerId) {
    data.reportingManagerId = data.managerId;
  }
  delete data.managerId;

  // 7. Validate and map ObjectIds
  const isValidObjectId = (id) => typeof id === 'string' && /^[0-9a-fA-F]{24}$/.test(id);

  // Check department mapping for mock department IDs
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
        let dept = await Department.findOne({ code: deptInfo.code, companyId });
        if (!dept) {
          dept = await Department.create({
            name: deptInfo.name,
            code: deptInfo.code,
            companyId,
            description: `${deptInfo.name} Department`,
          });
        }
        data.departmentId = dept._id;
      } else {
        delete data.departmentId;
      }
    }
  }

  // Check designation (accept designationName string, look up or create)
  if (data.designation && !data.designationId) {
    let desig = await Designation.findOne({ name: data.designation, companyId });
    if (!desig) {
      desig = await Designation.create({
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

  const existing = await Employee.findOne({ email: data.email });
  if (existing) throw new AppError(409, 'CONFLICT', 'Employee with this email already exists');

  if (!data.employeeCode) {
    const count = await Employee.countDocuments({ companyId });
    data.employeeCode = `EMP-${(count + 1).toString().padStart(4, '0')}`;
  } else {
    const codeExists = await Employee.findOne({ employeeCode: data.employeeCode, companyId });
    if (codeExists) throw new AppError(409, 'CONFLICT', 'Employee code already exists');
  }

  const employee = await Employee.create({ ...data, companyId });
  const populated = await Employee.findById(employee._id)
    .populate('departmentId', 'name code')
    .populate('designationId', 'name level')
    .populate('branchId', 'name')
    .populate('reportingManagerId', 'firstName lastName employeeCode')
    .populate('userId', 'email');
  return transformEmployee(populated.toObject());
};

const getEmployeeById = async (companyId, id) => {
  const employee = await Employee.findOne({ _id: id, companyId })
    .populate('departmentId', 'name code')
    .populate('designationId', 'name level')
    .populate('branchId', 'name')
    .populate('reportingManagerId', 'firstName lastName employeeCode')
    .populate('userId', 'email');
  if (!employee) throw new AppError(404, 'NOT_FOUND', 'Employee not found');
  return transformEmployee(employee.toObject());
};

const updateEmployee = async (companyId, id, rawData) => {
  const data = await normalizeEmployeeData(companyId, rawData);

  if (data.email) {
    const existing = await Employee.findOne({ email: data.email, _id: { $ne: id } });
    if (existing) throw new AppError(409, 'CONFLICT', 'Email already in use');
  }
  const employee = await Employee.findOneAndUpdate({ _id: id, companyId }, data, {
    new: true,
    runValidators: true,
  });
  if (!employee) throw new AppError(404, 'NOT_FOUND', 'Employee not found');
  const populated = await Employee.findById(employee._id)
    .populate('departmentId', 'name code')
    .populate('designationId', 'name level')
    .populate('branchId', 'name')
    .populate('reportingManagerId', 'firstName lastName employeeCode')
    .populate('userId', 'email');
  return transformEmployee(populated.toObject());
};

const removeEmployee = async (companyId, id) => {
  const employee = await Employee.findOneAndUpdate(
    { _id: id, companyId },
    { status: 'INACTIVE', exitDate: new Date() },
    { new: true }
  );
  if (!employee) throw new AppError(404, 'NOT_FOUND', 'Employee not found');
  const populated = await Employee.findById(employee._id)
    .populate('departmentId', 'name code')
    .populate('designationId', 'name level')
    .populate('branchId', 'name')
    .populate('reportingManagerId', 'firstName lastName employeeCode')
    .populate('userId', 'email');
  return transformEmployee(populated.toObject());
};

const activateEmployee = async (companyId, id) => {
  const employee = await Employee.findOneAndUpdate(
    { _id: id, companyId },
    { status: 'ACTIVE', $unset: { exitDate: 1 } },
    { new: true }
  );
  if (!employee) throw new AppError(404, 'NOT_FOUND', 'Employee not found');
  const populated = await Employee.findById(employee._id)
    .populate('departmentId', 'name code')
    .populate('designationId', 'name level')
    .populate('branchId', 'name')
    .populate('reportingManagerId', 'firstName lastName employeeCode')
    .populate('userId', 'email');
  return transformEmployee(populated.toObject());
};

const bulkImportEmployees = async (companyId, employeesData) => {
  const errors = [];
  const valid = [];

  for (let i = 0; i < employeesData.length; i++) {
    const row = employeesData[i];
    try {
      if (!row.email) throw new AppError(400, 'BAD_REQUEST', 'Email is required');
      if (!row.employeeCode) throw new AppError(400, 'BAD_REQUEST', 'Employee code is required');

      if (row.departmentCode) {
        const dept = await Department.findOne({ code: row.departmentCode, companyId });
        if (!dept) throw new AppError(400, 'BAD_REQUEST', `Department ${row.departmentCode} not found`);
        row.departmentId = dept._id;
      }
      if (row.designationName) {
        const desig = await Designation.findOne({ name: row.designationName, companyId });
        if (!desig) throw new AppError(400, 'BAD_REQUEST', `Designation ${row.designationName} not found`);
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
    } catch (err) {
      errors.push({ row: i + 1, message: err.message });
    }
  }

  let created = [];
  if (valid.length > 0) {
    created = await Employee.insertMany(valid, { ordered: false });
  }

  return { created: created.length, errors };
};

const exportEmployees = async (companyId, query) => {
  const filter = { companyId, status: 'ACTIVE' };
  if (query.departmentId) filter.departmentId = query.departmentId;
  if (query.designationId) filter.designationId = query.designationId;

  return Employee.find(filter)
    .populate('departmentId', 'name')
    .populate('designationId', 'name')
    .sort({ firstName: 1 })
    .lean();
};

// ─── DEPARTMENTS ─────────────────────────────────────────────────────────────────

const listDepartments = async (companyId) => {
  const departments = await Department.find({ companyId }).populate('headId', 'firstName lastName').lean();

  const employeeCounts = await Employee.aggregate([
    { $match: { companyId, status: 'ACTIVE' } },
    { $group: { _id: '$departmentId', count: { $sum: 1 } } },
  ]);
  const countMap = {};
  employeeCounts.forEach(e => { countMap[e._id?.toString()] = e.count; });

  const deptMap = {};
  departments.forEach(d => {
    deptMap[d._id.toString()] = { ...d, employeeCount: countMap[d._id.toString()] || 0, children: [] };
  });

  const roots = [];
  departments.forEach(d => {
    const node = deptMap[d._id.toString()];
    if (d.parentId && deptMap[d.parentId.toString()]) {
      deptMap[d.parentId.toString()].children.push(node);
    } else {
      roots.push(node);
    }
  });

  return roots;
};

const createDepartment = async (companyId, data) => {
  const existing = await Department.findOne({ code: data.code, companyId });
  if (existing) throw new AppError(409, 'CONFLICT', 'Department code already exists');
  const department = await Department.create({ ...data, companyId });
  return department;
};

const updateDepartment = async (companyId, id, data) => {
  if (data.code) {
    const existing = await Department.findOne({ code: data.code, companyId, _id: { $ne: id } });
    if (existing) throw new AppError(409, 'CONFLICT', 'Department code already in use');
  }
  const department = await Department.findOneAndUpdate({ _id: id, companyId }, data, {
    new: true,
    runValidators: true,
  });
  if (!department) throw new AppError(404, 'NOT_FOUND', 'Department not found');
  return department;
};

const removeDepartment = async (companyId, id) => {
  const activeCount = await Employee.countDocuments({ departmentId: id, companyId, status: 'ACTIVE' });
  if (activeCount > 0) throw new AppError(400, 'BAD_REQUEST', 'Cannot delete department with active employees');

  const childCount = await Department.countDocuments({ parentId: id, companyId, isActive: true });
  if (childCount > 0) throw new AppError(400, 'BAD_REQUEST', 'Cannot delete department with child departments');

  const department = await Department.findOneAndUpdate(
    { _id: id, companyId },
    { isActive: false },
    { new: true }
  );
  if (!department) throw new AppError(404, 'NOT_FOUND', 'Department not found');
  return department;
};

const listDepartmentEmployees = async (companyId, id, query) => {
  const { page, limit, skip } = paginateQuery(query.page, query.limit);
  const filter = { companyId, departmentId: id, status: 'ACTIVE' };

  if (query.search) {
    Object.assign(filter, buildSearchQuery(query.search, ['firstName', 'lastName', 'email', 'employeeCode']));
  }

  const [employees, total] = await Promise.all([
    Employee.find(filter)
      .populate('designationId', 'name level')
      .sort({ firstName: 1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Employee.countDocuments(filter),
  ]);

  return { employees, meta: buildMeta(total, page, limit) };
};

// ─── DESIGNATIONS ─────────────────────────────────────────────────────────────────

const listDesignations = async (companyId) => {
  return Designation.find({ companyId }).sort({ level: 1 }).lean();
};

const createDesignation = async (companyId, data) => {
  const existing = await Designation.findOne({ name: data.name, companyId });
  if (existing) throw new AppError(409, 'CONFLICT', 'Designation already exists');
  const designation = await Designation.create({ ...data, companyId });
  return designation;
};

const updateDesignation = async (companyId, id, data) => {
  if (data.name) {
    const existing = await Designation.findOne({ name: data.name, companyId, _id: { $ne: id } });
    if (existing) throw new AppError(409, 'CONFLICT', 'Designation name already in use');
  }
  const designation = await Designation.findOneAndUpdate({ _id: id, companyId }, data, {
    new: true,
    runValidators: true,
  });
  if (!designation) throw new AppError(404, 'NOT_FOUND', 'Designation not found');
  return designation;
};

const removeDesignation = async (companyId, id) => {
  const activeCount = await Employee.countDocuments({ designationId: id, companyId, status: 'ACTIVE' });
  if (activeCount > 0) throw new AppError(400, 'BAD_REQUEST', 'Cannot delete designation with active employees');

  const designation = await Designation.findOneAndUpdate(
    { _id: id, companyId },
    { isActive: false },
    { new: true }
  );
  if (!designation) throw new AppError(404, 'NOT_FOUND', 'Designation not found');
  return designation;
};

// ─── ATTENDANCE ───────────────────────────────────────────────────────────────────

const listAttendance = async (companyId, query) => {
  const { page, limit, skip } = paginateQuery(query.page, query.limit);
  const filter = { companyId };

  if (query.employeeId) filter.employeeId = query.employeeId;
  if (query.status) filter.status = query.status;
  if (query.date) {
    const d = new Date(query.date);
    filter.date = { $gte: new Date(d.setHours(0, 0, 0, 0)), $lte: new Date(d.setHours(23, 59, 59, 999)) };
  }
  if (query.fromDate || query.toDate) {
    filter.date = {};
    if (query.fromDate) filter.date.$gte = new Date(query.fromDate);
    if (query.toDate) filter.date.$lte = new Date(query.toDate);
  }

  const [records, total] = await Promise.all([
    Attendance.find(filter)
      .populate('employeeId', 'firstName lastName employeeCode departmentId')
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Attendance.countDocuments(filter),
  ]);

  return { records, meta: buildMeta(total, page, limit) };
};

const createAttendance = async (companyId, data) => {
  const existing = await Attendance.findOne({ employeeId: data.employeeId, date: data.date });
  if (existing) throw new AppError(409, 'CONFLICT', 'Attendance already exists for this employee on this date');

  const workingHours = data.checkIn && data.checkOut
    ? calculateWorkingHours(data.checkIn, data.checkOut)
    : 0;

  const record = await Attendance.create({ ...data, companyId, workingHours });
  return record;
};

const updateAttendance = async (companyId, id, data) => {
  const workingHours = data.checkIn && data.checkOut
    ? calculateWorkingHours(data.checkIn, data.checkOut)
    : undefined;

  const updateData = { ...data };
  if (workingHours !== undefined) updateData.workingHours = workingHours;

  const record = await Attendance.findOneAndUpdate({ _id: id, companyId }, updateData, {
    new: true,
    runValidators: true,
  });
  if (!record) throw new AppError(404, 'NOT_FOUND', 'Attendance record not found');
  return record;
};

const getAttendanceSummary = async (companyId, query) => {
  const { fromDate, toDate, employeeId } = query;
  const match = { companyId };

  if (employeeId) match.employeeId = employeeId;
  if (fromDate || toDate) {
    match.date = {};
    if (fromDate) match.date.$gte = new Date(fromDate);
    if (toDate) match.date.$lte = new Date(toDate);
  }

  const summary = await Attendance.aggregate([
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
    const emp = await Employee.findById(employeeId).select('firstName lastName employeeCode').lean();
    return { employee: emp, ...summary[0] };
  }

  return summary[0] || {};
};

const bulkCreateAttendance = async (companyId, data) => {
  const { date, entries } = data;
  const results = { created: 0, skipped: 0, errors: [] };

  for (const entry of entries) {
    try {
      const existing = await Attendance.findOne({ employeeId: entry.employeeId, date });
      if (existing) {
        results.skipped++;
        continue;
      }
      const workingHours = entry.checkIn && entry.checkOut
        ? calculateWorkingHours(entry.checkIn, entry.checkOut)
        : 0;
      await Attendance.create({ ...entry, date, companyId, workingHours });
      results.created++;
    } catch (err) {
      results.errors.push({ employeeId: entry.employeeId, message: err.message });
    }
  }

  return results;
};

const exportAttendance = async (companyId, query) => {
  const filter = { companyId };
  if (query.fromDate || query.toDate) {
    filter.date = {};
    if (query.fromDate) filter.date.$gte = new Date(query.fromDate);
    if (query.toDate) filter.date.$lte = new Date(query.toDate);
  }
  if (query.employeeId) filter.employeeId = query.employeeId;

  return Attendance.find(filter)
    .populate('employeeId', 'firstName lastName employeeCode')
    .sort({ date: -1 })
    .lean();
};

// ─── LEAVE TYPES ──────────────────────────────────────────────────────────────────

const listLeaveTypes = async (companyId) => {
  return LeaveType.find({ companyId }).lean();
};

const createLeaveType = async (companyId, data) => {
  const existing = await LeaveType.findOne({ code: data.code, companyId });
  if (existing) throw new AppError(409, 'CONFLICT', 'Leave type code already exists');
  return LeaveType.create({ ...data, companyId });
};

const updateLeaveType = async (companyId, id, data) => {
  if (data.code) {
    const existing = await LeaveType.findOne({ code: data.code, companyId, _id: { $ne: id } });
    if (existing) throw new AppError(409, 'CONFLICT', 'Leave type code already in use');
  }
  const leaveType = await LeaveType.findOneAndUpdate({ _id: id, companyId }, data, {
    new: true,
    runValidators: true,
  });
  if (!leaveType) throw new AppError(404, 'NOT_FOUND', 'Leave type not found');
  return leaveType;
};

const removeLeaveType = async (companyId, id) => {
  const pendingRequests = await LeaveRequest.countDocuments({ leaveTypeId: id, companyId, status: 'PENDING' });
  if (pendingRequests > 0) throw new AppError(400, 'BAD_REQUEST', 'Cannot delete leave type with pending requests');

  const leaveType = await LeaveType.findOneAndUpdate(
    { _id: id, companyId },
    { isActive: false },
    { new: true }
  );
  if (!leaveType) throw new AppError(404, 'NOT_FOUND', 'Leave type not found');
  return leaveType;
};

// ─── LEAVE REQUESTS ───────────────────────────────────────────────────────────────

const listLeaveRequests = async (companyId, query) => {
  const { page, limit, skip } = paginateQuery(query.page, query.limit);
  const filter = { companyId };

  if (query.status) filter.status = query.status;
  if (query.employeeId) filter.employeeId = query.employeeId;
  if (query.leaveTypeId) filter.leaveTypeId = query.leaveTypeId;
  if (query.fromDate || query.toDate) {
    filter.createdAt = {};
    if (query.fromDate) filter.createdAt.$gte = new Date(query.fromDate);
    if (query.toDate) filter.createdAt.$lte = new Date(query.toDate);
  }

  const [requests, total] = await Promise.all([
    LeaveRequest.find(filter)
      .populate('employeeId', 'firstName lastName employeeCode')
      .populate('leaveTypeId', 'name code')
      .populate('approvedBy', 'email')
      .populate('rejectedBy', 'email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    LeaveRequest.countDocuments(filter),
  ]);

  return { requests, meta: buildMeta(total, page, limit) };
};

const createLeaveRequest = async (companyId, data, userId) => {
  const { leaveTypeId, fromDate, toDate, employeeId } = data;

  const leaveType = await LeaveType.findOne({ _id: leaveTypeId, companyId, isActive: true });
  if (!leaveType) throw new AppError(404, 'NOT_FOUND', 'Leave type not found');

  const days = calculateDaysBetween(fromDate, toDate);
  if (days < 0.5) throw new AppError(400, 'BAD_REQUEST', 'Leave duration must be at least 0.5 days');

  const year = new Date(fromDate).getFullYear();
  const empId = employeeId || (await getEmployeeIdFromUser(companyId, userId));

  const balance = await LeaveBalance.findOne({ employeeId: empId, leaveTypeId, year });
  if (balance && days > balance.balance) {
    throw new AppError(400, 'BAD_REQUEST', `Insufficient leave balance. Available: ${balance.balance}, Requested: ${days}`);
  }

  if (leaveType.requiresApproval) {
    await LeaveBalance.findOneAndUpdate(
      { employeeId: empId, leaveTypeId, year },
      { $inc: { pending: days } },
      { upsert: true }
    );
  }

  const request = await LeaveRequest.create({
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

const getLeaveRequestById = async (companyId, id) => {
  const request = await LeaveRequest.findOne({ _id: id, companyId })
    .populate('employeeId', 'firstName lastName employeeCode departmentId')
    .populate('leaveTypeId', 'name code')
    .populate('approvedBy', 'email')
    .populate('rejectedBy', 'email');
  if (!request) throw new AppError(404, 'NOT_FOUND', 'Leave request not found');
  return request;
};

const approveLeaveRequest = async (companyId, id, userId, data) => {
  const request = await LeaveRequest.findOne({ _id: id, companyId, status: 'PENDING' });
  if (!request) throw new AppError(404, 'NOT_FOUND', 'Leave request not found or already processed');

  const year = new Date(request.fromDate).getFullYear();
  await LeaveBalance.findOneAndUpdate(
    { employeeId: request.employeeId, leaveTypeId: request.leaveTypeId, year },
    { $inc: { pending: -request.days, taken: request.days, balance: -request.days } },
    { upsert: true }
  );

  request.status = 'APPROVED';
  request.approvedBy = userId;
  request.approvedAt = new Date();
  request.comments = data.comments || request.comments;
  await request.save();

  return request;
};

const rejectLeaveRequest = async (companyId, id, userId, data) => {
  const request = await LeaveRequest.findOne({ _id: id, companyId, status: 'PENDING' });
  if (!request) throw new AppError(404, 'NOT_FOUND', 'Leave request not found or already processed');

  const year = new Date(request.fromDate).getFullYear();
  await LeaveBalance.findOneAndUpdate(
    { employeeId: request.employeeId, leaveTypeId: request.leaveTypeId, year },
    { $inc: { pending: -request.days } },
    { upsert: true }
  );

  request.status = 'REJECTED';
  request.rejectedBy = userId;
  request.rejectedAt = new Date();
  request.comments = data.comments || request.comments;
  await request.save();

  return request;
};

const removeLeaveRequest = async (companyId, id) => {
  const request = await LeaveRequest.findOne({ _id: id, companyId });
  if (!request) throw new AppError(404, 'NOT_FOUND', 'Leave request not found');

  if (request.status === 'PENDING') {
    const year = new Date(request.fromDate).getFullYear();
    await LeaveBalance.findOneAndUpdate(
      { employeeId: request.employeeId, leaveTypeId: request.leaveTypeId, year },
      { $inc: { pending: -request.days } },
      { upsert: true }
    );
  }

  request.status = 'CANCELLED';
  await request.save();
  return request;
};

const getLeaveBalance = async (companyId, query) => {
  const { employeeId, year } = query;
  const filter = { companyId };
  if (employeeId) filter.employeeId = employeeId;
  if (year) filter.year = parseInt(year);
  else filter.year = new Date().getFullYear();

  const balances = await LeaveBalance.find(filter)
    .populate('employeeId', 'firstName lastName employeeCode')
    .populate('leaveTypeId', 'name code')
    .lean();

  return balances;
};

const getLeaveCalendar = async (companyId, query) => {
  const { year, month } = query;
  const filter = { companyId, status: 'APPROVED' };

  if (year && month) {
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0, 23, 59, 59, 999);
    filter.fromDate = { $lte: end };
    filter.toDate = { $gte: start };
  } else if (year) {
    const start = new Date(year, 0, 1);
    const end = new Date(year, 11, 31, 23, 59, 59, 999);
    filter.fromDate = { $lte: end };
    filter.toDate = { $gte: start };
  }

  return LeaveRequest.find(filter)
    .populate('employeeId', 'firstName lastName employeeCode')
    .populate('leaveTypeId', 'name code color')
    .sort({ fromDate: 1 })
    .lean();
};

// helper
const getEmployeeIdFromUser = async (companyId, userId) => {
  const emp = await Employee.findOne({ userId, companyId }).select('_id');
  if (!emp) throw new AppError(404, 'NOT_FOUND', 'Employee profile not found for this user');
  return emp._id;
};

// ─── HOLIDAYS ─────────────────────────────────────────────────────────────────────

const listHolidays = async (companyId, query) => {
  const filter = { companyId };
  if (query.year) {
    const y = parseInt(query.year);
    filter.date = { $gte: new Date(y, 0, 1), $lte: new Date(y, 11, 31, 23, 59, 59, 999) };
  }
  if (query.type) filter.type = query.type;

  return Holiday.find(filter).sort({ date: 1 }).lean();
};

const createHoliday = async (companyId, data) => {
  const existing = await Holiday.findOne({ companyId, date: data.date });
  if (existing) throw new AppError(409, 'CONFLICT', 'Holiday already exists on this date');
  return Holiday.create({ ...data, companyId });
};

const updateHoliday = async (companyId, id, data) => {
  if (data.date) {
    const existing = await Holiday.findOne({ companyId, date: data.date, _id: { $ne: id } });
    if (existing) throw new AppError(409, 'CONFLICT', 'Holiday already exists on this date');
  }
  const holiday = await Holiday.findOneAndUpdate({ _id: id, companyId }, data, {
    new: true,
    runValidators: true,
  });
  if (!holiday) throw new AppError(404, 'NOT_FOUND', 'Holiday not found');
  return holiday;
};

const removeHoliday = async (companyId, id) => {
  const holiday = await Holiday.findOneAndDelete({ _id: id, companyId });
  if (!holiday) throw new AppError(404, 'NOT_FOUND', 'Holiday not found');
  return holiday;
};

// ─── PAYROLL ──────────────────────────────────────────────────────────────────────

const listPayroll = async (companyId, query) => {
  const { page, limit, skip } = paginateQuery(query.page, query.limit);
  const filter = { companyId };

  if (query.status) filter.status = query.status;
  if (query.year) filter.year = parseInt(query.year);
  if (query.month) filter.month = parseInt(query.month);

  const [payrolls, total] = await Promise.all([
    Payroll.find(filter)
      .populate('processedBy', 'email')
      .sort({ year: -1, month: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Payroll.countDocuments(filter),
  ]);

  return { payrolls, meta: buildMeta(total, page, limit) };
};

const runPayroll = async (companyId, data, userId) => {
  const { month, year } = data;

  const existing = await Payroll.findOne({ companyId, month, year });
  if (existing) throw new AppError(409, 'CONFLICT', 'Payroll already exists for this period');

  const employees = await Employee.find({ companyId, status: 'ACTIVE' }).lean();
  if (employees.length === 0) throw new AppError(400, 'BAD_REQUEST', 'No active employees found');

  const salaryStructures = await SalaryStructure.find({ companyId }).lean();
  const salaryMap = {};
  salaryStructures.forEach(ss => { salaryMap[ss.employeeId.toString()] = ss; });

  const payroll = await Payroll.create({
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
    const ss = salaryMap[emp._id.toString()];
    if (!ss) continue;

    const grossSalary = ss.grossSalary;
    const totalDeductions = ss.deductions.reduce((sum, d) => sum + d.amount, 0) + ss.pf + ss.esi;
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
    await Payslip.insertMany(payslips);
  }

  payroll.totalAmount = totalAmount;
  payroll.status = 'PROCESSED';
  await payroll.save();

  return payroll;
};

const getPayrollById = async (companyId, id) => {
  const payroll = await Payroll.findOne({ _id: id, companyId })
    .populate('processedBy', 'email')
    .lean();
  if (!payroll) throw new AppError(404, 'NOT_FOUND', 'Payroll not found');

  const payslips = await Payslip.find({ payrollId: id })
    .populate('employeeId', 'firstName lastName employeeCode departmentId')
    .lean();

  return { ...payroll, payslips };
};

const getPayslip = async (companyId, id) => {
  const payslip = await Payslip.findOne({ _id: id, companyId })
    .populate('employeeId', 'firstName lastName employeeCode departmentId designationId')
    .populate({
      path: 'payrollId',
      select: 'month year status',
    })
    .lean();
  if (!payslip) throw new AppError(404, 'NOT_FOUND', 'Payslip not found');
  return payslip;
};

const exportPayslips = async (companyId, query) => {
  const filter = { companyId };
  if (query.payrollId) filter.payrollId = query.payrollId;
  if (query.employeeId) filter.employeeId = query.employeeId;

  return Payslip.find(filter)
    .populate('employeeId', 'firstName lastName employeeCode')
    .populate('payrollId', 'month year')
    .sort({ 'payrollId.year': -1, 'payrollId.month': -1 })
    .lean();
};

// ─── SALARY STRUCTURE ─────────────────────────────────────────────────────────────

const getSalaryStructure = async (companyId, employeeId) => {
  const ss = await SalaryStructure.findOne({ employeeId, companyId })
    .populate('employeeId', 'firstName lastName employeeCode')
    .lean();
  if (!ss) throw new AppError(404, 'NOT_FOUND', 'Salary structure not found');
  return ss;
};

const createSalaryStructure = async (companyId, data) => {
  const existing = await SalaryStructure.findOne({ employeeId: data.employeeId });
  if (existing) throw new AppError(409, 'CONFLICT', 'Salary structure already exists for this employee');

  const totalAllowances = data.otherAllowances.reduce((sum, a) => sum + a.amount, 0);
  const totalDeductions = data.deductions.reduce((sum, d) => sum + d.amount, 0);
  const grossSalary = data.basicSalary + data.hra + data.ta + data.da + totalAllowances;
  const netSalary = grossSalary - data.pf - data.esi - totalDeductions;

  if (netSalary < 0) throw new AppError(400, 'BAD_REQUEST', 'Net salary cannot be negative');

  return SalaryStructure.create({
    ...data,
    companyId,
    grossSalary,
    netSalary,
  });
};

const updateSalaryStructure = async (companyId, employeeId, data) => {
  const ss = await SalaryStructure.findOne({ employeeId, companyId });
  if (!ss) throw new AppError(404, 'NOT_FOUND', 'Salary structure not found');

  const merged = { ...ss.toObject(), ...data };

  const totalAllowances = merged.otherAllowances.reduce((sum, a) => sum + a.amount, 0);
  const totalDeductions = merged.deductions.reduce((sum, d) => sum + d.amount, 0);
  const grossSalary = merged.basicSalary + merged.hra + merged.ta + merged.da + totalAllowances;
  const netSalary = grossSalary - merged.pf - merged.esi - totalDeductions;

  if (netSalary < 0) throw new AppError(400, 'BAD_REQUEST', 'Net salary cannot be negative');

  const updated = await SalaryStructure.findOneAndUpdate(
    { employeeId, companyId },
    { ...data, grossSalary, netSalary },
    { new: true, runValidators: true }
  );
  return updated;
};

// ─── ASSETS ───────────────────────────────────────────────────────────────────────

const listAssets = async (companyId, query) => {
  const { page, limit, skip } = paginateQuery(query.page, query.limit);
  const filter = { companyId };

  if (query.status) filter.status = query.status;
  if (query.category) filter.category = query.category;
  if (query.search) {
    Object.assign(filter, buildSearchQuery(query.search, ['name', 'code', 'serialNumber']));
  }

  const [assets, total] = await Promise.all([
    Asset.find(filter)
      .populate('currentAssigneeId', 'firstName lastName employeeCode')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Asset.countDocuments(filter),
  ]);

  return { assets, meta: buildMeta(total, page, limit) };
};

const createAsset = async (companyId, data) => {
  const existing = await Asset.findOne({ code: data.code, companyId });
  if (existing) throw new AppError(409, 'CONFLICT', 'Asset code already exists');
  return Asset.create({ ...data, companyId });
};

const updateAsset = async (companyId, id, data) => {
  if (data.code) {
    const existing = await Asset.findOne({ code: data.code, companyId, _id: { $ne: id } });
    if (existing) throw new AppError(409, 'CONFLICT', 'Asset code already in use');
  }
  const asset = await Asset.findOneAndUpdate({ _id: id, companyId }, data, {
    new: true,
    runValidators: true,
  });
  if (!asset) throw new AppError(404, 'NOT_FOUND', 'Asset not found');
  return asset;
};

const removeAsset = async (companyId, id) => {
  const asset = await Asset.findOneAndDelete({ _id: id, companyId });
  if (!asset) throw new AppError(404, 'NOT_FOUND', 'Asset not found');
  return asset;
};

const assignAsset = async (companyId, id, data) => {
  const asset = await Asset.findOne({ _id: id, companyId });
  if (!asset) throw new AppError(404, 'NOT_FOUND', 'Asset not found');
  if (asset.status !== 'AVAILABLE') throw new AppError(400, 'BAD_REQUEST', 'Asset is not available');

  const assignment = await AssetAssignment.create({
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

const returnAsset = async (companyId, id, data) => {
  const asset = await Asset.findOne({ _id: id, companyId });
  if (!asset) throw new AppError(404, 'NOT_FOUND', 'Asset not found');
  if (asset.status !== 'ASSIGNED') throw new AppError(400, 'BAD_REQUEST', 'Asset is not currently assigned');

  const currentAssignment = await AssetAssignment.findOne({
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

// ─── REPORTS ──────────────────────────────────────────────────────────────────────

const getAttendanceReport = async (companyId, query) => {
  const { fromDate, toDate, departmentId } = query;
  const match = { companyId };

  if (fromDate || toDate) {
    match.date = {};
    if (fromDate) match.date.$gte = new Date(fromDate);
    if (toDate) match.date.$lte = new Date(toDate);
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

  pipeline.push(
    {
      $group: {
        _id: '$employee.departmentId',
        departmentName: { $first: '$employee.departmentId' },
        totalPresent: { $sum: { $cond: [{ $eq: ['$status', 'PRESENT'] }, 1, 0] } },
        totalAbsent: { $sum: { $cond: [{ $eq: ['$status', 'ABSENT'] }, 1, 0] } },
        totalLate: { $sum: { $cond: [{ $eq: ['$status', 'LATE'] }, 1, 0] } },
        totalHalfDay: { $sum: { $cond: [{ $eq: ['$status', 'HALF_DAY'] }, 1, 0] } },
        totalOnLeave: { $sum: { $cond: [{ $eq: ['$status', 'ON_LEAVE'] }, 1, 0] } },
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
    { $project: { _id: 0, department: '$department.name', totalPresent: 1, totalAbsent: 1, totalLate: 1, totalHalfDay: 1, totalOnLeave: 1 } }
  );

  return Attendance.aggregate(pipeline);
};

const getLeaveReport = async (companyId, query) => {
  const { fromDate, toDate, departmentId } = query;
  const match = { companyId, status: { $ne: 'CANCELLED' } };

  if (fromDate || toDate) {
    match.createdAt = {};
    if (fromDate) match.createdAt.$gte = new Date(fromDate);
    if (toDate) match.createdAt.$lte = new Date(toDate);
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

  pipeline.push(
    {
      $group: {
        _id: '$leaveTypeId',
        totalRequests: { $sum: 1 },
        totalDays: { $sum: '$days' },
        approved: { $sum: { $cond: [{ $eq: ['$status', 'APPROVED'] }, 1, 0] } },
        rejected: { $sum: { $cond: [{ $eq: ['$status', 'REJECTED'] }, 1, 0] } },
        pending: { $sum: { $cond: [{ $eq: ['$status', 'PENDING'] }, 1, 0] } },
      },
    },
    {
      $lookup: {
        from: 'leavetypes',
        localField: '_id',
        foreignField: '_id',
        as: 'leaveType',
      },
    },
    { $unwind: { path: '$leaveType', preserveNullAndEmptyArrays: true } },
    { $project: { _id: 0, leaveType: '$leaveType.name', totalRequests: 1, totalDays: 1, approved: 1, rejected: 1, pending: 1 } }
  );

  return LeaveRequest.aggregate(pipeline);
};

const getPayrollReport = async (companyId, query) => {
  const { fromDate, toDate } = query;
  const match = { companyId, status: 'PROCESSED' };

  if (fromDate || toDate) {
    match.createdAt = {};
    if (fromDate) match.createdAt.$gte = new Date(fromDate);
    if (toDate) match.createdAt.$lte = new Date(toDate);
  }

  return Payroll.aggregate([
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

const getHeadcountReport = async (companyId, query) => {
  const { departmentId } = query;
  const match = { companyId, status: 'ACTIVE' };
  if (departmentId) match.departmentId = departmentId;

  return Employee.aggregate([
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

const getAttritionReport = async (companyId, query) => {
  const { fromDate, toDate } = query;
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const startDate = fromDate ? new Date(fromDate) : sixMonthsAgo;
  const endDate = toDate ? new Date(toDate) : new Date();

  const [activeStart, terminations, newHires] = await Promise.all([
    Employee.countDocuments({
      companyId,
      status: 'ACTIVE',
      joiningDate: { $lte: startDate },
    }),
    Employee.countDocuments({
      companyId,
      status: { $in: ['INACTIVE', 'TERMINATED'] },
      exitDate: { $gte: startDate, $lte: endDate },
    }),
    Employee.countDocuments({
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
