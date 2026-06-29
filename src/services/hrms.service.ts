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
import RegularizationRequest from '../models/RegularizationRequest';
import PerformanceGoal from '../models/PerformanceGoal';
import PerformanceAppraisal from '../models/PerformanceAppraisal';
import PerformanceFeedback from '../models/PerformanceFeedback';
import TrainingCourse from '../models/TrainingCourse';
import TrainingEnrollment from '../models/TrainingEnrollment';
import TrainingCertification from '../models/TrainingCertification';
import TransferRequest from '../models/TransferRequest';
import Promotion from '../models/Promotion';
import EmployeeHistory from '../models/EmployeeHistory';
import ExitResignation from '../models/ExitResignation';
import ExitChecklist from '../models/ExitChecklist';
import ExitClearance from '../models/ExitClearance';
import ExitSettlement from '../models/ExitSettlement';
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
        : String(result.designationId);
    } else {
      result.designationId = String(result.designationId);
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

  // Clone filter for summary aggregation, omitting status criteria so headcount counts stay visible
  const summaryFilter: Record<string, any> = { ...filter };
  delete summaryFilter.status;

  // Cast string IDs to Mongoose ObjectIds for aggregate match stage
  if (summaryFilter.companyId && typeof summaryFilter.companyId === 'string') {
    summaryFilter.companyId = new mongoose.Types.ObjectId(summaryFilter.companyId);
  }
  if (summaryFilter.departmentId && typeof summaryFilter.departmentId === 'string') {
    summaryFilter.departmentId = new mongoose.Types.ObjectId(summaryFilter.departmentId);
  }
  if (summaryFilter.designationId && typeof summaryFilter.designationId === 'string') {
    summaryFilter.designationId = new mongoose.Types.ObjectId(summaryFilter.designationId);
  }

  const [employees, total, summaryAgg] = await Promise.all([
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
    Employee.aggregate([
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

  summaryAgg.forEach((item: any) => {
    const count = item.count || 0;
    totalHeadcount += count;

    const statusKey = String(item._id || '').toUpperCase();
    if (statusKey === 'ACTIVE') {
      activeStaff = count;
    } else if (statusKey === 'ON_LEAVE' || statusKey === 'ONLEAVE') {
      onLeave = count;
    } else if (statusKey === 'INACTIVE' || statusKey === 'TERMINATED') {
      inactive += count;
    } else if (statusKey === 'SUSPENDED') {
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

  return { employees: employees.map(transformEmployee), meta: buildMeta(total, page, limit), summary };
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

const hardDeleteEmployee = async (companyId: string, id: string) => {
  const employee = await Employee.findOne({ _id: id, companyId });
  if (!employee) throw new AppError(404, 'NOT_FOUND', 'Employee not found');
  if (employee.status === 'ACTIVE') {
    throw new AppError(400, 'BAD_REQUEST', 'Cannot permanently delete an active employee. Deactivate first.');
  }
  await Promise.all([
    Attendance.deleteMany({ employeeId: id }),
    LeaveRequest.deleteMany({ employeeId: id }),
    LeaveBalance.deleteMany({ employeeId: id }),
    Payslip.deleteMany({ employeeId: id }),
    SalaryStructure.deleteMany({ employeeId: id }),
    AssetAssignment.deleteMany({ employeeId: id }),
  ]);
  await Employee.findOneAndDelete({ _id: id, companyId });
  return { message: 'Employee permanently deleted', employeeId: id };
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

  // Helper function to normalize keys
  const normalizeKey = (key: string): string => {
    return key.toLowerCase().replace(/[^a-z0-9]/g, '');
  };

  // Fetch existing departments and designations for lookup
  const departments = await Department.find({ companyId }).lean();
  const departmentMap = new Map<string, any>();
  departments.forEach(dept => {
    departmentMap.set(dept.name.toLowerCase(), dept);
    if (dept.code) {
      departmentMap.set(dept.code.toLowerCase(), dept);
    }
    departmentMap.set(dept._id.toString(), dept);
  });

  const designations = await Designation.find({ companyId, deletedAt: null }).lean();
  const designationMap = new Map<string, any>();
  designations.forEach(desig => {
    designationMap.set(desig.name.toLowerCase(), desig);
    if (desig.designationCode) {
      designationMap.set(desig.designationCode.toLowerCase(), desig);
    }
    designationMap.set(desig._id.toString(), desig);
  });

  // Fetch existing employees to verify email & employee code uniqueness
  const existingEmployees = await Employee.find({ companyId }, '_id employeeCode email').lean();
  const existingCodes = new Set(existingEmployees.map(emp => emp.employeeCode.toLowerCase()));
  const existingEmails = new Set(existingEmployees.map(emp => emp.email.toLowerCase()));

  // Map existing employees for manager lookup
  const employeeMap = new Map<string, any>();
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
  const csvCodes = new Set<string>();
  const csvEmails = new Set<string>();

  for (let i = 0; i < employeesData.length; i++) {
    const row = employeesData[i]!;
    const rowNum = i + 1;

    try {
      // Map row keys to standard keys
      const mappedRow: Record<string, string> = {};
      for (const [key, val] of Object.entries(row)) {
        const normKey = normalizeKey(key);
        const strVal = typeof val === 'string' ? val.trim() : (val !== null && val !== undefined ? String(val).trim() : '');
        
        if (normKey === 'employeecode' || normKey === 'code') {
          mappedRow.employeeCode = strVal;
        } else if (normKey === 'firstname' || normKey === 'fname') {
          mappedRow.firstName = strVal;
        } else if (normKey === 'lastname' || normKey === 'lname') {
          mappedRow.lastName = strVal;
        } else if (normKey === 'email') {
          mappedRow.email = strVal;
        } else if (normKey === 'designation' || normKey === 'designationname' || normKey === 'designationcode') {
          mappedRow.designation = strVal;
        } else if (normKey === 'employmenttype' || normKey === 'type') {
          mappedRow.employmentType = strVal;
        } else if (normKey === 'phone' || normKey === 'phonenumber') {
          mappedRow.phone = strVal;
        } else if (normKey === 'department' || normKey === 'departmentname' || normKey === 'departmentcode' || normKey === 'departmentid') {
          mappedRow.department = strVal;
        } else if (normKey === 'manager' || normKey === 'managerid' || normKey === 'reportingmanager' || normKey === 'reportingmanagerid') {
          mappedRow.manager = strVal;
        } else if (normKey === 'dateofjoining' || normKey === 'joiningdate' || normKey === 'date') {
          mappedRow.joiningDate = strVal;
        } else {
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
      let employmentType: string;
      if (typeLower === 'fulltime' || typeLower === 'full') {
        employmentType = 'FULL_TIME';
      } else if (typeLower === 'parttime' || typeLower === 'part') {
        employmentType = 'PART_TIME';
      } else if (typeLower === 'contract') {
        employmentType = 'CONTRACT';
      } else if (typeLower === 'intern') {
        employmentType = 'INTERN';
      } else {
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
    } catch (err) {
      errors.push({ row: rowNum, message: (err as Error).message });
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
    const created = await Employee.insertMany(valid, { ordered: true });
    createdCount = created.length;
    console.log(`Successfully bulk imported ${createdCount} employees`);
  }

  return { inserted: createdCount, failed: 0, errors: [] };
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

const listDesignations = async (companyId: string, query: Record<string, unknown>) => {
  const { page, limit, skip } = paginateQuery(query.page as string, Number(query.limit));
  const filter: Record<string, unknown> = { companyId, deletedAt: null };

  if (query.search) {
    const searchRegex = new RegExp(String(query.search), 'i');
    filter.$or = [
      { name: searchRegex },
      { designationCode: searchRegex },
    ];
  }

  if (query.departmentId) filter.departmentId = query.departmentId;
  if (query.status) filter.status = query.status;
  if (query.isActive !== undefined) filter.isActive = query.isActive === 'true' || query.isActive === true;

  const sortField = (query.sortBy as string) || 'hierarchyOrder';
  const sortOrder = query.sortOrder === 'desc' ? -1 : 1;

  const [designations, total] = await Promise.all([
    Designation.find(filter)
      .sort({ [sortField]: sortOrder })
      .skip(skip)
      .limit(limit)
      .populate('departmentId', 'name')
      .populate('createdBy', 'firstName lastName')
      .populate('updatedBy', 'firstName lastName')
      .lean(),
    Designation.countDocuments(filter),
  ]);

  const meta = buildMeta(total, page, limit);
  return { data: designations, meta };
};

const listAllDesignations = async (companyId: string) => {
  return Designation.find({ companyId, deletedAt: null })
    .sort({ hierarchyOrder: 1, level: 1 })
    .populate('departmentId', 'name')
    .lean();
};

const getDesignationById = async (companyId: string, id: string) => {
  const designation = await Designation.findOne({ _id: id, companyId, deletedAt: null })
    .populate('departmentId', 'name')
    .populate('createdBy', 'firstName lastName')
    .populate('updatedBy', 'firstName lastName')
    .lean();
  if (!designation) throw new AppError(404, 'NOT_FOUND', 'Designation not found');
  return designation;
};

const createDesignation = async (companyId: string, data: Record<string, unknown>, userId?: string) => {
  const existing = await Designation.findOne({
    name: data.name as string,
    companyId,
    deletedAt: null,
  });
  if (existing) throw new AppError(409, 'CONFLICT', 'Designation name already exists in this company');

  if (data.departmentId) {
    const dept = await Department.findById(data.departmentId);
    if (!dept) throw new AppError(404, 'NOT_FOUND', 'Department not found');
  }

  if (data.designationCode) {
    const codeExists = await Designation.findOne({
      designationCode: data.designationCode as string,
      companyId,
      deletedAt: null,
    });
    if (codeExists) throw new AppError(409, 'CONFLICT', 'Designation code already exists');
  }

  const designation = await Designation.create({
    ...data,
    companyId,
    createdBy: userId,
    updatedBy: userId,
  });
  return designation;
};

const updateDesignation = async (companyId: string, id: string, data: Record<string, unknown>, userId?: string) => {
  const existing = await Designation.findOne({ _id: id, companyId, deletedAt: null });
  if (!existing) throw new AppError(404, 'NOT_FOUND', 'Designation not found');

  if (data.name) {
    const nameExists = await Designation.findOne({
      name: data.name as string,
      companyId,
      _id: { $ne: id },
      deletedAt: null,
    });
    if (nameExists) throw new AppError(409, 'CONFLICT', 'Designation name already in use');
  }

  if (data.designationCode) {
    const codeExists = await Designation.findOne({
      designationCode: data.designationCode as string,
      companyId,
      _id: { $ne: id },
      deletedAt: null,
    });
    if (codeExists) throw new AppError(409, 'CONFLICT', 'Designation code already in use');
  }

  if (data.departmentId) {
    const dept = await Department.findById(data.departmentId);
    if (!dept) throw new AppError(404, 'NOT_FOUND', 'Department not found');
  }

  const designation = await Designation.findOneAndUpdate(
    { _id: id, companyId, deletedAt: null },
    { ...data, updatedBy: userId },
    { new: true, runValidators: true }
  );
  if (!designation) throw new AppError(404, 'NOT_FOUND', 'Designation not found');
  return designation;
};

const removeDesignation = async (companyId: string, id: string, force?: boolean) => {
  const activeCount = await Employee.countDocuments({ designationId: id, companyId, status: { $in: ['ACTIVE', 'active'] } });
  if (activeCount > 0 && !force) {
    throw new AppError(400, 'BAD_REQUEST', `Cannot delete designation with ${activeCount} active employee(s). Use force=true to override.`);
  }

  const designation = await Designation.findOneAndUpdate(
    { _id: id, companyId, deletedAt: null },
    { deletedAt: new Date(), isActive: false },
    { new: true }
  );
  if (!designation) throw new AppError(404, 'NOT_FOUND', 'Designation not found');
  return designation;
};

const restoreDesignation = async (companyId: string, id: string) => {
  const designation = await Designation.findOneAndUpdate(
    { _id: id, companyId, deletedAt: { $ne: null } },
    { deletedAt: null, isActive: true },
    { new: true }
  );
  if (!designation) throw new AppError(404, 'NOT_FOUND', 'Designation not found or not deleted');
  return designation;
};

const bulkDeleteDesignations = async (companyId: string, ids: string[], force?: boolean) => {
  const activeEmployees = await Employee.countDocuments({
    designationId: { $in: ids },
    companyId,
    status: { $in: ['ACTIVE', 'active'] },
  });
  if (activeEmployees > 0 && !force) {
    throw new AppError(400, 'BAD_REQUEST', `${activeEmployees} active employee(s) have these designations. Use force=true to override.`);
  }

  const result = await Designation.updateMany(
    { _id: { $in: ids }, companyId, deletedAt: null },
    { $set: { deletedAt: new Date(), isActive: false } }
  );
  return { modifiedCount: result.modifiedCount };
};

const bulkRestoreDesignations = async (companyId: string, ids: string[]) => {
  const result = await Designation.updateMany(
    { _id: { $in: ids }, companyId, deletedAt: { $ne: null } },
    { $set: { deletedAt: null, isActive: true } }
  );
  return { modifiedCount: result.modifiedCount };
};

const changeDesignationStatus = async (companyId: string, id: string, status: string, userId?: string) => {
  const designation = await Designation.findOneAndUpdate(
    { _id: id, companyId, deletedAt: null },
    { status, updatedBy: userId },
    { new: true }
  );
  if (!designation) throw new AppError(404, 'NOT_FOUND', 'Designation not found');
  return designation;
};

const exportDesignationsCSV = async (companyId: string, filter: Record<string, unknown>) => {
  const query: Record<string, unknown> = { companyId, deletedAt: null };
  if (filter.departmentId) query.departmentId = filter.departmentId;
  if (filter.status) query.status = filter.status;

  const designations = await Designation.find(query)
    .populate('departmentId', 'name')
    .sort({ hierarchyOrder: 1 })
    .lean();

  const header = 'Name,Code,Department,Level,Status,Hierarchy Order,Employment Types\n';
  const rows = designations.map((d: Record<string, unknown>) =>
    `"${d.name || ''}","${d.designationCode || ''}","${(d.departmentId as Record<string, unknown>)?.name || ''}",${d.level ?? ''},${d.status || 'ACTIVE'},${d.hierarchyOrder ?? ''},"${Array.isArray(d.employmentTypes) ? (d.employmentTypes as string[]).join('; ') : ''}"`
  ).join('\n');

  return header + rows;
};

const exportDesignationsExcel = async (companyId: string, filter: Record<string, unknown>) => {
  const query: Record<string, unknown> = { companyId, deletedAt: null };
  if (filter.departmentId) query.departmentId = filter.departmentId;
  if (filter.status) query.status = filter.status;

  const designations = await Designation.find(query)
    .populate('departmentId', 'name')
    .sort({ hierarchyOrder: 1 })
    .lean();

  return designations.map((d: Record<string, unknown>) => ({
    Name: d.name || '',
    Code: d.designationCode || '',
    Department: (d.departmentId as Record<string, unknown>)?.name || '',
    Level: d.level ?? '',
    Status: d.status || 'ACTIVE',
    'Hierarchy Order': d.hierarchyOrder ?? '',
    'Employment Types': Array.isArray(d.employmentTypes) ? (d.employmentTypes as string[]).join('; ') : '',
  }));
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

// ─── EMPLOYEE FULL UPDATE (PUT) ─────────────────────────────────────────────

const fullUpdateEmployee = async (companyId: string, id: string, rawData: Record<string, unknown>) => {
  const data = await normalizeEmployeeData(companyId, rawData);
  if (data.email) {
    const existing = await Employee.findOne({ email: data.email as string, _id: { $ne: id } });
    if (existing) throw new AppError(409, 'CONFLICT', 'Email already in use');
  }
  const employee = await Employee.findOneAndUpdate({ _id: id, companyId }, data, {
    new: true,
    runValidators: true,
    overwrite: true,
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

// ─── EMPLOYEE PROFILE ────────────────────────────────────────────────────────

const getEmployeeProfile = async (companyId: string, id: string) => {
  const employee = await Employee.findOne({ _id: id, companyId })
    .select('personalEmail phone alternatePhone dob gender bloodGroup maritalStatus avatar address emergencyContact bankDetails panNumber aadharNumber')
    .lean();
  if (!employee) throw new AppError(404, 'NOT_FOUND', 'Employee not found');
  return employee;
};

const updateEmployeeProfile = async (companyId: string, id: string, data: Record<string, unknown>) => {
  const upd: Record<string, unknown> = {};
  const personalFields = ['personalEmail', 'phone', 'alternatePhone', 'dob', 'gender', 'bloodGroup', 'maritalStatus', 'avatar', 'panNumber', 'aadharNumber'];
  personalFields.forEach(f => { if (data[f] !== undefined) upd[f] = data[f]; });

  if (data.gender) upd.gender = (data.gender as string).toUpperCase();

  if (data.address && typeof data.address === 'object') {
    upd.address = data.address;
  } else if (typeof data.address === 'string') {
    upd.address = { street: data.address, city: '', state: '', country: '', zip: '' };
  }

  if (data.emergencyContact) upd.emergencyContact = data.emergencyContact;
  if (data.bankDetails) upd.bankDetails = data.bankDetails;

  const employee = await Employee.findOneAndUpdate({ _id: id, companyId }, upd, {
    new: true,
    runValidators: true,
  });
  if (!employee) throw new AppError(404, 'NOT_FOUND', 'Employee not found');
  return employee;
};

// ─── EMPLOYEE STATUS ─────────────────────────────────────────────────────────

const updateEmployeeStatus = async (companyId: string, id: string, data: Record<string, unknown>) => {
  const upd: Record<string, unknown> = { status: (data.status as string).toUpperCase() };
  if (data.exitDate) upd.exitDate = new Date(data.exitDate as string);
  if (data.exitReason) upd.exitReason = data.exitReason;

  const employee = await Employee.findOneAndUpdate({ _id: id, companyId }, upd, {
    new: true,
    runValidators: true,
  });
  if (!employee) throw new AppError(404, 'NOT_FOUND', 'Employee not found');

  await EmployeeHistory.create({
    employeeId: id,
    companyId,
    changeType: 'STATUS_CHANGE',
    newValue: upd.status as string,
    effectiveDate: new Date(),
    reason: (data.exitReason as string) || undefined,
  });

  return employee;
};

// ─── EMPLOYEE HISTORY ────────────────────────────────────────────────────────

const getEmployeeHistory = async (companyId: string, id: string) => {
  return EmployeeHistory.find({ employeeId: id, companyId })
    .populate('changedBy', 'firstName lastName email')
    .populate('oldDepartmentId', 'name')
    .populate('newDepartmentId', 'name')
    .populate('oldDesignationId', 'name')
    .populate('newDesignationId', 'name')
    .sort({ createdAt: -1 })
    .lean();
};

// ─── ATTENDANCE CHECKIN ──────────────────────────────────────────────────────

const checkin = async (companyId: string, data: Record<string, unknown>) => {
  const today = data.date ? new Date(data.date as string) : new Date();
  today.setHours(0, 0, 0, 0);
  const todayEnd = new Date(today);
  todayEnd.setHours(23, 59, 59, 999);

  const existing = await Attendance.findOne({
    employeeId: data.employeeId,
    companyId,
    date: { $gte: today, $lte: todayEnd },
  });

  if (existing) {
    if (existing.checkIn) throw new AppError(409, 'CONFLICT', 'Already checked in today');
    existing.checkIn = data.checkIn ? new Date(data.checkIn as string) : new Date();
    existing.source = (data.source as string) || 'APP';
    if (data.notes) existing.notes = data.notes as string;
    existing.status = 'PRESENT';
    await existing.save();
    return existing;
  }

  const checkInTime = data.checkIn ? new Date(data.checkIn as string) : new Date();
  const record = await Attendance.create({
    employeeId: data.employeeId,
    companyId,
    date: today,
    checkIn: checkInTime,
    source: (data.source as string) || 'APP',
    notes: data.notes,
    status: 'PRESENT',
  });
  return record;
};

// ─── ATTENDANCE CHECKOUT ─────────────────────────────────────────────────────

const checkout = async (companyId: string, data: Record<string, unknown>) => {
  const today = data.date ? new Date(data.date as string) : new Date();
  today.setHours(0, 0, 0, 0);
  const todayEnd = new Date(today);
  todayEnd.setHours(23, 59, 59, 999);

  const record = await Attendance.findOne({
    employeeId: data.employeeId,
    companyId,
    date: { $gte: today, $lte: todayEnd },
  });

  if (!record) throw new AppError(404, 'NOT_FOUND', 'No check-in found for today');
  if (record.checkOut) throw new AppError(409, 'CONFLICT', 'Already checked out today');

  record.checkOut = data.checkOut ? new Date(data.checkOut as string) : new Date();
  record.workingHours = calculateWorkingHours(record.checkIn, record.checkOut);
  if (data.notes) record.notes = data.notes as string;
  await record.save();
  return record;
};

// ─── ATTENDANCE REGULARIZE ───────────────────────────────────────────────────

const createRegularization = async (companyId: string, data: Record<string, unknown>) => {
  const existing = await RegularizationRequest.findOne({
    employeeId: data.employeeId,
    date: data.date,
    status: 'PENDING',
  });
  if (existing) throw new AppError(409, 'CONFLICT', 'A pending regularization request already exists for this date');

  return RegularizationRequest.create({ ...data, companyId });
};

const approveRejectRegularization = async (companyId: string, id: string, data: Record<string, unknown>) => {
  const req = await RegularizationRequest.findOne({ _id: id, companyId, status: 'PENDING' });
  if (!req) throw new AppError(404, 'NOT_FOUND', 'Regularization request not found or already processed');

  req.status = data.status as string;
  req.comments = (data.comments as string) || req.comments;

  if (data.status === 'APPROVED') {
    const existing = await Attendance.findOne({ employeeId: req.employeeId, date: req.date });
    if (existing) {
      if (req.checkIn) existing.checkIn = req.checkIn;
      if (req.checkOut) existing.checkOut = req.checkOut;
      if (existing.checkIn && existing.checkOut) {
        existing.workingHours = calculateWorkingHours(existing.checkIn, existing.checkOut);
      }
      await existing.save();
    } else {
      await Attendance.create({
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

// ─── PAYROLL — EMPLOYEE PAYSLIPS ─────────────────────────────────────────────

const getEmployeePayslips = async (companyId: string, employeeId: string) => {
  return Payslip.find({ employeeId, companyId })
    .populate({
      path: 'payrollId',
      select: 'month year status',
    })
    .sort({ createdAt: -1 })
    .lean();
};

const getPayslipByMonthYear = async (companyId: string, month: string, year: string) => {
  const payroll = await Payroll.findOne({ companyId, month: parseInt(month), year: parseInt(year) });
  if (!payroll) throw new AppError(404, 'NOT_FOUND', 'Payroll not found for this period');

  const payslips = await Payslip.find({ payrollId: payroll._id, companyId })
    .populate('employeeId', 'firstName lastName employeeCode departmentId')
    .lean();

  return { payroll, payslips };
};

const getEmployeeTaxDetails = async (companyId: string, employeeId: string) => {
  const employee = await Employee.findOne({ _id: employeeId, companyId }).lean();
  if (!employee) throw new AppError(404, 'NOT_FOUND', 'Employee not found');

  const ss = await SalaryStructure.findOne({ employeeId, companyId }).lean();
  if (!ss) throw new AppError(404, 'NOT_FOUND', 'Salary structure not found');

  const currentYear = new Date().getFullYear();
  const payslips = await Payslip.find({
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

const getEmployeeDeductions = async (companyId: string, employeeId: string) => {
  const employee = await Employee.findOne({ _id: employeeId, companyId }).lean();
  if (!employee) throw new AppError(404, 'NOT_FOUND', 'Employee not found');

  const ss = await SalaryStructure.findOne({ employeeId, companyId }).lean();
  if (!ss) throw new AppError(404, 'NOT_FOUND', 'Salary structure not found');

  const payslips = await Payslip.find({ employeeId, companyId })
    .sort({ createdAt: -1 })
    .limit(12)
    .lean();

  const deductionSummary = {
    pf: { perMonth: ss.pf || 0, annual: (ss.pf || 0) * 12 },
    esi: { perMonth: ss.esi || 0, annual: (ss.esi || 0) * 12 },
    tds: { perMonth: 0, annual: 0 },
    customDeductions: (ss.deductions as Array<{ name: string; amount: number }> || []).map(d => ({
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

// ─── DOCUMENTS — REQUEST LETTER ──────────────────────────────────────────────

const requestLetter = async (companyId: string, employeeId: string, data: Record<string, unknown>) => {
  const employee = await Employee.findOne({ _id: employeeId, companyId })
    .populate('departmentId', 'name')
    .populate('designationId', 'name')
    .lean();
  if (!employee) throw new AppError(404, 'NOT_FOUND', 'Employee not found');

  const letterContent = (data.content as string) || '';
  const letterType = data.type as string;

  return {
    employeeId,
    type: letterType,
    content: letterContent,
    notes: data.notes,
    generatedAt: new Date().toISOString(),
    message: `${letterType} letter request submitted successfully`,
  };
};

// ─── PERFORMANCE GOALS ────────────────────────────────────────────────────────

const listPerformanceGoals = async (companyId: string, employeeId: string, query: QueryParams) => {
  const { page, limit, skip } = paginateQuery(query.page, Number(query.limit));
  const filter: Record<string, unknown> = { employeeId, companyId };
  if (query.status) filter.status = query.status;

  const [goals, total] = await Promise.all([
    PerformanceGoal.find(filter)
      .populate('createdBy', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    PerformanceGoal.countDocuments(filter),
  ]);

  return { goals, meta: buildMeta(total, page, limit) };
};

const createPerformanceGoal = async (companyId: string, data: Record<string, unknown>, userId: string) => {
  return PerformanceGoal.create({ ...data, companyId, createdBy: userId });
};

const updatePerformanceGoal = async (companyId: string, id: string, data: Record<string, unknown>) => {
  const goal = await PerformanceGoal.findOneAndUpdate({ _id: id, companyId }, data, {
    new: true,
    runValidators: true,
  });
  if (!goal) throw new AppError(404, 'NOT_FOUND', 'Performance goal not found');
  return goal;
};

// ─── PERFORMANCE APPRAISAL ───────────────────────────────────────────────────

const submitAppraisal = async (companyId: string, data: Record<string, unknown>, userId: string) => {
  return PerformanceAppraisal.create({ ...data, companyId, reviewerId: userId, reviewDate: new Date(), status: 'SUBMITTED' });
};

const getAppraisalHistory = async (companyId: string, employeeId: string) => {
  return PerformanceAppraisal.find({ employeeId, companyId })
    .populate('reviewerId', 'firstName lastName email')
    .sort({ createdAt: -1 })
    .lean();
};

// ─── PERFORMANCE FEEDBACK ────────────────────────────────────────────────────

const submitFeedback = async (companyId: string, data: Record<string, unknown>, userId: string) => {
  return PerformanceFeedback.create({ ...data, companyId, fromEmployeeId: userId, submittedAt: new Date() });
};

// ─── TRAINING COURSES ────────────────────────────────────────────────────────

const listTrainingCourses = async (companyId: string, query: QueryParams) => {
  const { page, limit, skip } = paginateQuery(query.page, Number(query.limit));
  const filter: Record<string, unknown> = { companyId };
  if (query.status) filter.status = query.status;
  if (query.category) filter.category = query.category;

  const [courses, total] = await Promise.all([
    TrainingCourse.find(filter)
      .sort({ startDate: 1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    TrainingCourse.countDocuments(filter),
  ]);

  return { courses, meta: buildMeta(total, page, limit) };
};

// ─── TRAINING ENROLLMENT ─────────────────────────────────────────────────────

const enrollCourse = async (companyId: string, data: Record<string, unknown>) => {
  const existing = await TrainingEnrollment.findOne({
    courseId: data.courseId,
    employeeId: data.employeeId,
  });
  if (existing) throw new AppError(409, 'CONFLICT', 'Already enrolled in this course');

  const course = await TrainingCourse.findOne({ _id: data.courseId, companyId });
  if (!course) throw new AppError(404, 'NOT_FOUND', 'Course not found');

  if (course.maxParticipants) {
    const enrolledCount = await TrainingEnrollment.countDocuments({
      courseId: data.courseId,
      status: { $in: ['ENROLLED', 'IN_PROGRESS'] },
    });
    if (enrolledCount >= course.maxParticipants) {
      throw new AppError(400, 'BAD_REQUEST', 'Course has reached maximum participants');
    }
  }

  return TrainingEnrollment.create({
    ...data,
    companyId,
    enrolledAt: new Date(),
    status: 'ENROLLED',
  });
};

const completeCourse = async (companyId: string, enrollmentId: string, data: Record<string, unknown>) => {
  const enrollment = await TrainingEnrollment.findOne({ _id: enrollmentId, companyId });
  if (!enrollment) throw new AppError(404, 'NOT_FOUND', 'Enrollment not found');

  enrollment.status = 'COMPLETED';
  enrollment.completionDate = new Date();
  if (data.score !== undefined) enrollment.score = data.score as number;
  if (data.feedback) enrollment.feedback = data.feedback as string;
  await enrollment.save();

  return enrollment;
};

// ─── TRAINING HISTORY & CERTIFICATIONS ──────────────────────────────────────

const getTrainingHistory = async (companyId: string, employeeId: string) => {
  return TrainingEnrollment.find({ employeeId, companyId })
    .populate('courseId', 'title provider category duration')
    .sort({ enrolledAt: -1 })
    .lean();
};

const getTrainingCertifications = async (companyId: string, employeeId: string) => {
  return TrainingCertification.find({ employeeId, companyId })
    .populate('courseId', 'title provider')
    .sort({ issueDate: -1 })
    .lean();
};

// ─── TRANSFER REQUESTS ───────────────────────────────────────────────────────

const createTransferRequest = async (companyId: string, data: Record<string, unknown>, userId: string) => {
  const employee = await Employee.findOne({ _id: data.employeeId, companyId }).lean();
  if (!employee) throw new AppError(404, 'NOT_FOUND', 'Employee not found');

  return TransferRequest.create({
    ...data,
    companyId,
    fromDepartmentId: employee.departmentId,
    fromDesignationId: employee.designationId,
    fromBranchId: employee.branchId,
    requestedBy: userId,
    status: 'PENDING',
  });
};

const approveRejectTransfer = async (companyId: string, id: string, data: Record<string, unknown>, userId: string) => {
  const transfer = await TransferRequest.findOne({ _id: id, companyId, status: 'PENDING' });
  if (!transfer) throw new AppError(404, 'NOT_FOUND', 'Transfer request not found or already processed');

  transfer.status = data.status as string;
  transfer.approvedBy = userId as any;
  transfer.approvedAt = new Date();
  transfer.comments = (data.comments as string) || transfer.comments;

  if (data.status === 'APPROVED') {
    const upd: Record<string, unknown> = {};
    if (transfer.toDepartmentId) {
      upd.departmentId = transfer.toDepartmentId;
      await EmployeeHistory.create({
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
      await EmployeeHistory.create({
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
    if (transfer.toBranchId) upd.branchId = transfer.toBranchId;
    if (Object.keys(upd).length > 0) {
      await Employee.updateOne({ _id: transfer.employeeId }, upd);
    }
  }

  await transfer.save();
  return transfer;
};

// ─── PROMOTIONS ──────────────────────────────────────────────────────────────

const createPromotion = async (companyId: string, data: Record<string, unknown>, userId: string) => {
  const employee = await Employee.findOne({ _id: data.employeeId, companyId }).lean();
  if (!employee) throw new AppError(404, 'NOT_FOUND', 'Employee not found');

  const promotion = await Promotion.create({
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

// ─── EXIT RESIGNATION ────────────────────────────────────────────────────────

const submitResignation = async (companyId: string, employeeId: string, data: Record<string, unknown>) => {
  const existing = await ExitResignation.findOne({ employeeId, companyId, status: 'PENDING' });
  if (existing) throw new AppError(409, 'CONFLICT', 'A pending resignation already exists');

  const resignation = await ExitResignation.create({
    ...data,
    employeeId,
    companyId,
    status: 'PENDING',
  });

  return resignation;
};

// ─── EXIT CHECKLIST ──────────────────────────────────────────────────────────

const getExitChecklist = async (companyId: string, employeeId: string) => {
  let checklist = await ExitChecklist.findOne({ employeeId, companyId }).lean();
  if (!checklist) {
    const departments = await Department.find({ companyId, isActive: true }).lean();
    const tasks = departments.map(d => ({
      task: `${d.name} clearance`,
      assignedTo: d._id,
      isCompleted: false,
      comments: '',
    }));
    const created = await ExitChecklist.create({ employeeId, companyId, tasks, status: 'PENDING' });
    checklist = created.toObject() as ReturnType<typeof created.toObject>;
  }
  return checklist;
};

// ─── EXIT CLEARANCE ──────────────────────────────────────────────────────────

const updateClearance = async (companyId: string, employeeId: string, departmentId: string, data: Record<string, unknown>, userId: string) => {
  let clearance = await ExitClearance.findOne({ employeeId, departmentId, companyId });
  if (!clearance) {
    clearance = await ExitClearance.create({
      employeeId,
      companyId,
      departmentId,
      clearanceBy: userId,
      status: data.status as string,
      comments: (data.comments as string) || '',
      clearedAt: data.status === 'CLEARED' ? new Date() : undefined,
    });
  } else {
    clearance.status = data.status as string;
    clearance.comments = (data.comments as string) || clearance.comments;
    clearance.clearanceBy = userId as any;
    clearance.clearedAt = data.status === 'CLEARED' ? new Date() : undefined;
    await clearance.save();
  }

  // Update checklist task
  await ExitChecklist.updateOne(
    { employeeId, companyId, 'tasks.task': { $regex: 'clearance', $options: 'i' } },
    { $set: { 'tasks.$.isCompleted': data.status === 'CLEARED', 'tasks.$.completedAt': data.status === 'CLEARED' ? new Date() : undefined } }
  );

  return clearance;
};

// ─── EXIT FNF ────────────────────────────────────────────────────────────────

const getFnF = async (companyId: string, employeeId: string) => {
  let settlement = await ExitSettlement.findOne({ employeeId, companyId }).lean();
  if (!settlement) {
    const ss = await SalaryStructure.findOne({ employeeId, companyId }).lean();
    const monthlySalary = ss?.netSalary || 0;

    const oneMonthNotice = Math.round(monthlySalary * 100) / 100;

    const created = await ExitSettlement.create({
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
    settlement = created.toObject() as ReturnType<typeof created.toObject>;
  }
  return settlement;
};

export {
  getDashboard,
  listEmployees,
  createEmployee,
  getEmployeeById,
  updateEmployee,
  removeEmployee,
  hardDeleteEmployee,
  activateEmployee,
  bulkImportEmployees,
  exportEmployees,
  listDepartments,
  createDepartment,
  updateDepartment,
  removeDepartment,
  listDepartmentEmployees,
  listDesignations,
  listAllDesignations,
  getDesignationById,
  createDesignation,
  updateDesignation,
  removeDesignation,
  restoreDesignation,
  bulkDeleteDesignations,
  bulkRestoreDesignations,
  changeDesignationStatus,
  exportDesignationsCSV,
  exportDesignationsExcel,
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
  fullUpdateEmployee,
  getEmployeeProfile,
  updateEmployeeProfile,
  updateEmployeeStatus,
  getEmployeeHistory,
  checkin,
  checkout,
  createRegularization,
  approveRejectRegularization,
  getEmployeePayslips,
  getPayslipByMonthYear,
  getEmployeeTaxDetails,
  getEmployeeDeductions,
  requestLetter,
  listPerformanceGoals,
  createPerformanceGoal,
  updatePerformanceGoal,
  submitAppraisal,
  getAppraisalHistory,
  submitFeedback,
  listTrainingCourses,
  enrollCourse,
  completeCourse,
  getTrainingHistory,
  getTrainingCertifications,
  createTransferRequest,
  approveRejectTransfer,
  createPromotion,
  submitResignation,
  getExitChecklist,
  updateClearance,
  getFnF,
};
