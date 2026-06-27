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
declare const hardDeleteEmployee: (companyId: string, id: string) => Promise<{
    message: string;
    employeeId: string;
}>;
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
export { getDashboard, listEmployees, createEmployee, getEmployeeById, updateEmployee, removeEmployee, hardDeleteEmployee, activateEmployee, bulkImportEmployees, exportEmployees, listDepartments, createDepartment, updateDepartment, removeDepartment, listDepartmentEmployees, listDesignations, createDesignation, updateDesignation, removeDesignation, listAttendance, createAttendance, updateAttendance, getAttendanceSummary, bulkCreateAttendance, exportAttendance, listLeaveTypes, createLeaveType, updateLeaveType, removeLeaveType, listLeaveRequests, createLeaveRequest, getLeaveRequestById, approveLeaveRequest, rejectLeaveRequest, removeLeaveRequest, getLeaveBalance, getLeaveCalendar, listHolidays, createHoliday, updateHoliday, removeHoliday, listPayroll, runPayroll, getPayrollById, getPayslip, exportPayslips, getSalaryStructure, createSalaryStructure, updateSalaryStructure, listAssets, createAsset, updateAsset, removeAsset, assignAsset, returnAsset, getAttendanceReport, getLeaveReport, getPayrollReport, getHeadcountReport, getAttritionReport, fullUpdateEmployee, getEmployeeProfile, updateEmployeeProfile, updateEmployeeStatus, getEmployeeHistory, checkin, checkout, createRegularization, approveRejectRegularization, getEmployeePayslips, getPayslipByMonthYear, getEmployeeTaxDetails, getEmployeeDeductions, requestLetter, listPerformanceGoals, createPerformanceGoal, updatePerformanceGoal, submitAppraisal, getAppraisalHistory, submitFeedback, listTrainingCourses, enrollCourse, completeCourse, getTrainingHistory, getTrainingCertifications, createTransferRequest, approveRejectTransfer, createPromotion, submitResignation, getExitChecklist, updateClearance, getFnF, };
//# sourceMappingURL=hrms.service.d.ts.map