const Joi = require('joi');

const objectId = Joi.string().regex(/^[0-9a-fA-F]{24}$/).message('Invalid ID format');

const createEmployeeSchema = Joi.object({
  firstName: Joi.string().trim().max(100).required(),
  lastName: Joi.string().trim().max(100).allow('', null),
  email: Joi.string().email().max(200).required(),
  personalEmail: Joi.string().email().max(200).allow('', null),
  phone: Joi.string().trim().max(20).allow('', null),
  alternatePhone: Joi.string().trim().max(20).allow('', null),
  employeeCode: Joi.string().trim().max(50).required(),
  dob: Joi.date().iso().allow(null),
  gender: Joi.string().valid('MALE', 'FEMALE', 'OTHER').allow('', null),
  bloodGroup: Joi.string().trim().max(10).allow('', null),
  maritalStatus: Joi.string().trim().max(20).allow('', null),
  avatar: Joi.string().uri().allow('', null),
  employmentType: Joi.string().valid('FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERN').default('FULL_TIME'),
  joiningDate: Joi.date().iso().required(),
  confirmationDate: Joi.date().iso().allow(null),
  departmentId: objectId.required(),
  designationId: objectId.required(),
  branchId: objectId.allow(null),
  reportingManagerId: objectId.allow(null),
  address: Joi.object({
    street: Joi.string().trim().max(500).allow('', null),
    city: Joi.string().trim().max(100).allow('', null),
    state: Joi.string().trim().max(100).allow('', null),
    country: Joi.string().trim().max(100).allow('', null),
    zip: Joi.string().trim().max(20).allow('', null),
  }).allow(null),
  emergencyContact: Joi.object({
    name: Joi.string().trim().max(200).allow('', null),
    relation: Joi.string().trim().max(100).allow('', null),
    phone: Joi.string().trim().max(20).allow('', null),
  }).allow(null),
  bankDetails: Joi.object({
    accountNumber: Joi.string().trim().max(50).allow('', null),
    ifscCode: Joi.string().trim().max(20).allow('', null),
    bankName: Joi.string().trim().max(200).allow('', null),
    accountType: Joi.string().trim().max(50).allow('', null),
  }).allow(null),
  panNumber: Joi.string().trim().max(20).allow('', null),
  aadharNumber: Joi.string().trim().max(20).allow('', null),
});

const updateEmployeeSchema = Joi.object({
  firstName: Joi.string().trim().max(100),
  lastName: Joi.string().trim().max(100).allow('', null),
  email: Joi.string().email().max(200),
  personalEmail: Joi.string().email().max(200).allow('', null),
  phone: Joi.string().trim().max(20).allow('', null),
  alternatePhone: Joi.string().trim().max(20).allow('', null),
  employeeCode: Joi.string().trim().max(50),
  dob: Joi.date().iso().allow(null),
  gender: Joi.string().valid('MALE', 'FEMALE', 'OTHER').allow('', null),
  bloodGroup: Joi.string().trim().max(10).allow('', null),
  maritalStatus: Joi.string().trim().max(20).allow('', null),
  avatar: Joi.string().uri().allow('', null),
  employmentType: Joi.string().valid('FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERN'),
  status: Joi.string().valid('ACTIVE', 'INACTIVE', 'TERMINATED'),
  joiningDate: Joi.date().iso(),
  confirmationDate: Joi.date().iso().allow(null),
  exitDate: Joi.date().iso().allow(null),
  exitReason: Joi.string().trim().max(1000).allow('', null),
  departmentId: objectId,
  designationId: objectId,
  branchId: objectId.allow(null),
  reportingManagerId: objectId.allow(null),
  address: Joi.object({
    street: Joi.string().trim().max(500).allow('', null),
    city: Joi.string().trim().max(100).allow('', null),
    state: Joi.string().trim().max(100).allow('', null),
    country: Joi.string().trim().max(100).allow('', null),
    zip: Joi.string().trim().max(20).allow('', null),
  }).allow(null),
  emergencyContact: Joi.object({
    name: Joi.string().trim().max(200).allow('', null),
    relation: Joi.string().trim().max(100).allow('', null),
    phone: Joi.string().trim().max(20).allow('', null),
  }).allow(null),
  bankDetails: Joi.object({
    accountNumber: Joi.string().trim().max(50).allow('', null),
    ifscCode: Joi.string().trim().max(20).allow('', null),
    bankName: Joi.string().trim().max(200).allow('', null),
    accountType: Joi.string().trim().max(50).allow('', null),
  }).allow(null),
  panNumber: Joi.string().trim().max(20).allow('', null),
  aadharNumber: Joi.string().trim().max(20).allow('', null),
}).min(1);

const createDepartmentSchema = Joi.object({
  name: Joi.string().trim().max(200).required(),
  code: Joi.string().trim().max(50).required(),
  description: Joi.string().trim().max(1000).allow('', null),
  parentId: objectId.allow(null),
  headId: objectId.allow(null),
  branchId: objectId.allow(null),
});

const updateDepartmentSchema = Joi.object({
  name: Joi.string().trim().max(200),
  code: Joi.string().trim().max(50),
  description: Joi.string().trim().max(1000).allow('', null),
  parentId: objectId.allow(null),
  headId: objectId.allow(null),
  branchId: objectId.allow(null),
  isActive: Joi.boolean(),
}).min(1);

const createDesignationSchema = Joi.object({
  name: Joi.string().trim().max(200).required(),
  level: Joi.number().integer().min(0).allow(null),
  description: Joi.string().trim().max(1000).allow('', null),
});

const updateDesignationSchema = Joi.object({
  name: Joi.string().trim().max(200),
  level: Joi.number().integer().min(0).allow(null),
  description: Joi.string().trim().max(1000).allow('', null),
  isActive: Joi.boolean(),
}).min(1);

const createAttendanceSchema = Joi.object({
  employeeId: objectId.required(),
  date: Joi.date().iso().required(),
  checkIn: Joi.date().iso().allow(null),
  checkOut: Joi.date().iso().allow(null),
  status: Joi.string().valid('PRESENT', 'ABSENT', 'LATE', 'HALF_DAY', 'ON_LEAVE').required(),
  source: Joi.string().valid('APP', 'MANUAL', 'BIOMETRIC').default('MANUAL'),
  notes: Joi.string().trim().max(1000).allow('', null),
});

const updateAttendanceSchema = Joi.object({
  checkIn: Joi.date().iso().allow(null),
  checkOut: Joi.date().iso().allow(null),
  status: Joi.string().valid('PRESENT', 'ABSENT', 'LATE', 'HALF_DAY', 'ON_LEAVE'),
  source: Joi.string().valid('APP', 'MANUAL', 'BIOMETRIC'),
  notes: Joi.string().trim().max(1000).allow('', null),
}).min(1);

const bulkAttendanceSchema = Joi.object({
  date: Joi.date().iso().required(),
  entries: Joi.array().items(
    Joi.object({
      employeeId: objectId.required(),
      status: Joi.string().valid('PRESENT', 'ABSENT', 'LATE', 'HALF_DAY', 'ON_LEAVE').required(),
      checkIn: Joi.date().iso().allow(null),
      checkOut: Joi.date().iso().allow(null),
    })
  ).min(1).required(),
});

const createLeaveTypeSchema = Joi.object({
  name: Joi.string().trim().max(200).required(),
  code: Joi.string().trim().max(50).required(),
  annualAllowance: Joi.number().min(0).default(0),
  carryForward: Joi.boolean().default(false),
  maxCarryForward: Joi.number().min(0).allow(null),
  isPaid: Joi.boolean().default(true),
  requiresApproval: Joi.boolean().default(true),
  description: Joi.string().trim().max(1000).allow('', null),
});

const updateLeaveTypeSchema = Joi.object({
  name: Joi.string().trim().max(200),
  code: Joi.string().trim().max(50),
  annualAllowance: Joi.number().min(0),
  carryForward: Joi.boolean(),
  maxCarryForward: Joi.number().min(0).allow(null),
  isPaid: Joi.boolean(),
  requiresApproval: Joi.boolean(),
  description: Joi.string().trim().max(1000).allow('', null),
  isActive: Joi.boolean(),
}).min(1);

const createLeaveRequestSchema = Joi.object({
  leaveTypeId: objectId.required(),
  fromDate: Joi.date().iso().required(),
  toDate: Joi.date().iso().required(),
  reason: Joi.string().trim().max(2000).allow('', null),
  attachments: Joi.array().items(Joi.string().uri()).default([]),
});

const approveRejectLeaveSchema = Joi.object({
  comments: Joi.string().trim().max(2000).allow('', null),
});

const createHolidaySchema = Joi.object({
  name: Joi.string().trim().max(200).required(),
  date: Joi.date().iso().required(),
  type: Joi.string().valid('PUBLIC', 'RESTRICTED', 'OPTIONAL').default('PUBLIC'),
  isOptional: Joi.boolean().default(false),
  branchId: objectId.allow(null),
});

const updateHolidaySchema = Joi.object({
  name: Joi.string().trim().max(200),
  date: Joi.date().iso(),
  type: Joi.string().valid('PUBLIC', 'RESTRICTED', 'OPTIONAL'),
  isOptional: Joi.boolean(),
  branchId: objectId.allow(null),
}).min(1);

const createAssetSchema = Joi.object({
  name: Joi.string().trim().max(200).required(),
  code: Joi.string().trim().max(50).required(),
  category: Joi.string().trim().max(100).allow('', null),
  brand: Joi.string().trim().max(100).allow('', null),
  model: Joi.string().trim().max(100).allow('', null),
  serialNumber: Joi.string().trim().max(100).allow('', null),
  purchaseDate: Joi.date().iso().allow(null),
  purchaseValue: Joi.number().min(0).allow(null),
  location: Joi.string().trim().max(200).allow('', null),
  description: Joi.string().trim().max(1000).allow('', null),
});

const updateAssetSchema = Joi.object({
  name: Joi.string().trim().max(200),
  code: Joi.string().trim().max(50),
  category: Joi.string().trim().max(100).allow('', null),
  brand: Joi.string().trim().max(100).allow('', null),
  model: Joi.string().trim().max(100).allow('', null),
  serialNumber: Joi.string().trim().max(100).allow('', null),
  purchaseDate: Joi.date().iso().allow(null),
  purchaseValue: Joi.number().min(0).allow(null),
  status: Joi.string().valid('AVAILABLE', 'ASSIGNED', 'MAINTENANCE', 'RETIRED'),
  location: Joi.string().trim().max(200).allow('', null),
  description: Joi.string().trim().max(1000).allow('', null),
}).min(1);

const assignAssetSchema = Joi.object({
  employeeId: objectId.required(),
  condition: Joi.string().trim().max(500).allow('', null),
  notes: Joi.string().trim().max(1000).allow('', null),
});

const returnAssetSchema = Joi.object({
  condition: Joi.string().trim().max(500).allow('', null),
  notes: Joi.string().trim().max(1000).allow('', null),
});

const runPayrollSchema = Joi.object({
  month: Joi.number().integer().min(1).max(12).required(),
  year: Joi.number().integer().min(1900).max(2100).required(),
});

const createSalaryStructureSchema = Joi.object({
  employeeId: objectId.required(),
  effectiveFrom: Joi.date().iso().required(),
  basicSalary: Joi.number().min(0).required(),
  hra: Joi.number().min(0).default(0),
  ta: Joi.number().min(0).default(0),
  da: Joi.number().min(0).default(0),
  pf: Joi.number().min(0).default(0),
  esi: Joi.number().min(0).default(0),
  otherAllowances: Joi.array().items(
    Joi.object({
      name: Joi.string().trim().required(),
      amount: Joi.number().min(0).required(),
    })
  ).default([]),
  deductions: Joi.array().items(
    Joi.object({
      name: Joi.string().trim().required(),
      amount: Joi.number().min(0).required(),
    })
  ).default([]),
});

const updateSalaryStructureSchema = Joi.object({
  effectiveFrom: Joi.date().iso(),
  basicSalary: Joi.number().min(0),
  hra: Joi.number().min(0),
  ta: Joi.number().min(0),
  da: Joi.number().min(0),
  pf: Joi.number().min(0),
  esi: Joi.number().min(0),
  otherAllowances: Joi.array().items(
    Joi.object({
      name: Joi.string().trim().required(),
      amount: Joi.number().min(0).required(),
    })
  ),
  deductions: Joi.array().items(
    Joi.object({
      name: Joi.string().trim().required(),
      amount: Joi.number().min(0).required(),
    })
  ),
}).min(1);

module.exports = {
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
};
