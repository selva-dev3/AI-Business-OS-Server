import Joi from 'joi';

const objectId = Joi.string().regex(/^[0-9a-fA-F]{24}$/).message('Invalid ID format');

export const createEmployeeSchema: Joi.ObjectSchema = Joi.object({
  firstName: Joi.string().trim().max(100).required(),
  lastName: Joi.string().trim().max(100).allow('', null),
  email: Joi.string().email().max(200).required(),
  personalEmail: Joi.string().email().max(200).allow('', null),
  phone: Joi.string().trim().max(20).allow('', null),
  alternatePhone: Joi.string().trim().max(20).allow('', null),
  employeeCode: Joi.string().trim().max(50).allow('', null).optional(),
  dob: Joi.date().iso().allow(null, ''),
  gender: Joi.string().valid('MALE', 'FEMALE', 'OTHER', 'male', 'female', 'other').allow('', null),
  bloodGroup: Joi.string().trim().max(10).allow('', null),
  maritalStatus: Joi.string().trim().max(20).allow('', null),
  avatar: Joi.string().uri().allow('', null),
  employmentType: Joi.string().valid('FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERN', 'full_time', 'part_time', 'contract', 'intern').default('FULL_TIME'),
  joiningDate: Joi.date().iso().allow(null, '').optional(),
  dateOfJoining: Joi.date().iso().allow(null, '').optional(),
  confirmationDate: Joi.date().iso().allow(null, ''),
  departmentId: Joi.alternatives().try(objectId, Joi.string().allow('', null)).optional(),
  designationId: Joi.alternatives().try(objectId, Joi.string().allow('', null)).optional(),
  branchId: Joi.alternatives().try(objectId, Joi.string().allow('', null)).optional(),
  reportingManagerId: Joi.alternatives().try(objectId, Joi.string().allow('', null)).optional(),
  address: Joi.alternatives().try(
    Joi.object({
      street: Joi.string().trim().max(500).allow('', null),
      city: Joi.string().trim().max(100).allow('', null),
      state: Joi.string().trim().max(100).allow('', null),
      country: Joi.string().trim().max(100).allow('', null),
      zip: Joi.string().trim().max(20).allow('', null),
    }),
    Joi.string().trim().max(500).allow('', null)
  ).allow(null),
  city: Joi.string().trim().max(100).allow('', null),
  state: Joi.string().trim().max(100).allow('', null),
  country: Joi.string().trim().max(100).allow('', null),
  zipCode: Joi.string().trim().max(20).allow('', null),
  zip: Joi.string().trim().max(20).allow('', null),
  designation: Joi.string().trim().max(200).allow('', null),
  managerId: Joi.alternatives().try(objectId, Joi.string().allow('', null)).optional(),
  status: Joi.string().valid('ACTIVE', 'INACTIVE', 'TERMINATED', 'active', 'inactive', 'terminated', 'on_leave').allow('', null),
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

export const updateEmployeeSchema: Joi.ObjectSchema = Joi.object({
  firstName: Joi.string().trim().max(100),
  lastName: Joi.string().trim().max(100).allow('', null),
  email: Joi.string().email().max(200),
  personalEmail: Joi.string().email().max(200).allow('', null),
  phone: Joi.string().trim().max(20).allow('', null),
  alternatePhone: Joi.string().trim().max(20).allow('', null),
  employeeCode: Joi.string().trim().max(50).allow('', null),
  dob: Joi.date().iso().allow(null, ''),
  gender: Joi.string().valid('MALE', 'FEMALE', 'OTHER', 'male', 'female', 'other').allow('', null),
  bloodGroup: Joi.string().trim().max(10).allow('', null),
  maritalStatus: Joi.string().trim().max(20).allow('', null),
  avatar: Joi.string().uri().allow('', null),
  employmentType: Joi.string().valid('FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERN', 'full_time', 'part_time', 'contract', 'intern'),
  status: Joi.string().valid('ACTIVE', 'INACTIVE', 'TERMINATED', 'active', 'inactive', 'terminated', 'on_leave'),
  joiningDate: Joi.date().iso().allow(null, '').optional(),
  dateOfJoining: Joi.date().iso().allow(null, '').optional(),
  confirmationDate: Joi.date().iso().allow(null, ''),
  exitDate: Joi.date().iso().allow(null, ''),
  exitReason: Joi.string().trim().max(1000).allow('', null),
  departmentId: Joi.alternatives().try(objectId, Joi.string().allow('', null)).optional(),
  designationId: Joi.alternatives().try(objectId, Joi.string().allow('', null)).optional(),
  branchId: Joi.alternatives().try(objectId, Joi.string().allow('', null)).optional(),
  reportingManagerId: Joi.alternatives().try(objectId, Joi.string().allow('', null)).optional(),
  address: Joi.alternatives().try(
    Joi.object({
      street: Joi.string().trim().max(500).allow('', null),
      city: Joi.string().trim().max(100).allow('', null),
      state: Joi.string().trim().max(100).allow('', null),
      country: Joi.string().trim().max(100).allow('', null),
      zip: Joi.string().trim().max(20).allow('', null),
    }),
    Joi.string().trim().max(500).allow('', null)
  ).allow(null),
  city: Joi.string().trim().max(100).allow('', null),
  state: Joi.string().trim().max(100).allow('', null),
  country: Joi.string().trim().max(100).allow('', null),
  zipCode: Joi.string().trim().max(20).allow('', null),
  zip: Joi.string().trim().max(20).allow('', null),
  designation: Joi.string().trim().max(200).allow('', null),
  managerId: Joi.alternatives().try(objectId, Joi.string().allow('', null)).optional(),
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

export const createDepartmentSchema: Joi.ObjectSchema = Joi.object({
  name: Joi.string().trim().max(200).required(),
  code: Joi.string().trim().max(50).required(),
  description: Joi.string().trim().max(1000).allow('', null),
  parentId: objectId.allow(null),
  headId: objectId.allow(null),
  branchId: objectId.allow(null),
});

export const updateDepartmentSchema: Joi.ObjectSchema = Joi.object({
  name: Joi.string().trim().max(200),
  code: Joi.string().trim().max(50),
  description: Joi.string().trim().max(1000).allow('', null),
  parentId: objectId.allow(null),
  headId: objectId.allow(null),
  branchId: objectId.allow(null),
  isActive: Joi.boolean(),
}).min(1);

export const createDesignationSchema: Joi.ObjectSchema = Joi.object({
  name: Joi.string().trim().max(200).required(),
  level: Joi.number().integer().min(0).allow(null),
  description: Joi.string().trim().max(1000).allow('', null),
});

export const updateDesignationSchema: Joi.ObjectSchema = Joi.object({
  name: Joi.string().trim().max(200),
  level: Joi.number().integer().min(0).allow(null),
  description: Joi.string().trim().max(1000).allow('', null),
  isActive: Joi.boolean(),
}).min(1);

export const createAttendanceSchema: Joi.ObjectSchema = Joi.object({
  employeeId: objectId.required(),
  date: Joi.date().iso().required(),
  checkIn: Joi.date().iso().allow(null),
  checkOut: Joi.date().iso().allow(null),
  status: Joi.string().valid('PRESENT', 'ABSENT', 'LATE', 'HALF_DAY', 'ON_LEAVE').required(),
  source: Joi.string().valid('APP', 'MANUAL', 'BIOMETRIC').default('MANUAL'),
  notes: Joi.string().trim().max(1000).allow('', null),
});

export const updateAttendanceSchema: Joi.ObjectSchema = Joi.object({
  checkIn: Joi.date().iso().allow(null),
  checkOut: Joi.date().iso().allow(null),
  status: Joi.string().valid('PRESENT', 'ABSENT', 'LATE', 'HALF_DAY', 'ON_LEAVE'),
  source: Joi.string().valid('APP', 'MANUAL', 'BIOMETRIC'),
  notes: Joi.string().trim().max(1000).allow('', null),
}).min(1);

export const bulkAttendanceSchema: Joi.ObjectSchema = Joi.object({
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

export const createLeaveTypeSchema: Joi.ObjectSchema = Joi.object({
  name: Joi.string().trim().max(200).required(),
  code: Joi.string().trim().max(50).required(),
  annualAllowance: Joi.number().min(0).default(0),
  carryForward: Joi.boolean().default(false),
  maxCarryForward: Joi.number().min(0).allow(null),
  isPaid: Joi.boolean().default(true),
  requiresApproval: Joi.boolean().default(true),
  description: Joi.string().trim().max(1000).allow('', null),
});

export const updateLeaveTypeSchema: Joi.ObjectSchema = Joi.object({
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

export const createLeaveRequestSchema: Joi.ObjectSchema = Joi.object({
  leaveTypeId: objectId.required(),
  fromDate: Joi.date().iso().required(),
  toDate: Joi.date().iso().required(),
  reason: Joi.string().trim().max(2000).allow('', null),
  attachments: Joi.array().items(Joi.string().uri()).default([]),
});

export const approveRejectLeaveSchema: Joi.ObjectSchema = Joi.object({
  comments: Joi.string().trim().max(2000).allow('', null),
});

export const createHolidaySchema: Joi.ObjectSchema = Joi.object({
  name: Joi.string().trim().max(200).required(),
  date: Joi.date().iso().required(),
  type: Joi.string().valid('PUBLIC', 'RESTRICTED', 'OPTIONAL').default('PUBLIC'),
  isOptional: Joi.boolean().default(false),
  branchId: objectId.allow(null),
});

export const updateHolidaySchema: Joi.ObjectSchema = Joi.object({
  name: Joi.string().trim().max(200),
  date: Joi.date().iso(),
  type: Joi.string().valid('PUBLIC', 'RESTRICTED', 'OPTIONAL'),
  isOptional: Joi.boolean(),
  branchId: objectId.allow(null),
}).min(1);

export const createAssetSchema: Joi.ObjectSchema = Joi.object({
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

export const updateAssetSchema: Joi.ObjectSchema = Joi.object({
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

export const assignAssetSchema: Joi.ObjectSchema = Joi.object({
  employeeId: objectId.required(),
  condition: Joi.string().trim().max(500).allow('', null),
  notes: Joi.string().trim().max(1000).allow('', null),
});

export const returnAssetSchema: Joi.ObjectSchema = Joi.object({
  condition: Joi.string().trim().max(500).allow('', null),
  notes: Joi.string().trim().max(1000).allow('', null),
});

export const runPayrollSchema: Joi.ObjectSchema = Joi.object({
  month: Joi.number().integer().min(1).max(12).required(),
  year: Joi.number().integer().min(1900).max(2100).required(),
});

export const createSalaryStructureSchema: Joi.ObjectSchema = Joi.object({
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

export const updateSalaryStructureSchema: Joi.ObjectSchema = Joi.object({
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
