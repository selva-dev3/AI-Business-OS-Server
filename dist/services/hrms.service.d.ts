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
    summary: {
        totalHeadcount: number;
        activeStaff: number;
        onLeave: number;
        inactive: number;
        suspended: number;
    };
}>;
declare const createEmployee: (companyId: string, rawData: Record<string, unknown>) => Promise<TransformResult | null>;
declare const getEmployeeById: (companyId: string, id: string) => Promise<TransformResult | null>;
declare const updateEmployee: (companyId: string, id: string, rawData: Record<string, unknown>) => Promise<TransformResult | null>;
declare const removeEmployee: (companyId: string, id: string) => Promise<TransformResult | null>;
declare const hardDeleteEmployee: (companyId: string, id: string) => Promise<{
    message: string;
    employeeId: string;
}>;
declare const activateEmployee: (companyId: string, id: string) => Promise<TransformResult | null>;
declare const suspendEmployee: (companyId: string, id: string, userId: string, data: Record<string, unknown>) => Promise<TransformResult | null>;
declare const reinstateEmployee: (companyId: string, id: string, userId: string, data: Record<string, unknown>) => Promise<TransformResult | null>;
declare const bulkImportEmployees: (companyId: string, employeesData: Record<string, unknown>[]) => Promise<{
    inserted: number;
    failed: number;
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
declare const listDesignations: (companyId: string, query: Record<string, unknown>) => Promise<{
    data: (mongoose.FlattenMaps<import("../models/Designation").IDesignation> & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    })[];
    meta: import("../types").BuildMetaResult;
}>;
declare const listAllDesignations: (companyId: string) => Promise<(mongoose.FlattenMaps<import("../models/Designation").IDesignation> & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
})[]>;
declare const getDesignationById: (companyId: string, id: string) => Promise<mongoose.FlattenMaps<import("../models/Designation").IDesignation> & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}>;
declare const createDesignation: (companyId: string, data: Record<string, unknown>, userId?: string) => Promise<mongoose.Document<unknown, {}, import("../models/Designation").IDesignation, {}, {}> & import("../models/Designation").IDesignation & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}>;
declare const updateDesignation: (companyId: string, id: string, data: Record<string, unknown>, userId?: string) => Promise<mongoose.Document<unknown, {}, import("../models/Designation").IDesignation, {}, {}> & import("../models/Designation").IDesignation & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}>;
declare const removeDesignation: (companyId: string, id: string, force?: boolean) => Promise<mongoose.Document<unknown, {}, import("../models/Designation").IDesignation, {}, {}> & import("../models/Designation").IDesignation & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}>;
declare const restoreDesignation: (companyId: string, id: string) => Promise<mongoose.Document<unknown, {}, import("../models/Designation").IDesignation, {}, {}> & import("../models/Designation").IDesignation & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}>;
declare const bulkDeleteDesignations: (companyId: string, ids: string[], force?: boolean) => Promise<{
    modifiedCount: number;
}>;
declare const bulkRestoreDesignations: (companyId: string, ids: string[]) => Promise<{
    modifiedCount: number;
}>;
declare const changeDesignationStatus: (companyId: string, id: string, status: string, userId?: string) => Promise<mongoose.Document<unknown, {}, import("../models/Designation").IDesignation, {}, {}> & import("../models/Designation").IDesignation & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}>;
declare const exportDesignationsCSV: (companyId: string, filter: Record<string, unknown>) => Promise<string>;
declare const exportDesignationsExcel: (companyId: string, filter: Record<string, unknown>) => Promise<{
    Name: {};
    Code: {};
    Department: {};
    Level: {};
    Status: {};
    'Hierarchy Order': {};
    'Employment Types': string;
}[]>;
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
declare const getAttendanceById: (companyId: string, id: string) => Promise<mongoose.FlattenMaps<import("../models/Attendance").IAttendance> & Required<{
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
declare const fullUpdateEmployee: (companyId: string, id: string, rawData: Record<string, unknown>) => Promise<TransformResult | null>;
declare const getEmployeeProfile: (companyId: string, id: string) => Promise<mongoose.FlattenMaps<import("../models/Employee").IEmployee> & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}>;
declare const updateEmployeeProfile: (companyId: string, id: string, data: Record<string, unknown>) => Promise<mongoose.Document<unknown, {}, import("../models/Employee").IEmployee, {}, {}> & import("../models/Employee").IEmployee & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}>;
declare const updateEmployeeStatus: (companyId: string, id: string, data: Record<string, unknown>) => Promise<mongoose.Document<unknown, {}, import("../models/Employee").IEmployee, {}, {}> & import("../models/Employee").IEmployee & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}>;
declare const getEmployeeHistory: (companyId: string, id: string) => Promise<(mongoose.FlattenMaps<import("../models/EmployeeHistory").IEmployeeHistory> & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
})[]>;
declare const checkin: (companyId: string, data: Record<string, unknown>) => Promise<mongoose.Document<unknown, {}, import("../models/Attendance").IAttendance, {}, {}> & import("../models/Attendance").IAttendance & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}>;
declare const checkout: (companyId: string, data: Record<string, unknown>) => Promise<mongoose.Document<unknown, {}, import("../models/Attendance").IAttendance, {}, {}> & import("../models/Attendance").IAttendance & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}>;
declare const createRegularization: (companyId: string, data: Record<string, unknown>) => Promise<mongoose.Document<unknown, {}, import("../models/RegularizationRequest").IRegularizationRequest, {}, {}> & import("../models/RegularizationRequest").IRegularizationRequest & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}>;
declare const approveRejectRegularization: (companyId: string, id: string, data: Record<string, unknown>) => Promise<mongoose.Document<unknown, {}, import("../models/RegularizationRequest").IRegularizationRequest, {}, {}> & import("../models/RegularizationRequest").IRegularizationRequest & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}>;
declare const listRegularizations: (companyId: string, query: QueryParams) => Promise<{
    records: (mongoose.FlattenMaps<import("../models/RegularizationRequest").IRegularizationRequest> & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    })[];
    meta: import("../types").BuildMetaResult;
}>;
declare const getEmployeePayslips: (companyId: string, employeeId: string) => Promise<(mongoose.FlattenMaps<import("../models/Payslip").IPayslip> & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
})[]>;
declare const getPayslipByMonthYear: (companyId: string, month: string, year: string) => Promise<{
    payroll: mongoose.Document<unknown, {}, import("../models/Payroll").IPayroll, {}, {}> & import("../models/Payroll").IPayroll & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    };
    payslips: (mongoose.FlattenMaps<import("../models/Payslip").IPayslip> & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    })[];
}>;
declare const getEmployeeTaxDetails: (companyId: string, employeeId: string) => Promise<{
    employeeId: string;
    panNumber: string | undefined;
    monthlyGross: number;
    monthlyNet: number;
    annualGross: number;
    annualNet: number;
    ytdGross: number;
    ytdDeductions: number;
    ytdNet: number;
    pfPerMonth: number;
    esiPerMonth: number;
}>;
declare const getEmployeeDeductions: (companyId: string, employeeId: string) => Promise<{
    pf: {
        perMonth: number;
        annual: number;
    };
    esi: {
        perMonth: number;
        annual: number;
    };
    tds: {
        perMonth: number;
        annual: number;
    };
    customDeductions: {
        name: string;
        perMonth: number;
        annual: number;
    }[];
    recentPayslips: {
        period: Date;
        grossSalary: number | undefined;
        pf: number | undefined;
        esi: number | undefined;
        tds: number | undefined;
        deductions: mongoose.FlattenMaps<unknown>[] | undefined;
        netSalary: number | undefined;
    }[];
}>;
declare const requestLetter: (companyId: string, employeeId: string, data: Record<string, unknown>) => Promise<{
    employeeId: string;
    type: string;
    content: string;
    notes: unknown;
    generatedAt: string;
    message: string;
}>;
declare const listPerformanceGoals: (companyId: string, employeeId: string, query: QueryParams) => Promise<{
    goals: (mongoose.FlattenMaps<import("../models/PerformanceGoal").IPerformanceGoal> & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    })[];
    meta: import("../types").BuildMetaResult;
}>;
declare const createPerformanceGoal: (companyId: string, data: Record<string, unknown>, userId: string) => Promise<mongoose.Document<unknown, {}, import("../models/PerformanceGoal").IPerformanceGoal, {}, {}> & import("../models/PerformanceGoal").IPerformanceGoal & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}>;
declare const updatePerformanceGoal: (companyId: string, id: string, data: Record<string, unknown>) => Promise<mongoose.Document<unknown, {}, import("../models/PerformanceGoal").IPerformanceGoal, {}, {}> & import("../models/PerformanceGoal").IPerformanceGoal & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}>;
declare const submitAppraisal: (companyId: string, data: Record<string, unknown>, userId: string) => Promise<mongoose.Document<unknown, {}, import("../models/PerformanceAppraisal").IPerformanceAppraisal, {}, {}> & import("../models/PerformanceAppraisal").IPerformanceAppraisal & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}>;
declare const getAppraisalHistory: (companyId: string, employeeId: string) => Promise<(mongoose.FlattenMaps<import("../models/PerformanceAppraisal").IPerformanceAppraisal> & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
})[]>;
declare const submitFeedback: (companyId: string, data: Record<string, unknown>, userId: string) => Promise<mongoose.Document<unknown, {}, import("../models/PerformanceFeedback").IPerformanceFeedback, {}, {}> & import("../models/PerformanceFeedback").IPerformanceFeedback & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}>;
declare const listTrainingCourses: (companyId: string, query: QueryParams) => Promise<{
    courses: (mongoose.FlattenMaps<import("../models/TrainingCourse").ITrainingCourse> & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    })[];
    meta: import("../types").BuildMetaResult;
}>;
declare const enrollCourse: (companyId: string, data: Record<string, unknown>) => Promise<mongoose.Document<unknown, {}, import("../models/TrainingEnrollment").ITrainingEnrollment, {}, {}> & import("../models/TrainingEnrollment").ITrainingEnrollment & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}>;
declare const completeCourse: (companyId: string, enrollmentId: string, data: Record<string, unknown>) => Promise<mongoose.Document<unknown, {}, import("../models/TrainingEnrollment").ITrainingEnrollment, {}, {}> & import("../models/TrainingEnrollment").ITrainingEnrollment & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}>;
declare const getTrainingHistory: (companyId: string, employeeId: string) => Promise<(mongoose.FlattenMaps<import("../models/TrainingEnrollment").ITrainingEnrollment> & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
})[]>;
declare const getTrainingCertifications: (companyId: string, employeeId: string) => Promise<(mongoose.FlattenMaps<import("../models/TrainingCertification").ITrainingCertification> & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
})[]>;
declare const createTransferRequest: (companyId: string, data: Record<string, unknown>, userId: string) => Promise<mongoose.Document<unknown, {}, import("../models/TransferRequest").ITransferRequest, {}, {}> & import("../models/TransferRequest").ITransferRequest & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}>;
declare const approveRejectTransfer: (companyId: string, id: string, data: Record<string, unknown>, userId: string) => Promise<mongoose.Document<unknown, {}, import("../models/TransferRequest").ITransferRequest, {}, {}> & import("../models/TransferRequest").ITransferRequest & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}>;
declare const createPromotion: (companyId: string, data: Record<string, unknown>, userId: string) => Promise<mongoose.Document<unknown, {}, import("../models/Promotion").IPromotion, {}, {}> & import("../models/Promotion").IPromotion & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}>;
declare const getEmployeeAttendance: (companyId: string, employeeId: string, query: QueryParams) => Promise<{
    records: (mongoose.FlattenMaps<import("../models/Attendance").IAttendance> & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    })[];
    summary: Record<string, unknown>;
    meta: import("../types").BuildMetaResult;
}>;
declare const getEmployeeLeaves: (companyId: string, employeeId: string, query: QueryParams) => Promise<{
    requests: (mongoose.FlattenMaps<import("../models/LeaveRequest").ILeaveRequest> & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    })[];
    leaveBalance: Record<string, {
        total: number;
        used: number;
        remaining: number;
    }>;
    meta: import("../types").BuildMetaResult;
}>;
declare const getEmployeePayroll: (companyId: string, employeeId: string, query: QueryParams) => Promise<{
    records: (mongoose.FlattenMaps<import("../models/Payslip").IPayslip> & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    })[];
    meta: import("../types").BuildMetaResult;
}>;
declare const initiateLeaveOnBehalf: (companyId: string, employeeId: string, userId: string, data: Record<string, unknown>) => Promise<{
    employee: TransformResult | null;
    leaveRequest: mongoose.Document<unknown, {}, import("../models/LeaveRequest").ILeaveRequest, {}, {}> & import("../models/LeaveRequest").ILeaveRequest & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    };
}>;
declare const terminateEmployee: (companyId: string, employeeId: string, userId: string, data: Record<string, unknown>) => Promise<TransformResult | null>;
declare const assignEmployeeRole: (companyId: string, employeeId: string, userId: string, data: Record<string, unknown>) => Promise<TransformResult | null>;
declare const resetEmployeePassword: (companyId: string, employeeId: string, _userId: string, data: Record<string, unknown>) => Promise<{
    message: string;
    sentTo: any;
    expiresAt: Date;
} | {
    message: string;
    sentTo: any;
    expiresAt?: undefined;
}>;
declare const createEmployeeDocument: (companyId: string, employeeId: string, userId: string, data: Record<string, unknown>) => Promise<mongoose.Document<unknown, {}, import("../models/EmployeeDocument").IEmployeeDocument, {}, {}> & import("../models/EmployeeDocument").IEmployeeDocument & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}>;
declare const listEmployeeDocuments: (companyId: string, employeeId: string, query: QueryParams) => Promise<{
    records: (mongoose.FlattenMaps<import("../models/EmployeeDocument").IEmployeeDocument> & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    })[];
    meta: import("../types").BuildMetaResult;
}>;
declare const getEmployeeDocument: (companyId: string, employeeId: string, documentId: string) => Promise<mongoose.Document<unknown, {}, import("../models/EmployeeDocument").IEmployeeDocument, {}, {}> & import("../models/EmployeeDocument").IEmployeeDocument & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}>;
declare const createEmployeeNote: (companyId: string, employeeId: string, userId: string, data: Record<string, unknown>) => Promise<mongoose.Document<unknown, {}, import("../models/EmployeeNote").IEmployeeNote, {}, {}> & import("../models/EmployeeNote").IEmployeeNote & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}>;
declare const listEmployeeNotes: (companyId: string, employeeId: string, query: QueryParams) => Promise<{
    records: (mongoose.FlattenMaps<import("../models/EmployeeNote").IEmployeeNote> & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    })[];
    meta: import("../types").BuildMetaResult;
}>;
declare const updateEmployeeNote: (companyId: string, _employeeId: string, noteId: string, userId: string, data: Record<string, unknown>) => Promise<mongoose.Document<unknown, {}, import("../models/EmployeeNote").IEmployeeNote, {}, {}> & import("../models/EmployeeNote").IEmployeeNote & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}>;
declare const deleteEmployeeNote: (companyId: string, _employeeId: string, noteId: string, userId: string) => Promise<{
    message: string;
    noteId: string;
}>;
declare const submitResignation: (companyId: string, employeeId: string, data: Record<string, unknown>) => Promise<mongoose.Document<unknown, {}, import("../models/ExitResignation").IExitResignation, {}, {}> & import("../models/ExitResignation").IExitResignation & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}>;
declare const getExitChecklist: (companyId: string, employeeId: string) => Promise<(mongoose.FlattenMaps<import("../models/ExitChecklist").IExitChecklist> & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}) | null>;
declare const updateClearance: (companyId: string, employeeId: string, departmentId: string, data: Record<string, unknown>, userId: string) => Promise<mongoose.Document<unknown, {}, import("../models/ExitClearance").IExitClearance, {}, {}> & import("../models/ExitClearance").IExitClearance & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}>;
declare const getFnF: (companyId: string, employeeId: string) => Promise<(mongoose.FlattenMaps<import("../models/ExitSettlement").IExitSettlement> & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}) | null>;
export { getDashboard, listEmployees, createEmployee, getEmployeeById, updateEmployee, removeEmployee, hardDeleteEmployee, activateEmployee, suspendEmployee, reinstateEmployee, bulkImportEmployees, exportEmployees, listDepartments, createDepartment, updateDepartment, removeDepartment, listDepartmentEmployees, listDesignations, listAllDesignations, getDesignationById, createDesignation, updateDesignation, removeDesignation, restoreDesignation, bulkDeleteDesignations, bulkRestoreDesignations, changeDesignationStatus, exportDesignationsCSV, exportDesignationsExcel, listAttendance, createAttendance, updateAttendance, getAttendanceById, getAttendanceSummary, bulkCreateAttendance, exportAttendance, listLeaveTypes, createLeaveType, updateLeaveType, removeLeaveType, listLeaveRequests, createLeaveRequest, getLeaveRequestById, approveLeaveRequest, rejectLeaveRequest, removeLeaveRequest, getLeaveBalance, getLeaveCalendar, listHolidays, createHoliday, updateHoliday, removeHoliday, listPayroll, runPayroll, getPayrollById, getPayslip, exportPayslips, getSalaryStructure, createSalaryStructure, updateSalaryStructure, listAssets, createAsset, updateAsset, removeAsset, assignAsset, returnAsset, getAttendanceReport, getLeaveReport, getPayrollReport, getHeadcountReport, getAttritionReport, fullUpdateEmployee, getEmployeeProfile, updateEmployeeProfile, updateEmployeeStatus, getEmployeeHistory, checkin, checkout, createRegularization, approveRejectRegularization, listRegularizations, getEmployeePayslips, getPayslipByMonthYear, getEmployeeTaxDetails, getEmployeeDeductions, requestLetter, listPerformanceGoals, createPerformanceGoal, updatePerformanceGoal, submitAppraisal, getAppraisalHistory, submitFeedback, listTrainingCourses, enrollCourse, completeCourse, getTrainingHistory, getTrainingCertifications, createTransferRequest, approveRejectTransfer, createPromotion, submitResignation, getExitChecklist, updateClearance, getFnF, getEmployeeAttendance, getEmployeeLeaves, getEmployeePayroll, initiateLeaveOnBehalf, terminateEmployee, assignEmployeeRole, resetEmployeePassword, createEmployeeDocument, listEmployeeDocuments, getEmployeeDocument, createEmployeeNote, listEmployeeNotes, updateEmployeeNote, deleteEmployeeNote, };
//# sourceMappingURL=hrms.service.d.ts.map