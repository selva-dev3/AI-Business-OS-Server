import mongoose from 'mongoose';
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
    department?: {
        id: string;
        name: string;
    };
    manager?: {
        id: string;
        firstName: string;
        lastName: string;
    };
    managerId?: string;
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
    [key: string]: unknown;
}
declare const getDashboard: (companyId: string, from: string | undefined, to: string | undefined) => Promise<{
    totalEmployees: number;
    presentToday: number;
    onLeaveToday: number;
    newHiresThisMonth: number;
    attritionRate: number;
    pendingLeaveRequests: number;
    headcountTrend: {
        month: string;
        count: number;
    }[];
    departmentWise: any[];
    weeklyAttendance: Record<string, Record<string, number>>;
}>;
declare const listEmployees: (companyId: string, query: QueryParams) => Promise<{
    employees: (TransformResult | null)[];
    meta: import("../types").BuildMetaResult;
}>;
declare const createEmployee: (companyId: string, rawData: Record<string, unknown>) => Promise<TransformResult | null>;
declare const getEmployeeById: (companyId: string, id: string) => Promise<TransformResult | null>;
declare const updateEmployee: (companyId: string, id: string, rawData: Record<string, unknown>) => Promise<TransformResult | null>;
declare const removeEmployee: (companyId: string, id: string) => Promise<TransformResult | null>;
declare const activateEmployee: (companyId: string, id: string) => Promise<TransformResult | null>;
declare const bulkImportEmployees: (companyId: string, employeesData: Record<string, unknown>[]) => Promise<{
    created: number;
    errors: {
        row: number;
        message: string;
    }[];
}>;
declare const exportEmployees: (companyId: string, query: QueryParams) => Promise<(mongoose.FlattenMaps<import("../models/Employee").IEmployee> & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
})[]>;
declare const listDepartments: (companyId: string) => Promise<Record<string, unknown>[]>;
declare const createDepartment: (companyId: string, data: Record<string, unknown>) => Promise<mongoose.Document<unknown, {}, import("../models/Department").IDepartment, {}, {}> & import("../models/Department").IDepartment & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}>;
declare const updateDepartment: (companyId: string, id: string, data: Record<string, unknown>) => Promise<mongoose.Document<unknown, {}, import("../models/Department").IDepartment, {}, {}> & import("../models/Department").IDepartment & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}>;
declare const removeDepartment: (companyId: string, id: string) => Promise<mongoose.Document<unknown, {}, import("../models/Department").IDepartment, {}, {}> & import("../models/Department").IDepartment & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}>;
declare const listDepartmentEmployees: (companyId: string, id: string, query: QueryParams) => Promise<{
    employees: (mongoose.FlattenMaps<import("../models/Employee").IEmployee> & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    })[];
    meta: import("../types").BuildMetaResult;
}>;
declare const listDesignations: (companyId: string) => Promise<(mongoose.FlattenMaps<import("../models/Designation").IDesignation> & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
})[]>;
declare const createDesignation: (companyId: string, data: Record<string, unknown>) => Promise<mongoose.Document<unknown, {}, import("../models/Designation").IDesignation, {}, {}> & import("../models/Designation").IDesignation & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}>;
declare const updateDesignation: (companyId: string, id: string, data: Record<string, unknown>) => Promise<mongoose.Document<unknown, {}, import("../models/Designation").IDesignation, {}, {}> & import("../models/Designation").IDesignation & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}>;
declare const removeDesignation: (companyId: string, id: string) => Promise<mongoose.Document<unknown, {}, import("../models/Designation").IDesignation, {}, {}> & import("../models/Designation").IDesignation & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}>;
declare const listAttendance: (companyId: string, query: QueryParams) => Promise<{
    records: (mongoose.FlattenMaps<import("../models/Attendance").IAttendance> & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    })[];
    meta: import("../types").BuildMetaResult;
}>;
declare const createAttendance: (companyId: string, data: Record<string, unknown>) => Promise<mongoose.Document<unknown, {}, import("../models/Attendance").IAttendance, {}, {}> & import("../models/Attendance").IAttendance & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}>;
declare const updateAttendance: (companyId: string, id: string, data: Record<string, unknown>) => Promise<mongoose.Document<unknown, {}, import("../models/Attendance").IAttendance, {}, {}> & import("../models/Attendance").IAttendance & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}>;
declare const getAttendanceSummary: (companyId: string, query: QueryParams) => Promise<Record<string, unknown>>;
declare const bulkCreateAttendance: (companyId: string, data: {
    date: string;
    entries: Record<string, unknown>[];
}) => Promise<{
    created: number;
    skipped: number;
    errors: {
        employeeId: unknown;
        message: string;
    }[];
}>;
declare const exportAttendance: (companyId: string, query: QueryParams) => Promise<(mongoose.FlattenMaps<import("../models/Attendance").IAttendance> & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
})[]>;
declare const listLeaveTypes: (companyId: string) => Promise<(mongoose.FlattenMaps<import("../models/LeaveType").ILeaveType> & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
})[]>;
declare const createLeaveType: (companyId: string, data: Record<string, unknown>) => Promise<mongoose.Document<unknown, {}, import("../models/LeaveType").ILeaveType, {}, {}> & import("../models/LeaveType").ILeaveType & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}>;
declare const updateLeaveType: (companyId: string, id: string, data: Record<string, unknown>) => Promise<mongoose.Document<unknown, {}, import("../models/LeaveType").ILeaveType, {}, {}> & import("../models/LeaveType").ILeaveType & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}>;
declare const removeLeaveType: (companyId: string, id: string) => Promise<mongoose.Document<unknown, {}, import("../models/LeaveType").ILeaveType, {}, {}> & import("../models/LeaveType").ILeaveType & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}>;
declare const listLeaveRequests: (companyId: string, query: QueryParams) => Promise<{
    requests: (mongoose.FlattenMaps<import("../models/LeaveRequest").ILeaveRequest> & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    })[];
    meta: import("../types").BuildMetaResult;
}>;
declare const createLeaveRequest: (companyId: string, data: Record<string, unknown>, userId: string) => Promise<mongoose.Document<unknown, {}, import("../models/LeaveRequest").ILeaveRequest, {}, {}> & import("../models/LeaveRequest").ILeaveRequest & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}>;
declare const getLeaveRequestById: (companyId: string, id: string) => Promise<mongoose.Document<unknown, {}, import("../models/LeaveRequest").ILeaveRequest, {}, {}> & import("../models/LeaveRequest").ILeaveRequest & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}>;
declare const approveLeaveRequest: (companyId: string, id: string, userId: string, data: Record<string, unknown>) => Promise<mongoose.Document<unknown, {}, import("../models/LeaveRequest").ILeaveRequest, {}, {}> & import("../models/LeaveRequest").ILeaveRequest & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}>;
declare const rejectLeaveRequest: (companyId: string, id: string, userId: string, data: Record<string, unknown>) => Promise<mongoose.Document<unknown, {}, import("../models/LeaveRequest").ILeaveRequest, {}, {}> & import("../models/LeaveRequest").ILeaveRequest & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}>;
declare const removeLeaveRequest: (companyId: string, id: string) => Promise<mongoose.Document<unknown, {}, import("../models/LeaveRequest").ILeaveRequest, {}, {}> & import("../models/LeaveRequest").ILeaveRequest & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}>;
declare const getLeaveBalance: (companyId: string, query: QueryParams) => Promise<(mongoose.FlattenMaps<import("../models/LeaveBalance").ILeaveBalance> & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
})[]>;
declare const getLeaveCalendar: (companyId: string, query: QueryParams) => Promise<(mongoose.FlattenMaps<import("../models/LeaveRequest").ILeaveRequest> & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
})[]>;
declare const listHolidays: (companyId: string, query: QueryParams) => Promise<(mongoose.FlattenMaps<import("../models/Holiday").IHoliday> & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
})[]>;
declare const createHoliday: (companyId: string, data: Record<string, unknown>) => Promise<mongoose.Document<unknown, {}, import("../models/Holiday").IHoliday, {}, {}> & import("../models/Holiday").IHoliday & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}>;
declare const updateHoliday: (companyId: string, id: string, data: Record<string, unknown>) => Promise<mongoose.Document<unknown, {}, import("../models/Holiday").IHoliday, {}, {}> & import("../models/Holiday").IHoliday & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}>;
declare const removeHoliday: (companyId: string, id: string) => Promise<mongoose.Document<unknown, {}, import("../models/Holiday").IHoliday, {}, {}> & import("../models/Holiday").IHoliday & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}>;
declare const listPayroll: (companyId: string, query: QueryParams) => Promise<{
    payrolls: (mongoose.FlattenMaps<import("../models/Payroll").IPayroll> & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    })[];
    meta: import("../types").BuildMetaResult;
}>;
declare const runPayroll: (companyId: string, data: Record<string, unknown>, userId: string) => Promise<mongoose.Document<unknown, {}, import("../models/Payroll").IPayroll, {}, {}> & import("../models/Payroll").IPayroll & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}>;
declare const getPayrollById: (companyId: string, id: string) => Promise<any>;
declare const getPayslip: (companyId: string, id: string) => Promise<mongoose.FlattenMaps<import("../models/Payslip").IPayslip> & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}>;
declare const exportPayslips: (companyId: string, query: QueryParams & {
    payrollId?: string;
}) => Promise<(mongoose.FlattenMaps<import("../models/Payslip").IPayslip> & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
})[]>;
declare const getSalaryStructure: (companyId: string, employeeId: string) => Promise<mongoose.FlattenMaps<import("../models/SalaryStructure").ISalaryStructure> & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}>;
declare const createSalaryStructure: (companyId: string, data: Record<string, unknown>) => Promise<mongoose.Document<unknown, {}, import("../models/SalaryStructure").ISalaryStructure, {}, {}> & import("../models/SalaryStructure").ISalaryStructure & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}>;
declare const updateSalaryStructure: (companyId: string, employeeId: string, data: Record<string, unknown>) => Promise<(mongoose.Document<unknown, {}, import("../models/SalaryStructure").ISalaryStructure, {}, {}> & import("../models/SalaryStructure").ISalaryStructure & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}) | null>;
declare const listAssets: (companyId: string, query: QueryParams) => Promise<any>;
declare const createAsset: (companyId: string, data: Record<string, unknown>) => Promise<mongoose.Document<unknown, {}, import("../models/Asset").IAsset, {}, {}> & import("../models/Asset").IAsset & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}>;
declare const updateAsset: (companyId: string, id: string, data: Record<string, unknown>) => Promise<mongoose.Document<unknown, {}, import("../models/Asset").IAsset, {}, {}> & import("../models/Asset").IAsset & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}>;
declare const removeAsset: (companyId: string, id: string) => Promise<mongoose.Document<unknown, {}, import("../models/Asset").IAsset, {}, {}> & import("../models/Asset").IAsset & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}>;
declare const assignAsset: (companyId: string, id: string, data: Record<string, unknown>) => Promise<{
    assignment: mongoose.Document<unknown, {}, import("../models/AssetAssignment").IAssetAssignment, {}, {}> & import("../models/AssetAssignment").IAssetAssignment & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    };
    asset: mongoose.Document<unknown, {}, import("../models/Asset").IAsset, {}, {}> & import("../models/Asset").IAsset & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    };
}>;
declare const returnAsset: (companyId: string, id: string, data: Record<string, unknown>) => Promise<mongoose.Document<unknown, {}, import("../models/Asset").IAsset, {}, {}> & import("../models/Asset").IAsset & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}>;
declare const getAttendanceReport: (companyId: string, query: QueryParams) => Promise<any[]>;
declare const getLeaveReport: (companyId: string, query: QueryParams) => Promise<any[]>;
declare const getPayrollReport: (companyId: string, query: QueryParams) => Promise<any[]>;
declare const getHeadcountReport: (companyId: string, query: QueryParams) => Promise<any[]>;
declare const getAttritionReport: (companyId: string, query: QueryParams) => Promise<{
    period: {
        from: Date;
        to: Date;
    };
    headcountAtStart: number;
    terminations: number;
    newHires: number;
    attritionRate: number;
}>;
export { getDashboard, listEmployees, createEmployee, getEmployeeById, updateEmployee, removeEmployee, activateEmployee, bulkImportEmployees, exportEmployees, listDepartments, createDepartment, updateDepartment, removeDepartment, listDepartmentEmployees, listDesignations, createDesignation, updateDesignation, removeDesignation, listAttendance, createAttendance, updateAttendance, getAttendanceSummary, bulkCreateAttendance, exportAttendance, listLeaveTypes, createLeaveType, updateLeaveType, removeLeaveType, listLeaveRequests, createLeaveRequest, getLeaveRequestById, approveLeaveRequest, rejectLeaveRequest, removeLeaveRequest, getLeaveBalance, getLeaveCalendar, listHolidays, createHoliday, updateHoliday, removeHoliday, listPayroll, runPayroll, getPayrollById, getPayslip, exportPayslips, getSalaryStructure, createSalaryStructure, updateSalaryStructure, listAssets, createAsset, updateAsset, removeAsset, assignAsset, returnAsset, getAttendanceReport, getLeaveReport, getPayrollReport, getHeadcountReport, getAttritionReport, };
//# sourceMappingURL=hrms.service.d.ts.map