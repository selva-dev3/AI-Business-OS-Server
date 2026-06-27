"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSalaryStructureSchema = exports.createSalaryStructureSchema = exports.runPayrollSchema = exports.returnAssetSchema = exports.assignAssetSchema = exports.updateAssetSchema = exports.createAssetSchema = exports.updateHolidaySchema = exports.createHolidaySchema = exports.approveRejectLeaveSchema = exports.createLeaveRequestSchema = exports.updateLeaveTypeSchema = exports.createLeaveTypeSchema = exports.bulkAttendanceSchema = exports.updateAttendanceSchema = exports.createAttendanceSchema = exports.updateDesignationSchema = exports.createDesignationSchema = exports.updateDepartmentSchema = exports.createDepartmentSchema = exports.updateEmployeeSchema = exports.createEmployeeSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const objectId = joi_1.default.string().regex(/^[0-9a-fA-F]{24}$/).message('Invalid ID format');
exports.createEmployeeSchema = joi_1.default.object({
    firstName: joi_1.default.string().trim().max(100).required(),
    lastName: joi_1.default.string().trim().max(100).allow('', null),
    email: joi_1.default.string().email().max(200).required(),
    personalEmail: joi_1.default.string().email().max(200).allow('', null),
    phone: joi_1.default.string().trim().max(20).allow('', null),
    alternatePhone: joi_1.default.string().trim().max(20).allow('', null),
    employeeCode: joi_1.default.string().trim().max(50).allow('', null).optional(),
    dob: joi_1.default.date().iso().allow(null, ''),
    gender: joi_1.default.string().valid('MALE', 'FEMALE', 'OTHER', 'male', 'female', 'other').allow('', null),
    bloodGroup: joi_1.default.string().trim().max(10).allow('', null),
    maritalStatus: joi_1.default.string().trim().max(20).allow('', null),
    avatar: joi_1.default.string().uri().allow('', null),
    employmentType: joi_1.default.string().valid('FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERN', 'full_time', 'part_time', 'contract', 'intern').default('FULL_TIME'),
    joiningDate: joi_1.default.date().iso().allow(null, '').optional(),
    dateOfJoining: joi_1.default.date().iso().allow(null, '').optional(),
    confirmationDate: joi_1.default.date().iso().allow(null, ''),
    departmentId: joi_1.default.alternatives().try(objectId, joi_1.default.string().allow('', null)).optional(),
    designationId: joi_1.default.alternatives().try(objectId, joi_1.default.string().allow('', null)).optional(),
    branchId: joi_1.default.alternatives().try(objectId, joi_1.default.string().allow('', null)).optional(),
    reportingManagerId: joi_1.default.alternatives().try(objectId, joi_1.default.string().allow('', null)).optional(),
    address: joi_1.default.alternatives().try(joi_1.default.object({
        street: joi_1.default.string().trim().max(500).allow('', null),
        city: joi_1.default.string().trim().max(100).allow('', null),
        state: joi_1.default.string().trim().max(100).allow('', null),
        country: joi_1.default.string().trim().max(100).allow('', null),
        zip: joi_1.default.string().trim().max(20).allow('', null),
    }), joi_1.default.string().trim().max(500).allow('', null)).allow(null),
    city: joi_1.default.string().trim().max(100).allow('', null),
    state: joi_1.default.string().trim().max(100).allow('', null),
    country: joi_1.default.string().trim().max(100).allow('', null),
    zipCode: joi_1.default.string().trim().max(20).allow('', null),
    zip: joi_1.default.string().trim().max(20).allow('', null),
    designation: joi_1.default.string().trim().max(200).allow('', null),
    managerId: joi_1.default.alternatives().try(objectId, joi_1.default.string().allow('', null)).optional(),
    status: joi_1.default.string().valid('ACTIVE', 'INACTIVE', 'TERMINATED', 'active', 'inactive', 'terminated', 'on_leave').allow('', null),
    emergencyContact: joi_1.default.object({
        name: joi_1.default.string().trim().max(200).allow('', null),
        relation: joi_1.default.string().trim().max(100).allow('', null),
        phone: joi_1.default.string().trim().max(20).allow('', null),
    }).allow(null),
    bankDetails: joi_1.default.object({
        accountNumber: joi_1.default.string().trim().max(50).allow('', null),
        ifscCode: joi_1.default.string().trim().max(20).allow('', null),
        bankName: joi_1.default.string().trim().max(200).allow('', null),
        accountType: joi_1.default.string().trim().max(50).allow('', null),
    }).allow(null),
    panNumber: joi_1.default.string().trim().max(20).allow('', null),
    aadharNumber: joi_1.default.string().trim().max(20).allow('', null),
});
exports.updateEmployeeSchema = joi_1.default.object({
    firstName: joi_1.default.string().trim().max(100),
    lastName: joi_1.default.string().trim().max(100).allow('', null),
    email: joi_1.default.string().email().max(200),
    personalEmail: joi_1.default.string().email().max(200).allow('', null),
    phone: joi_1.default.string().trim().max(20).allow('', null),
    alternatePhone: joi_1.default.string().trim().max(20).allow('', null),
    employeeCode: joi_1.default.string().trim().max(50).allow('', null),
    dob: joi_1.default.date().iso().allow(null, ''),
    gender: joi_1.default.string().valid('MALE', 'FEMALE', 'OTHER', 'male', 'female', 'other').allow('', null),
    bloodGroup: joi_1.default.string().trim().max(10).allow('', null),
    maritalStatus: joi_1.default.string().trim().max(20).allow('', null),
    avatar: joi_1.default.string().uri().allow('', null),
    employmentType: joi_1.default.string().valid('FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERN', 'full_time', 'part_time', 'contract', 'intern'),
    status: joi_1.default.string().valid('ACTIVE', 'INACTIVE', 'TERMINATED', 'active', 'inactive', 'terminated', 'on_leave'),
    joiningDate: joi_1.default.date().iso().allow(null, '').optional(),
    dateOfJoining: joi_1.default.date().iso().allow(null, '').optional(),
    confirmationDate: joi_1.default.date().iso().allow(null, ''),
    exitDate: joi_1.default.date().iso().allow(null, ''),
    exitReason: joi_1.default.string().trim().max(1000).allow('', null),
    departmentId: joi_1.default.alternatives().try(objectId, joi_1.default.string().allow('', null)).optional(),
    designationId: joi_1.default.alternatives().try(objectId, joi_1.default.string().allow('', null)).optional(),
    branchId: joi_1.default.alternatives().try(objectId, joi_1.default.string().allow('', null)).optional(),
    reportingManagerId: joi_1.default.alternatives().try(objectId, joi_1.default.string().allow('', null)).optional(),
    address: joi_1.default.alternatives().try(joi_1.default.object({
        street: joi_1.default.string().trim().max(500).allow('', null),
        city: joi_1.default.string().trim().max(100).allow('', null),
        state: joi_1.default.string().trim().max(100).allow('', null),
        country: joi_1.default.string().trim().max(100).allow('', null),
        zip: joi_1.default.string().trim().max(20).allow('', null),
    }), joi_1.default.string().trim().max(500).allow('', null)).allow(null),
    city: joi_1.default.string().trim().max(100).allow('', null),
    state: joi_1.default.string().trim().max(100).allow('', null),
    country: joi_1.default.string().trim().max(100).allow('', null),
    zipCode: joi_1.default.string().trim().max(20).allow('', null),
    zip: joi_1.default.string().trim().max(20).allow('', null),
    designation: joi_1.default.string().trim().max(200).allow('', null),
    managerId: joi_1.default.alternatives().try(objectId, joi_1.default.string().allow('', null)).optional(),
    emergencyContact: joi_1.default.object({
        name: joi_1.default.string().trim().max(200).allow('', null),
        relation: joi_1.default.string().trim().max(100).allow('', null),
        phone: joi_1.default.string().trim().max(20).allow('', null),
    }).allow(null),
    bankDetails: joi_1.default.object({
        accountNumber: joi_1.default.string().trim().max(50).allow('', null),
        ifscCode: joi_1.default.string().trim().max(20).allow('', null),
        bankName: joi_1.default.string().trim().max(200).allow('', null),
        accountType: joi_1.default.string().trim().max(50).allow('', null),
    }).allow(null),
    panNumber: joi_1.default.string().trim().max(20).allow('', null),
    aadharNumber: joi_1.default.string().trim().max(20).allow('', null),
}).min(1);
exports.createDepartmentSchema = joi_1.default.object({
    name: joi_1.default.string().trim().max(200).required(),
    code: joi_1.default.string().trim().max(50).required(),
    description: joi_1.default.string().trim().max(1000).allow('', null),
    parentId: objectId.allow(null),
    headId: objectId.allow(null),
    branchId: objectId.allow(null),
});
exports.updateDepartmentSchema = joi_1.default.object({
    name: joi_1.default.string().trim().max(200),
    code: joi_1.default.string().trim().max(50),
    description: joi_1.default.string().trim().max(1000).allow('', null),
    parentId: objectId.allow(null),
    headId: objectId.allow(null),
    branchId: objectId.allow(null),
    isActive: joi_1.default.boolean(),
}).min(1);
exports.createDesignationSchema = joi_1.default.object({
    name: joi_1.default.string().trim().max(200).required(),
    level: joi_1.default.number().integer().min(0).allow(null),
    description: joi_1.default.string().trim().max(1000).allow('', null),
});
exports.updateDesignationSchema = joi_1.default.object({
    name: joi_1.default.string().trim().max(200),
    level: joi_1.default.number().integer().min(0).allow(null),
    description: joi_1.default.string().trim().max(1000).allow('', null),
    isActive: joi_1.default.boolean(),
}).min(1);
exports.createAttendanceSchema = joi_1.default.object({
    employeeId: objectId.required(),
    date: joi_1.default.date().iso().required(),
    checkIn: joi_1.default.date().iso().allow(null),
    checkOut: joi_1.default.date().iso().allow(null),
    status: joi_1.default.string().valid('PRESENT', 'ABSENT', 'LATE', 'HALF_DAY', 'ON_LEAVE').required(),
    source: joi_1.default.string().valid('APP', 'MANUAL', 'BIOMETRIC').default('MANUAL'),
    notes: joi_1.default.string().trim().max(1000).allow('', null),
});
exports.updateAttendanceSchema = joi_1.default.object({
    checkIn: joi_1.default.date().iso().allow(null),
    checkOut: joi_1.default.date().iso().allow(null),
    status: joi_1.default.string().valid('PRESENT', 'ABSENT', 'LATE', 'HALF_DAY', 'ON_LEAVE'),
    source: joi_1.default.string().valid('APP', 'MANUAL', 'BIOMETRIC'),
    notes: joi_1.default.string().trim().max(1000).allow('', null),
}).min(1);
exports.bulkAttendanceSchema = joi_1.default.object({
    date: joi_1.default.date().iso().required(),
    entries: joi_1.default.array().items(joi_1.default.object({
        employeeId: objectId.required(),
        status: joi_1.default.string().valid('PRESENT', 'ABSENT', 'LATE', 'HALF_DAY', 'ON_LEAVE').required(),
        checkIn: joi_1.default.date().iso().allow(null),
        checkOut: joi_1.default.date().iso().allow(null),
    })).min(1).required(),
});
exports.createLeaveTypeSchema = joi_1.default.object({
    name: joi_1.default.string().trim().max(200).required(),
    code: joi_1.default.string().trim().max(50).required(),
    annualAllowance: joi_1.default.number().min(0).default(0),
    carryForward: joi_1.default.boolean().default(false),
    maxCarryForward: joi_1.default.number().min(0).allow(null),
    isPaid: joi_1.default.boolean().default(true),
    requiresApproval: joi_1.default.boolean().default(true),
    description: joi_1.default.string().trim().max(1000).allow('', null),
});
exports.updateLeaveTypeSchema = joi_1.default.object({
    name: joi_1.default.string().trim().max(200),
    code: joi_1.default.string().trim().max(50),
    annualAllowance: joi_1.default.number().min(0),
    carryForward: joi_1.default.boolean(),
    maxCarryForward: joi_1.default.number().min(0).allow(null),
    isPaid: joi_1.default.boolean(),
    requiresApproval: joi_1.default.boolean(),
    description: joi_1.default.string().trim().max(1000).allow('', null),
    isActive: joi_1.default.boolean(),
}).min(1);
exports.createLeaveRequestSchema = joi_1.default.object({
    leaveTypeId: objectId.required(),
    fromDate: joi_1.default.date().iso().required(),
    toDate: joi_1.default.date().iso().required(),
    reason: joi_1.default.string().trim().max(2000).allow('', null),
    attachments: joi_1.default.array().items(joi_1.default.string().uri()).default([]),
});
exports.approveRejectLeaveSchema = joi_1.default.object({
    comments: joi_1.default.string().trim().max(2000).allow('', null),
});
exports.createHolidaySchema = joi_1.default.object({
    name: joi_1.default.string().trim().max(200).required(),
    date: joi_1.default.date().iso().required(),
    type: joi_1.default.string().valid('PUBLIC', 'RESTRICTED', 'OPTIONAL').default('PUBLIC'),
    isOptional: joi_1.default.boolean().default(false),
    branchId: objectId.allow(null),
});
exports.updateHolidaySchema = joi_1.default.object({
    name: joi_1.default.string().trim().max(200),
    date: joi_1.default.date().iso(),
    type: joi_1.default.string().valid('PUBLIC', 'RESTRICTED', 'OPTIONAL'),
    isOptional: joi_1.default.boolean(),
    branchId: objectId.allow(null),
}).min(1);
exports.createAssetSchema = joi_1.default.object({
    name: joi_1.default.string().trim().max(200).required(),
    code: joi_1.default.string().trim().max(50).required(),
    category: joi_1.default.string().trim().max(100).allow('', null),
    brand: joi_1.default.string().trim().max(100).allow('', null),
    model: joi_1.default.string().trim().max(100).allow('', null),
    serialNumber: joi_1.default.string().trim().max(100).allow('', null),
    purchaseDate: joi_1.default.date().iso().allow(null),
    purchaseValue: joi_1.default.number().min(0).allow(null),
    location: joi_1.default.string().trim().max(200).allow('', null),
    description: joi_1.default.string().trim().max(1000).allow('', null),
});
exports.updateAssetSchema = joi_1.default.object({
    name: joi_1.default.string().trim().max(200),
    code: joi_1.default.string().trim().max(50),
    category: joi_1.default.string().trim().max(100).allow('', null),
    brand: joi_1.default.string().trim().max(100).allow('', null),
    model: joi_1.default.string().trim().max(100).allow('', null),
    serialNumber: joi_1.default.string().trim().max(100).allow('', null),
    purchaseDate: joi_1.default.date().iso().allow(null),
    purchaseValue: joi_1.default.number().min(0).allow(null),
    status: joi_1.default.string().valid('AVAILABLE', 'ASSIGNED', 'MAINTENANCE', 'RETIRED'),
    location: joi_1.default.string().trim().max(200).allow('', null),
    description: joi_1.default.string().trim().max(1000).allow('', null),
}).min(1);
exports.assignAssetSchema = joi_1.default.object({
    employeeId: objectId.required(),
    condition: joi_1.default.string().trim().max(500).allow('', null),
    notes: joi_1.default.string().trim().max(1000).allow('', null),
});
exports.returnAssetSchema = joi_1.default.object({
    condition: joi_1.default.string().trim().max(500).allow('', null),
    notes: joi_1.default.string().trim().max(1000).allow('', null),
});
exports.runPayrollSchema = joi_1.default.object({
    month: joi_1.default.number().integer().min(1).max(12).required(),
    year: joi_1.default.number().integer().min(1900).max(2100).required(),
});
exports.createSalaryStructureSchema = joi_1.default.object({
    employeeId: objectId.required(),
    effectiveFrom: joi_1.default.date().iso().required(),
    basicSalary: joi_1.default.number().min(0).required(),
    hra: joi_1.default.number().min(0).default(0),
    ta: joi_1.default.number().min(0).default(0),
    da: joi_1.default.number().min(0).default(0),
    pf: joi_1.default.number().min(0).default(0),
    esi: joi_1.default.number().min(0).default(0),
    otherAllowances: joi_1.default.array().items(joi_1.default.object({
        name: joi_1.default.string().trim().required(),
        amount: joi_1.default.number().min(0).required(),
    })).default([]),
    deductions: joi_1.default.array().items(joi_1.default.object({
        name: joi_1.default.string().trim().required(),
        amount: joi_1.default.number().min(0).required(),
    })).default([]),
});
exports.updateSalaryStructureSchema = joi_1.default.object({
    effectiveFrom: joi_1.default.date().iso(),
    basicSalary: joi_1.default.number().min(0),
    hra: joi_1.default.number().min(0),
    ta: joi_1.default.number().min(0),
    da: joi_1.default.number().min(0),
    pf: joi_1.default.number().min(0),
    esi: joi_1.default.number().min(0),
    otherAllowances: joi_1.default.array().items(joi_1.default.object({
        name: joi_1.default.string().trim().required(),
        amount: joi_1.default.number().min(0).required(),
    })),
    deductions: joi_1.default.array().items(joi_1.default.object({
        name: joi_1.default.string().trim().required(),
        amount: joi_1.default.number().min(0).required(),
    })),
}).min(1);
//# sourceMappingURL=hrms.validator.js.map