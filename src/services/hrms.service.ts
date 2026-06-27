import Employee from '../models/Employee';
import Department from '../models/Department';
import Designation from '../models/Designation';
import Attendance from '../models/Attendance';
import LeaveType from '../models/LeaveType';
import LeaveRequest from '../models/LeaveRequest';
import LeaveBalance from '../models/LeaveBalance';
import Holiday from '../models/Holiday';
import Payroll from '../models/Payroll';
import Payslip from '../models/Payslip';
import SalaryStructure from '../models/SalaryStructure';
import Asset from '../models/Asset';
import AssetAssignment from '../models/AssetAssignment';
import mongoose from 'mongoose';
import AppError from '../utils/appError';
import { paginateQuery, buildMeta, buildSearchQuery, calculateWorkingHours, calculateDaysBetween } from '../utils/helpers';

interface QueryParams {
  page?: string;
  limit?: string;
  search?: string;
  status?: string;
  departmentId?: string;
  designationId?: string;
  employmentType?: string;
  employeeId?: string;
  date?: string;
  fromDate?: string;
  toDate?: string;
  leaveTypeId?: string;
  year?: string;
  month?: string;
  type?: string;
  category?: string;
  department?: string;
}

interface TransformResult {
  id?: string;
  employeeId?: string;
  dateOfJoining?: string;
  designation?: string;
  department?: { id: string; name: string };
  manager?: { id: string; firstName: string; lastName: string };
  managerId?: string;
  street?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
  [key: string]: unknown;
}

const transformEmployee = (emp: Record<string, unknown> | null): TransformResult | null => {
  if (!emp) return null;
  const result: Record<string, unknown> = { ...emp };

  if (result._id) {
    result.id = (result._id as string).toString();
  }

  if (result.employeeCode) {
    result.employeeId = result.employeeCode as string;
  }

  if (result.status) {
    result.status = (result.status as string).toLowerCase();
  }

  if (result.employmentType) {
    result.employmentType = (result.employmentType as string).toLowerCase();
  }

  if (result.joiningDate) {
    try {
      result.dateOfJoining = new Date(result.joiningDate as string).toISOString().split('T')[0];
    } catch (_e) {
      result.dateOfJoining = result.joiningDate;
    }
  }

  if (result.designationId) {
    if (typeof result.designationId === 'object') {
      result.designation = (result.designationId as Record<string, unknown>).name || '';
      result.designationId = (result.designationId as Record<string, unknown>)._id
        ? ((result.designationId as Record<string, unknown>)._id as string).toString()
        : result.designationId;
    } else {
      result.designationId = (result.designationId as string).toString();
    }
  }

  if (result.departmentId) {
    if (typeof result.departmentId === 'object') {
      result.department = {
        id: (result.departmentId as Record<string, unknown>)._id ? ((result.departmentId as Record<string, unknown>)._id as string).toString() : '',
        name: (result.departmentId as Record<string, unknown>).name as string || '',
      };
      result.departmentId = (result.departmentId as Record<string, unknown>)._id
        ? ((result.departmentId as Record<string, unknown>)._id as string).toString()
        : '';
    } else {
      result.departmentId = (result.departmentId as string).toString();
    }
  }

  if (result.reportingManagerId) {
    if (typeof result.reportingManagerId === 'object') {
      result.manager = {
        id: (result.reportingManagerId as Record<string, unknown>)._id ? ((result.reportingManagerId as Record<string, unknown>)._id as string).toString() : '',
        firstName: (result.reportingManagerId as Record<string, unknown>).firstName as string || '',
        lastName: (result.reportingManagerId as Record<string, unknown>).lastName as string || '',
      };
      result.managerId = (result.reportingManagerId as Record<string, unknown>)._id
        ? ((result.reportingManagerId as Record<string, unknown>)._id as string).toString()
        : '';
    } else {
      result.managerId = (result.reportingManagerId as string).toString();
    }
  }

  if (result.address && typeof result.address === 'object') {
    const addr = result.address as Record<string, unknown>;
    result.street = (addr.street as string) || '';
    result.city = (addr.city as string) || '';
    result.state = (addr.state as string) || '';
    result.country = (addr.country as string) || '';
    result.zipCode = (addr.zip as string) || '';
    result.address = (addr.street as string) || '';
  }

  return result as TransformResult;
};

const getDashboard = async (companyId: string, from: string | undefined, to: string | undefined) => {
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
  const headcountTrend = (headcountTrendRaw as { _id: string; count: number }[]).map(h => ({ month: h._id, count: h.count }));

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

  const weeklyAttendance: Record<string, Record<string, number>> = {};
  (weeklyAttendanceRaw as { _id: { date: string; status: string }; count: number }[]).forEach(w => {
    const date = w._id.date;
    const status = w._id.status;
    if (!weeklyAttendance[date]) weeklyAttendance[date] = {};
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

const listEmployees = async (companyId: string, query: QueryParams) => {
  const { page, limit, skip } = paginateQuery(query.page, Number(query.limit));
  const filter: Record<string, unknown> = { companyId };

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

const normalizeEmployeeData = async (companyId: string, inputData: Record<string, unknown>) => {
  const data: Record<string, unknown> = { ...inputData };

  if (data.employeeId && !data.employeeCode) {
    data.employeeCode = data.employeeId;
  }
  delete data.employeeId;

  if (data.gender) {
    data.gender = (data.gender as string).toUpperCase();
    if (!['MALE', 'FEMALE', 'OTHER'].includes(data.gender as string)) {
      data.gender = undefined;
    }
  }

  if (data.employmentType) {
    data.employmentType = (data.employmentType as string).toUpperCase();
    if (!['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERN'].includes(data.employmentType as string)) {
      data.employmentType = 'FULL_TIME';
    }
  }

  if (data.status) {
    data.status = (data.status as string).toUpperCase();
    if (data.status === 'ON_LEAVE') {
      data.status = 'ACTIVE';
    }
    if (!['ACTIVE', 'INACTIVE', 'TERMINATED'].includes(data.status as string)) {
      data.status = 'ACTIVE';
    }
  }

  if (!data.joiningDate && data.dateOfJoining) {
    data.joiningDate = data.dateOfJoining;
  }
  delete data.dateOfJoining;

  if (typeof data.address === 'string' || data.city || data.state || data.country || data.zipCode || data.zip) {
    data.address = {
      street: typeof data.address === 'string' ? data.address : ((data.address as Record<string, unknown>)?.street as string) || '',
      city: (data.city as string) || ((data.address as Record<string, unknown>)?.city as string) || '',
      state: (data.state as string) || ((data.address as Record<string, unknown>)?.state as string) || '',
      country: (data.country as string) || ((data.address as Record<string, unknown>)?.country as string) || '',
      zip: (data.zipCode as string) || (data.zip as string) || ((data.address as Record<string, unknown>)?.zip as string) || '',
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

  const isValidObjectId = (id: unknown) => typeof id === 'string' && /^[0-9a-fA-F]{24}$/.test(id);

  const deptMapping: Record<string, { name: string; code: string }> = {
    'dept-1': { name: 'Engineering', code: 'ENG' },
    'dept-2': { name: 'Product & Design', code: 'PROD' },
    'dept-3': { name: 'Sales & Marketing', code: 'SALES' },
    'dept-4': { name: 'Human Resources', code: 'HR' },
    'dept-5': { name: 'Finance & Legal', code: 'FIN' },
    'dept-6': { name: 'Customer Support', code: 'SUPPORT' },
  };

  if (data.departmentId) {
    if (!isValidObjectId(data.departmentId)) {
      const deptInfo = deptMapping[data.departmentId as string];
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

  if (data.designation && !data.designationId) {
    let desig = await Designation.findOne({ name: data.designation as string, companyId });
    if (!desig) {
      desig = await Designation.create({
        name: data.designation as string,
        companyId,
        level: 1,
        description: `${data.designation as string} Designation`,
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

const createEmployee = async (companyId: string, rawData: Record<string, unknown>) => {
  const data = await normalizeEmployeeData(companyId, rawData);

  const existing = await Employee.findOne({ email: data.email as string });
  if (existing) throw new AppError(409, 'CONFLICT', 'Employee with this email already exists');

  if (!data.employeeCode) {
    const count = await Employee.countDocuments({ companyId });
    data.employeeCode = `EMP-${(count + 1).toString().padStart(4, '0')}`;
  } else {
    const codeExists = await Employee.findOne({ employeeCode: data.employeeCode as string, companyId });
    if (codeExists) throw new AppError(409, 'CONFLICT', 'Employee code already exists');
  }

  const employee = await Employee.create({ ...data, companyId });
  const populated = await Employee.findById(employee._id)
    .populate('departmentId', 'name code')
    .populate('designationId', 'name level')
    .populate('branchId', 'name')
    .populate('reportingManagerId', 'firstName lastName employeeCode')
    .populate('userId', 'email');
  return transformEmployee(populated!.toObject() as unknown as Record<string, unknown>);
};

const getEmployeeById = async (companyId: string, id: string) => {
  const employee = await Employee.findOne({ _id: id, companyId })
    .populate('departmentId', 'name code')
    .populate('designationId', 'name level')
    .populate('branchId', 'name')
    .populate('reportingManagerId', 'firstName lastName employeeCode')
    .populate('userId', 'email');
  if (!employee) throw new AppError(404, 'NOT_FOUND', 'Employee not found');
  return transformEmployee(employee.toObject() as unknown as Record<string, unknown>);
};

const updateEmployee = async (companyId: string, id: string, rawData: Record<string, unknown>) => {
  const data = await normalizeEmployeeData(companyId, rawData);

  if (data.email) {
    const existing = await Employee.findOne({ email: data.email as string, _id: { $ne: id } });
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
  return transformEmployee(populated!.toObject() as unknown as Record<string, unknown>);
};

const removeEmployee = async (companyId: string, id: string) => {
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
  return transformEmployee(populated!.toObject() as unknown as Record<string, unknown>);
};

const activateEmployee = async (companyId: string, id: string) => {
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
  return transformEmployee(populated!.toObject() as unknown as Record<string, unknown>);
};

const bulkImportEmployees = async (companyId: string, employeesData: Record<string, unknown>[]) => {
  const errors: { row: number; message: string }[] = [];
  const valid: Record<string, unknown>[] = [];

  for (let i = 0; i < employeesData.length; i++) {
    const row = employeesData[i]!;
    try {
      if (!row.email) throw new AppError(400, 'BAD_REQUEST', 'Email is required');
      if (!row.employeeCode) throw new AppError(400, 'BAD_REQUEST', 'Employee code is required');

      if (row.departmentCode) {
        const dept = await Department.findOne({ code: row.departmentCode as string, companyId });
        if (!dept) throw new AppError(400, 'BAD_REQUEST', `Department ${row.departmentCode as string} not found`);
        row.departmentId = dept._id;
      }
      if (row.designationName) {
        const desig = await Designation.findOne({ name: row.designationName as string, companyId });
        if (!desig) throw new AppError(400, 'BAD_REQUEST', `Designation ${row.designationName as string} not found`);
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
        joiningDate: row.joiningDate ? new Date(row.joiningDate as string) : new Date(),
        phone: row.phone,
        companyId,
      });
    } catch (err) {
      errors.push({ row: i + 1, message: (err as Error).message });
    }
  }

  let created: Record<string, unknown>[] = [];
  if (valid.length > 0) {
    created = await Employee.insertMany(valid, { ordered: false }) as unknown as Record<string, unknown>[];
  }

  return { created: created.length, errors };
};

const exportEmployees = async (companyId: string, query: QueryParams) => {
  const filter: Record<string, unknown> = { companyId, status: 'ACTIVE' };
  if (query.departmentId) filter.departmentId = query.departmentId;
  if (query.designationId) filter.designationId = query.designationId;

  return Employee.find(filter)
    .populate('departmentId', 'name')
    .populate('designationId', 'name')
    .sort({ firstName: 1 })
    .lean();
};

const listDepartments = async (companyId: string) => {
  const departments = await Department.find({ companyId }).populate('headId', 'firstName lastName').lean();

  const employeeCounts = await Employee.aggregate([
    { $match: { companyId: companyId, status: 'ACTIVE' } },
    { $group: { _id: '$departmentId', count: { $sum: 1 } } },
  ]);
  const countMap: Record<string, number> = {};
  (employeeCounts as { _id: unknown; count: number }[]).forEach(e => { countMap[String(e._id)] = e.count; });

  const deptMap: Record<string, Record<string, unknown>> = {};
  departments.forEach(d => {
    const id = String(d._id);
    deptMap[id] = { ...d, employeeCount: countMap[id] || 0, children: [] };
  });

  const roots: Record<string, unknown>[] = [];
  departments.forEach(d => {
    const id = String(d._id);
    const node = deptMap[id];
    const parentKey = String(d.parentId);
    if (d.parentId && deptMap[parentKey]) {
      ((deptMap[parentKey] as Record<string, unknown>).children as Record<string, unknown>[]).push(node as Record<string, unknown>);
    } else {
      roots.push(node as Record<string, unknown>);
    }
  });

  return roots;
};

const createDepartment = async (companyId: string, data: Record<string, unknown>) => {
  const existing = await Department.findOne({ code: data.code as string, companyId });
  if (existing) throw new AppError(409, 'CONFLICT', 'Department code already exists');
  const department = await Department.create({ ...data, companyId });
  return department;
};

const updateDepartment = async (companyId: string, id: string, data: Record<string, unknown>) => {
  if (data.code) {
    const existing = await Department.findOne({ code: data.code as string, companyId, _id: { $ne: id } });
    if (existing) throw new AppError(409, 'CONFLICT', 'Department code already in use');
  }
  const department = await Department.findOneAndUpdate({ _id: id, companyId }, data, {
    new: true,
    runValidators: true,
  });
  if (!department) throw new AppError(404, 'NOT_FOUND', 'Department not found');
  return department;
};

const removeDepartment = async (companyId: string, id: string) => {
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

const listDepartmentEmployees = async (companyId: string, id: string, query: QueryParams) => {
  const { page, limit, skip } = paginateQuery(query.page, Number(query.limit));
  const filter: Record<string, unknown> = { companyId, departmentId: id, status: 'ACTIVE' };

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

const listDesignations = async (companyId: string) => {
  return Designation.find({ companyId }).sort({ level: 1 }).lean();
};

const createDesignation = async (companyId: string, data: Record<string, unknown>) => {
  const existing = await Designation.findOne({ name: data.name as string, companyId });
  if (existing) throw new AppError(409, 'CONFLICT', 'Designation already exists');
  const designation = await Designation.create({ ...data, companyId });
  return designation;
};

const updateDesignation = async (companyId: string, id: string, data: Record<string, unknown>) => {
  if (data.name) {
    const existing = await Designation.findOne({ name: data.name as string, companyId, _id: { $ne: id } });
    if (existing) throw new AppError(409, 'CONFLICT', 'Designation name already in use');
  }
  const designation = await Designation.findOneAndUpdate({ _id: id, companyId }, data, {
    new: true,
    runValidators: true,
  });
  if (!designation) throw new AppError(404, 'NOT_FOUND', 'Designation not found');
  return designation;
};

const removeDesignation = async (companyId: string, id: string) => {
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

const listAttendance = async (companyId: string, query: QueryParams) => {
  const { page, limit, skip } = paginateQuery(query.page, Number(query.limit));
  const filter: Record<string, unknown> = { companyId };

  if (query.employeeId) filter.employeeId = query.employeeId;
  if (query.status) filter.status = query.status;
  if (query.date) {
    const d = new Date(query.date);
    filter.date = { $gte: new Date(d.setHours(0, 0, 0, 0)), $lte: new Date(d.setHours(23, 59, 59, 999)) };
  }
  if (query.fromDate || query.toDate) {
    filter.date = {};
    if (query.fromDate) (filter.date as Record<string, unknown>).$gte = new Date(query.fromDate);
    if (query.toDate) (filter.date as Record<string, unknown>).$lte = new Date(query.toDate);
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

const createAttendance = async (companyId: string, data: Record<string, unknown>) => {
  const existing = await Attendance.findOne({ employeeId: data.employeeId, date: data.date });
  if (existing) throw new AppError(409, 'CONFLICT', 'Attendance already exists for this employee on this date');

  const workingHours = data.checkIn && data.checkOut
    ? calculateWorkingHours(data.checkIn as string, data.checkOut as string)
    : 0;

  const record = await Attendance.create({ ...data, companyId, workingHours });
  return record;
};

const updateAttendance = async (companyId: string, id: string, data: Record<string, unknown>) => {
  const workingHours = data.checkIn && data.checkOut
    ? calculateWorkingHours(data.checkIn as string, data.checkOut as string)
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

const getAttendanceSummary = async (companyId: string, query: QueryParams) => {
  const { fromDate, toDate, employeeId } = query;
  const match: Record<string, unknown> = { companyId };

  if (employeeId) match.employeeId = employeeId;
  if (fromDate || toDate) {
    match.date = {};
    if (fromDate) (match.date as Record<string, unknown>).$gte = new Date(fromDate);
    if (toDate) (match.date as Record<string, unknown>).$lte = new Date(toDate);
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
    return { employee: emp, ...summary[0] as Record<string, unknown> };
  }

  return (summary[0] as Record<string, unknown>) || {};
};

const bulkCreateAttendance = async (companyId: string, data: { date: string; entries: Record<string, unknown>[] }) => {
  const { date, entries } = data;
  const results = { created: 0, skipped: 0, errors: [] as { employeeId: unknown; message: string }[] };

  for (const entry of entries) {
    try {
      const existing = await Attendance.findOne({ employeeId: entry.employeeId, date });
      if (existing) {
        results.skipped++;
        continue;
      }
      const workingHours = entry.checkIn && entry.checkOut
        ? calculateWorkingHours(entry.checkIn as string, entry.checkOut as string)
        : 0;
      await Attendance.create({ ...entry, date, companyId, workingHours });
      results.created++;
    } catch (err) {
      results.errors.push({ employeeId: entry.employeeId, message: (err as Error).message });
    }
  }

  return results;
};

const exportAttendance = async (companyId: string, query: QueryParams) => {
  const filter: Record<string, unknown> = { companyId };
  if (query.fromDate || query.toDate) {
    filter.date = {};
    if (query.fromDate) (filter.date as Record<string, unknown>).$gte = new Date(query.fromDate);
    if (query.toDate) (filter.date as Record<string, unknown>).$lte = new Date(query.toDate);
  }
  if (query.employeeId) filter.employeeId = query.employeeId;

  return Attendance.find(filter)
    .populate('employeeId', 'firstName lastName employeeCode')
    .sort({ date: -1 })
    .lean();
};

const listLeaveTypes = async (companyId: string) => {
  return LeaveType.find({ companyId }).lean();
};

const createLeaveType = async (companyId: string, data: Record<string, unknown>) => {
  const existing = await LeaveType.findOne({ code: data.code as string, companyId });
  if (existing) throw new AppError(409, 'CONFLICT', 'Leave type code already exists');
  return LeaveType.create({ ...data, companyId });
};

const updateLeaveType = async (companyId: string, id: string, data: Record<string, unknown>) => {
  if (data.code) {
    const existing = await LeaveType.findOne({ code: data.code as string, companyId, _id: { $ne: id } });
    if (existing) throw new AppError(409, 'CONFLICT', 'Leave type code already in use');
  }
  const leaveType = await LeaveType.findOneAndUpdate({ _id: id, companyId }, data, {
    new: true,
    runValidators: true,
  });
  if (!leaveType) throw new AppError(404, 'NOT_FOUND', 'Leave type not found');
  return leaveType;
};

const removeLeaveType = async (companyId: string, id: string) => {
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

const listLeaveRequests = async (companyId: string, query: QueryParams) => {
  const { page, limit, skip } = paginateQuery(query.page, Number(query.limit));
  const filter: Record<string, unknown> = { companyId };

  if (query.status) filter.status = query.status;
  if (query.employeeId) filter.employeeId = query.employeeId;
  if (query.leaveTypeId) filter.leaveTypeId = query.leaveTypeId;
  if (query.fromDate || query.toDate) {
    filter.createdAt = {};
    if (query.fromDate) (filter.createdAt as Record<string, unknown>).$gte = new Date(query.fromDate);
    if (query.toDate) (filter.createdAt as Record<string, unknown>).$lte = new Date(query.toDate);
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

const createLeaveRequest = async (companyId: string, data: Record<string, unknown>, userId: string) => {
  const { leaveTypeId, fromDate, toDate, employeeId } = data;

  const leaveType = await LeaveType.findOne({ _id: leaveTypeId as string, companyId, isActive: true });
  if (!leaveType) throw new AppError(404, 'NOT_FOUND', 'Leave type not found');

  const days = calculateDaysBetween(fromDate as string, toDate as string);
  if (days < 0.5) throw new AppError(400, 'BAD_REQUEST', 'Leave duration must be at least 0.5 days');

  const year = new Date(fromDate as string).getFullYear();
  const empId = employeeId || (await getEmployeeIdFromUser(companyId, userId));

  const balance = await LeaveBalance.findOne({ employeeId: empId, leaveTypeId, year });
  if (balance && days > (balance.balance ?? 0)) {
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

const getLeaveRequestById = async (companyId: string, id: string) => {
  const request = await LeaveRequest.findOne({ _id: id, companyId })
    .populate('employeeId', 'firstName lastName employeeCode departmentId')
    .populate('leaveTypeId', 'name code')
    .populate('approvedBy', 'email')
    .populate('rejectedBy', 'email');
  if (!request) throw new AppError(404, 'NOT_FOUND', 'Leave request not found');
  return request;
};

const approveLeaveRequest = async (companyId: string, id: string, userId: string, data: Record<string, unknown>) => {
  const request = await LeaveRequest.findOne({ _id: id, companyId, status: 'PENDING' });
  if (!request) throw new AppError(404, 'NOT_FOUND', 'Leave request not found or already processed');

  const year = new Date(request.fromDate).getFullYear();
  await LeaveBalance.findOneAndUpdate(
    { employeeId: request.employeeId, leaveTypeId: request.leaveTypeId, year },
    { $inc: { pending: -(request.days ?? 0), taken: request.days, balance: -(request.days ?? 0) } },
    { upsert: true }
  );

  request.status = 'APPROVED';
  request.approvedBy = userId as any;
  request.approvedAt = new Date();
  request.comments = (data.comments as string) || request.comments;
  await request.save();

  return request;
};

const rejectLeaveRequest = async (companyId: string, id: string, userId: string, data: Record<string, unknown>) => {
  const request = await LeaveRequest.findOne({ _id: id, companyId, status: 'PENDING' });
  if (!request) throw new AppError(404, 'NOT_FOUND', 'Leave request not found or already processed');

  const year = new Date(request.fromDate).getFullYear();
  await LeaveBalance.findOneAndUpdate(
    { employeeId: request.employeeId, leaveTypeId: request.leaveTypeId, year },
    { $inc: { pending: -(request.days ?? 0) } },
    { upsert: true }
  );

  request.status = 'REJECTED';
  request.rejectedBy = userId as any;
  request.rejectedAt = new Date();
  request.comments = (data.comments as string) || request.comments;
  await request.save();

  return request;
};

const removeLeaveRequest = async (companyId: string, id: string) => {
  const request = await LeaveRequest.findOne({ _id: id, companyId });
  if (!request) throw new AppError(404, 'NOT_FOUND', 'Leave request not found');

  if (request.status === 'PENDING') {
    const year = new Date(request.fromDate).getFullYear();
    await LeaveBalance.findOneAndUpdate(
      { employeeId: request.employeeId, leaveTypeId: request.leaveTypeId, year },
      { $inc: { pending: -(request.days ?? 0) } },
      { upsert: true }
    );
  }

  request.status = 'CANCELLED';
  await request.save();
  return request;
};

const getLeaveBalance = async (companyId: string, query: QueryParams) => {
  const { employeeId, year } = query;
  const filter: Record<string, unknown> = { companyId };
  if (employeeId) filter.employeeId = employeeId;
  if (year) filter.year = parseInt(year);
  else filter.year = new Date().getFullYear();

  const balances = await LeaveBalance.find(filter)
    .populate('employeeId', 'firstName lastName employeeCode')
    .populate('leaveTypeId', 'name code')
    .lean();

  return balances;
};

const getLeaveCalendar = async (companyId: string, query: QueryParams) => {
  const { year, month } = query;
  const filter: Record<string, unknown> = { companyId, status: 'APPROVED' };

  if (year && month) {
    const start = new Date(parseInt(year), parseInt(month) - 1, 1);
    const end = new Date(parseInt(year), parseInt(month), 0, 23, 59, 59, 999);
    filter.fromDate = { $lte: end };
    filter.toDate = { $gte: start };
  } else if (year) {
    const start = new Date(parseInt(year), 0, 1);
    const end = new Date(parseInt(year), 11, 31, 23, 59, 59, 999);
    filter.fromDate = { $lte: end };
    filter.toDate = { $gte: start };
  }

  return LeaveRequest.find(filter)
    .populate('employeeId', 'firstName lastName employeeCode')
    .populate('leaveTypeId', 'name code color')
    .sort({ fromDate: 1 })
    .lean();
};

const getEmployeeIdFromUser = async (companyId: string, userId: string) => {
  const emp = await Employee.findOne({ userId, companyId }).select('_id');
  if (!emp) throw new AppError(404, 'NOT_FOUND', 'Employee profile not found for this user');
  return emp._id;
};

const listHolidays = async (companyId: string, query: QueryParams) => {
  const filter: Record<string, unknown> = { companyId };
  if (query.year) {
    const y = parseInt(query.year);
    filter.date = { $gte: new Date(y, 0, 1), $lte: new Date(y, 11, 31, 23, 59, 59, 999) };
  }
  if (query.type) filter.type = query.type;

  return Holiday.find(filter).sort({ date: 1 }).lean();
};

const createHoliday = async (companyId: string, data: Record<string, unknown>) => {
  const existing = await Holiday.findOne({ companyId, date: data.date });
  if (existing) throw new AppError(409, 'CONFLICT', 'Holiday already exists on this date');
  return Holiday.create({ ...data, companyId });
};

const updateHoliday = async (companyId: string, id: string, data: Record<string, unknown>) => {
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

const removeHoliday = async (companyId: string, id: string) => {
  const holiday = await Holiday.findOneAndDelete({ _id: id, companyId });
  if (!holiday) throw new AppError(404, 'NOT_FOUND', 'Holiday not found');
  return holiday;
};

const listPayroll = async (companyId: string, query: QueryParams) => {
  const { page, limit, skip } = paginateQuery(query.page, Number(query.limit));
  const filter: Record<string, unknown> = { companyId };

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

const runPayroll = async (companyId: string, data: Record<string, unknown>, userId: string) => {
  const { month, year } = data;

  const existing = await Payroll.findOne({ companyId, month, year });
  if (existing) throw new AppError(409, 'CONFLICT', 'Payroll already exists for this period');

  const employees = await Employee.find({ companyId, status: 'ACTIVE' }).lean();
  if (employees.length === 0) throw new AppError(400, 'BAD_REQUEST', 'No active employees found');

  const salaryStructures = await SalaryStructure.find({ companyId }).lean();
  const salaryMap: Record<string, Record<string, unknown>> = {};
  salaryStructures.forEach(ss => { salaryMap[String(ss.employeeId)] = ss as unknown as Record<string, unknown>; });

  const payroll = await Payroll.create({
    companyId,
    month,
    year,
    status: 'PROCESSING',
    processedBy: userId,
    processedAt: new Date(),
    totalEmployees: employees.length,
  });

  const payslips: Record<string, unknown>[] = [];
  let totalAmount = 0;

  for (const emp of employees) {
    const ss = salaryMap[String(emp._id)];
    if (!ss) continue;

    const grossSalary = ss.grossSalary as number;
    const netSalary = ss.netSalary as number;

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

const getPayrollById = async (companyId: string, id: string): Promise<any> => {
  const payroll = await Payroll.findOne({ _id: id, companyId })
    .populate('processedBy', 'email')
    .lean();
  if (!payroll) throw new AppError(404, 'NOT_FOUND', 'Payroll not found');

  const payslips = await Payslip.find({ payrollId: id })
    .populate('employeeId', 'firstName lastName employeeCode departmentId')
    .lean();

  return { ...payroll, payslips };
};

const getPayslip = async (companyId: string, id: string) => {
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

const exportPayslips = async (companyId: string, query: QueryParams & { payrollId?: string }) => {
  const filter: Record<string, unknown> = { companyId };
  if (query.payrollId) filter.payrollId = query.payrollId;
  if (query.employeeId) filter.employeeId = query.employeeId;

  return Payslip.find(filter)
    .populate('employeeId', 'firstName lastName employeeCode')
    .populate('payrollId', 'month year')
    .sort({ 'payrollId.year': -1 as const, 'payrollId.month': -1 as const })
    .lean();
};

const getSalaryStructure = async (companyId: string, employeeId: string) => {
  const ss = await SalaryStructure.findOne({ employeeId, companyId })
    .populate('employeeId', 'firstName lastName employeeCode')
    .lean();
  if (!ss) throw new AppError(404, 'NOT_FOUND', 'Salary structure not found');
  return ss;
};

const createSalaryStructure = async (companyId: string, data: Record<string, unknown>) => {
  const existing = await SalaryStructure.findOne({ employeeId: data.employeeId });
  if (existing) throw new AppError(409, 'CONFLICT', 'Salary structure already exists for this employee');

  const otherAllowances = data.otherAllowances as { amount: number }[] || [];
  const deductions = data.deductions as { amount: number }[] || [];
  const totalAllowances = otherAllowances.reduce((sum: number, a: { amount: number }) => sum + a.amount, 0);
  const totalDeductions = deductions.reduce((sum: number, d: { amount: number }) => sum + d.amount, 0);
  const grossSalary = (data.basicSalary as number) + (data.hra as number) + (data.ta as number) + (data.da as number) + totalAllowances;
  const netSalary = grossSalary - (data.pf as number || 0) - (data.esi as number || 0) - totalDeductions;

  if (netSalary < 0) throw new AppError(400, 'BAD_REQUEST', 'Net salary cannot be negative');

  return SalaryStructure.create({
    ...data,
    companyId,
    grossSalary,
    netSalary,
  });
};

const updateSalaryStructure = async (companyId: string, employeeId: string, data: Record<string, unknown>) => {
  const ss = await SalaryStructure.findOne({ employeeId, companyId });
  if (!ss) throw new AppError(404, 'NOT_FOUND', 'Salary structure not found');

  const merged = { ...ss.toObject(), ...data };

  const otherAllowances = merged.otherAllowances as { amount: number }[] || [];
  const deductions = merged.deductions as { amount: number }[] || [];
  const totalAllowances = otherAllowances.reduce((sum: number, a: { amount: number }) => sum + a.amount, 0);
  const totalDeductions = deductions.reduce((sum: number, d: { amount: number }) => sum + d.amount, 0);
  const grossSalary = (merged.basicSalary as number) + (merged.hra as number) + (merged.ta as number) + (merged.da as number) + totalAllowances;
  const netSalary = grossSalary - (merged.pf as number || 0) - (merged.esi as number || 0) - totalDeductions;

  if (netSalary < 0) throw new AppError(400, 'BAD_REQUEST', 'Net salary cannot be negative');

  const updated = await SalaryStructure.findOneAndUpdate(
    { employeeId, companyId },
    { ...data, grossSalary, netSalary },
    { new: true, runValidators: true }
  );
  return updated;
};

const listAssets = async (companyId: string, query: QueryParams): Promise<any> => {
  const { page, limit, skip } = paginateQuery(query.page, Number(query.limit));
  const filter: Record<string, unknown> = { companyId };

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

const createAsset = async (companyId: string, data: Record<string, unknown>) => {
  const existing = await Asset.findOne({ code: data.code as string, companyId });
  if (existing) throw new AppError(409, 'CONFLICT', 'Asset code already exists');
  return Asset.create({ ...data, companyId });
};

const updateAsset = async (companyId: string, id: string, data: Record<string, unknown>) => {
  if (data.code) {
    const existing = await Asset.findOne({ code: data.code as string, companyId, _id: { $ne: id } });
    if (existing) throw new AppError(409, 'CONFLICT', 'Asset code already in use');
  }
  const asset = await Asset.findOneAndUpdate({ _id: id, companyId }, data, {
    new: true,
    runValidators: true,
  });
  if (!asset) throw new AppError(404, 'NOT_FOUND', 'Asset not found');
  return asset;
};

const removeAsset = async (companyId: string, id: string) => {
  const asset = await Asset.findOneAndDelete({ _id: id, companyId });
  if (!asset) throw new AppError(404, 'NOT_FOUND', 'Asset not found');
  return asset;
};

const assignAsset = async (companyId: string, id: string, data: Record<string, unknown>) => {
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

  asset.currentAssigneeId = data.employeeId as mongoose.Types.ObjectId;
  asset.status = 'ASSIGNED';
  await asset.save();

  return { assignment, asset };
};

const returnAsset = async (companyId: string, id: string, data: Record<string, unknown>) => {
  const asset = await Asset.findOne({ _id: id, companyId });
  if (!asset) throw new AppError(404, 'NOT_FOUND', 'Asset not found');
  if (asset.status !== 'ASSIGNED') throw new AppError(400, 'BAD_REQUEST', 'Asset is not currently assigned');

  const currentAssignment = await AssetAssignment.findOne({
    assetId: id,
    returnedAt: { $exists: false },
  });
  if (currentAssignment) {
    currentAssignment.returnedAt = new Date();
    currentAssignment.condition = (data.condition as string) || currentAssignment.condition;
    currentAssignment.notes = (data.notes as string) || currentAssignment.notes;
    await currentAssignment.save();
  }

  asset.currentAssigneeId = null as unknown as mongoose.Types.ObjectId | undefined;
  asset.status = 'AVAILABLE';
  await asset.save();

  return asset;
};

const getAttendanceReport = async (companyId: string, query: QueryParams) => {
  const { fromDate, toDate, departmentId } = query;
  const match: Record<string, unknown> = { companyId };

  if (fromDate || toDate) {
    match.date = {};
    if (fromDate) (match.date as Record<string, unknown>).$gte = new Date(fromDate);
    if (toDate) (match.date as Record<string, unknown>).$lte = new Date(toDate);
  }

  const pipeline: Record<string, unknown>[] = [
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

  return Attendance.aggregate(pipeline as any[]);
};

const getLeaveReport = async (companyId: string, query: QueryParams) => {
  const { fromDate, toDate, departmentId } = query;
  const match: Record<string, unknown> = { companyId, status: { $ne: 'CANCELLED' } };

  if (fromDate || toDate) {
    match.createdAt = {};
    if (fromDate) (match.createdAt as Record<string, unknown>).$gte = new Date(fromDate);
    if (toDate) (match.createdAt as Record<string, unknown>).$lte = new Date(toDate);
  }

  const pipeline: Record<string, unknown>[] = [
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

  return LeaveRequest.aggregate(pipeline as any[]);
};

const getPayrollReport = async (companyId: string, query: QueryParams) => {
  const { fromDate, toDate } = query;
  const match: Record<string, unknown> = { companyId, status: 'PROCESSED' };

  if (fromDate || toDate) {
    match.createdAt = {};
    if (fromDate) (match.createdAt as Record<string, unknown>).$gte = new Date(fromDate);
    if (toDate) (match.createdAt as Record<string, unknown>).$lte = new Date(toDate);
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

const getHeadcountReport = async (companyId: string, query: QueryParams) => {
  const { departmentId } = query;
  const match: Record<string, unknown> = { companyId, status: 'ACTIVE' };
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

const getAttritionReport = async (companyId: string, query: QueryParams) => {
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

export {
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
