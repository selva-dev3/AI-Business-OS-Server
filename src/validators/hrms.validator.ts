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
  designationCode: Joi.string().trim().max(50).allow('', null),
  description: Joi.string().trim().max(1000).allow('', null),
  level: Joi.number().integer().min(0).allow(null),
  hierarchyOrder: Joi.number().integer().min(0).allow(null),
  employmentTypes: Joi.array().items(Joi.string().valid('FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERN', 'FREELANCE')).allow(null),
  color: Joi.string().trim().max(7).regex(/^#[0-9a-fA-F]{6}$/).allow('', null).message('Color must be a valid hex code'),
  isDefault: Joi.boolean().default(false),
  departmentId: objectId.allow(null),
  status: Joi.string().valid('ACTIVE', 'INACTIVE').default('ACTIVE'),
});

export const updateDesignationSchema: Joi.ObjectSchema = Joi.object({
  name: Joi.string().trim().max(200),
  designationCode: Joi.string().trim().max(50).allow('', null),
  description: Joi.string().trim().max(1000).allow('', null),
  level: Joi.number().integer().min(0).allow(null),
  hierarchyOrder: Joi.number().integer().min(0).allow(null),
  employmentTypes: Joi.array().items(Joi.string().valid('FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERN', 'FREELANCE')).allow(null),
  color: Joi.string().trim().max(7).regex(/^#[0-9a-fA-F]{6}$/).allow('', null).message('Color must be a valid hex code'),
  isDefault: Joi.boolean(),
  departmentId: objectId.allow(null),
  status: Joi.string().valid('ACTIVE', 'INACTIVE'),
  isActive: Joi.boolean(),
}).min(1);

export const bulkDesignationsSchema: Joi.ObjectSchema = Joi.object({
  ids: Joi.array().items(objectId.required()).min(1).required(),
});

export const changeDesignationStatusSchema: Joi.ObjectSchema = Joi.object({
  status: Joi.string().valid('ACTIVE', 'INACTIVE').required(),
});

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
  employeeId: objectId.optional(),
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

// ─── EMPLOYEE PROFILE ────────────────────────────────────────────────────────

export const updateProfileSchema: Joi.ObjectSchema = Joi.object({
  personalEmail: Joi.string().email().max(200).allow('', null),
  phone: Joi.string().trim().max(20).allow('', null),
  alternatePhone: Joi.string().trim().max(20).allow('', null),
  dob: Joi.date().iso().allow(null, ''),
  gender: Joi.string().valid('MALE', 'FEMALE', 'OTHER', 'male', 'female', 'other').allow('', null),
  bloodGroup: Joi.string().trim().max(10).allow('', null),
  maritalStatus: Joi.string().trim().max(20).allow('', null),
  avatar: Joi.string().uri().allow('', null),
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

export const updateEmployeeStatusSchema: Joi.ObjectSchema = Joi.object({
  status: Joi.string().valid('ACTIVE', 'INACTIVE', 'TERMINATED', 'active', 'inactive', 'terminated').required(),
  exitDate: Joi.date().iso().allow(null, ''),
  exitReason: Joi.string().trim().max(1000).allow('', null),
});

export const suspendEmployeeSchema: Joi.ObjectSchema = Joi.object({
  reason: Joi.string().trim().min(10).max(2000).required(),
  expectedReinstatement: Joi.date().iso().allow(null),
  notes: Joi.string().trim().max(2000).allow('', null),
});

export const reinstateEmployeeSchema: Joi.ObjectSchema = Joi.object({
  notes: Joi.string().trim().max(2000).allow('', null),
});

// ─── ATTENDANCE CHECKIN / CHECKOUT / REGULARIZE ─────────────────────────────

export const checkinSchema: Joi.ObjectSchema = Joi.object({
  employeeId: objectId.required(),
  date: Joi.date().iso().optional(),
  checkIn: Joi.date().iso().optional(),
  source: Joi.string().valid('APP', 'MANUAL', 'BIOMETRIC').default('APP'),
  notes: Joi.string().trim().max(1000).allow('', null),
});

export const checkoutSchema: Joi.ObjectSchema = Joi.object({
  employeeId: objectId.required(),
  date: Joi.date().iso().optional(),
  checkOut: Joi.date().iso().optional(),
  notes: Joi.string().trim().max(1000).allow('', null),
});

export const regularizeAttendanceSchema: Joi.ObjectSchema = Joi.object({
  employeeId: objectId.required(),
  date: Joi.date().iso().required(),
  checkIn: Joi.date().iso().allow(null),
  checkOut: Joi.date().iso().allow(null),
  reason: Joi.string().trim().max(1000).required(),
});

export const approveRejectRegularizationSchema: Joi.ObjectSchema = Joi.object({
  status: Joi.string().valid('APPROVED', 'REJECTED').required(),
  comments: Joi.string().trim().max(1000).allow('', null),
});

// ─── PERFORMANCE ────────────────────────────────────────────────────────────

export const createPerformanceGoalSchema: Joi.ObjectSchema = Joi.object({
  employeeId: objectId.required(),
  title: Joi.string().trim().max(200).required(),
  description: Joi.string().trim().max(2000).allow('', null),
  category: Joi.string().trim().max(100).allow('', null),
  startDate: Joi.date().iso().allow(null),
  endDate: Joi.date().iso().allow(null),
  targetValue: Joi.number().allow(null),
  measurementUnit: Joi.string().trim().max(50).allow('', null),
  weightage: Joi.number().min(0).max(100).allow(null),
  status: Joi.string().valid('NOT_STARTED', 'IN_PROGRESS', 'ACHIEVED', 'NOT_ACHIEVED').allow(null),
  notes: Joi.string().trim().max(2000).allow('', null),
});

export const updatePerformanceGoalSchema: Joi.ObjectSchema = Joi.object({
  title: Joi.string().trim().max(200),
  description: Joi.string().trim().max(2000).allow('', null),
  category: Joi.string().trim().max(100).allow('', null),
  startDate: Joi.date().iso().allow(null),
  endDate: Joi.date().iso().allow(null),
  targetValue: Joi.number().allow(null),
  currentValue: Joi.number().min(0).allow(null),
  measurementUnit: Joi.string().trim().max(50).allow('', null),
  weightage: Joi.number().min(0).max(100).allow(null),
  status: Joi.string().valid('NOT_STARTED', 'IN_PROGRESS', 'ACHIEVED', 'NOT_ACHIEVED'),
  notes: Joi.string().trim().max(2000).allow('', null),
}).min(1);

export const submitAppraisalSchema: Joi.ObjectSchema = Joi.object({
  employeeId: objectId.required(),
  reviewPeriod: Joi.string().trim().max(100).required(),
  startDate: Joi.date().iso().allow(null),
  endDate: Joi.date().iso().allow(null),
  rating: Joi.number().min(1).max(5).allow(null),
  strengths: Joi.string().trim().max(2000).allow('', null),
  areasOfImprovement: Joi.string().trim().max(2000).allow('', null),
  overallComments: Joi.string().trim().max(3000).allow('', null),
  goals: Joi.array().items(
    Joi.object({
      goalId: objectId.required(),
      rating: Joi.number().min(1).max(5).allow(null),
      comments: Joi.string().trim().max(1000).allow('', null),
    })
  ).allow(null),
});

export const submitFeedbackSchema: Joi.ObjectSchema = Joi.object({
  employeeId: objectId.required(),
  rating: Joi.number().min(1).max(5).required(),
  comments: Joi.string().trim().max(2000).required(),
  category: Joi.string().valid('PEER', 'MANAGER', 'SUBORDINATE', 'SELF').default('PEER'),
  isAnonymous: Joi.boolean().default(false),
});

// ─── TRAINING ───────────────────────────────────────────────────────────────

export const createTrainingCourseSchema: Joi.ObjectSchema = Joi.object({
  title: Joi.string().trim().max(200).required(),
  description: Joi.string().trim().max(2000).allow('', null),
  provider: Joi.string().trim().max(200).allow('', null),
  duration: Joi.string().trim().max(100).allow('', null),
  mode: Joi.string().valid('ONLINE', 'OFFLINE', 'HYBRID').default('ONLINE'),
  category: Joi.string().trim().max(100).allow('', null),
  skills: Joi.array().items(Joi.string().trim()).allow(null),
  isMandatory: Joi.boolean().default(false),
  maxParticipants: Joi.number().integer().min(1).allow(null),
  startDate: Joi.date().iso().allow(null),
  endDate: Joi.date().iso().allow(null),
});

export const enrollCourseSchema: Joi.ObjectSchema = Joi.object({
  courseId: objectId.required(),
  employeeId: objectId.required(),
});

export const completeCourseSchema: Joi.ObjectSchema = Joi.object({
  score: Joi.number().min(0).allow(null),
  feedback: Joi.string().trim().max(2000).allow('', null),
});

// ─── TRANSFER & PROMOTION ───────────────────────────────────────────────────

export const createTransferSchema: Joi.ObjectSchema = Joi.object({
  employeeId: objectId.required(),
  toDepartmentId: objectId.allow(null),
  toDesignationId: objectId.allow(null),
  toBranchId: objectId.allow(null),
  reason: Joi.string().trim().max(2000).required(),
  effectiveDate: Joi.date().iso().allow(null),
});

export const approveRejectTransferSchema: Joi.ObjectSchema = Joi.object({
  status: Joi.string().valid('APPROVED', 'REJECTED').required(),
  comments: Joi.string().trim().max(2000).allow('', null),
});

export const createPromotionSchema: Joi.ObjectSchema = Joi.object({
  employeeId: objectId.required(),
  toDesignationId: objectId.required(),
  toDepartmentId: objectId.allow(null),
  toSalary: Joi.number().min(0).allow(null),
  effectiveDate: Joi.date().iso().required(),
  reason: Joi.string().trim().max(2000).allow('', null),
});

// ─── EXIT / OFFBOARDING ─────────────────────────────────────────────────────

export const resignSchema: Joi.ObjectSchema = Joi.object({
  resignationDate: Joi.date().iso().required(),
  lastWorkingDay: Joi.date().iso().required(),
  reason: Joi.string().trim().max(2000).required(),
  remarks: Joi.string().trim().max(2000).allow('', null),
  employeeId: objectId.allow(null).optional(),
});

export const updateClearanceSchema: Joi.ObjectSchema = Joi.object({
  status: Joi.string().valid('CLEARED', 'NOT_CLEARED').required(),
  comments: Joi.string().trim().max(1000).allow('', null),
});

// ─── DOCUMENTS ──────────────────────────────────────────────────────────────

export const requestLetterSchema: Joi.ObjectSchema = Joi.object({
  type: Joi.string().valid('EXPERIENCE', 'SALARY', 'OFFER', 'RELIEVING', 'OTHER').required(),
  content: Joi.string().trim().max(5000).allow('', null),
  notes: Joi.string().trim().max(1000).allow('', null),
  employeeId: objectId.allow(null).optional(),
});

// ─── EMPLOYEE ATTENDANCE ─────────────────────────────────────────────────────

export const getEmployeeAttendanceSchema: Joi.ObjectSchema = Joi.object({
  month: Joi.number().integer().min(1).max(12),
  year: Joi.number().integer().min(1900).max(2100),
  status: Joi.string().valid('PRESENT', 'ABSENT', 'LATE', 'HALF_DAY', 'ON_LEAVE', 'present', 'absent', 'late', 'half_day', 'on_leave'),
  page: Joi.number().integer().min(1),
  limit: Joi.number().integer().min(1).max(100),
});

// ─── EMPLOYEE LEAVES ─────────────────────────────────────────────────────────

export const getEmployeeLeavesSchema: Joi.ObjectSchema = Joi.object({
  status: Joi.string().valid('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED', 'pending', 'approved', 'rejected', 'cancelled'),
  leaveType: Joi.string(),
  year: Joi.number().integer().min(1900).max(2100),
  page: Joi.number().integer().min(1),
  limit: Joi.number().integer().min(1).max(100),
});

// ─── EMPLOYEE PAYROLL ────────────────────────────────────────────────────────

export const getEmployeePayrollSchema: Joi.ObjectSchema = Joi.object({
  year: Joi.number().integer().min(1900).max(2100),
  month: Joi.number().integer().min(1).max(12),
  status: Joi.string().valid('DRAFT', 'GENERATED', 'PAID'),
  page: Joi.number().integer().min(1),
  limit: Joi.number().integer().min(1).max(100),
});

// ─── INITIATE LEAVE ON BEHALF ────────────────────────────────────────────────

export const initiateLeaveOnBehalfSchema: Joi.ObjectSchema = Joi.object({
  leaveTypeId: objectId.required(),
  startDate: Joi.date().iso().required(),
  endDate: Joi.date().iso().required(),
  reason: Joi.string().trim().min(10).max(2000).required(),
  notes: Joi.string().trim().max(2000).allow('', null),
});

// ─── TERMINATE EMPLOYEE ──────────────────────────────────────────────────────

export const terminateEmployeeSchema: Joi.ObjectSchema = Joi.object({
  lastWorkingDate: Joi.date().iso().required(),
  reason: Joi.string().valid('RESIGNATION', 'TERMINATION', 'RETIREMENT', 'CONTRACT_END', 'OTHER', 'resignation', 'termination', 'retirement', 'contract_end', 'other').required(),
  reasonDetails: Joi.string().trim().max(2000).allow('', null),
  exitChecklist: Joi.object({
    laptopReturned: Joi.boolean(),
    accessRevoked: Joi.boolean(),
    fnfSettled: Joi.boolean(),
    relievingLetterIssued: Joi.boolean(),
    exitInterviewDone: Joi.boolean(),
  }),
  noticePeriodServed: Joi.boolean(),
  finalSalaryProcessed: Joi.boolean(),
});

// ─── ASSIGN EMPLOYEE ROLE ────────────────────────────────────────────────────

export const assignEmployeeRoleSchema: Joi.ObjectSchema = Joi.object({
  designation: Joi.string().trim().max(200),
  departmentId: objectId.allow(null),
  employmentType: Joi.string().valid('FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERN', 'full_time', 'part_time', 'contract', 'intern'),
  reportingManagerId: objectId.allow(null),
  effectiveDate: Joi.date().iso().required(),
  reason: Joi.string().valid('PROMOTION', 'TRANSFER', 'RESTRUCTURE', 'CORRECTION', 'promotion', 'transfer', 'restructure', 'correction').required(),
  notes: Joi.string().trim().max(2000).allow('', null),
}).min(2);

// ─── RESET EMPLOYEE PASSWORD ─────────────────────────────────────────────────

export const resetEmployeePasswordSchema: Joi.ObjectSchema = Joi.object({
  action: Joi.string().valid('reset_password', 'resend_invite').required(),
  notifyEmployee: Joi.boolean(),
});

// ─── EMPLOYEE DOCUMENT ───────────────────────────────────────────────────────

export const createEmployeeDocumentSchema: Joi.ObjectSchema = Joi.object({
  fileUrl: Joi.string().uri().allow('', null).optional(),
  documentUrl: Joi.string().uri().allow('', null).optional(),
  documentType: Joi.string().valid('OFFER_LETTER', 'ID_PROOF', 'CERTIFICATE', 'CONTRACT', 'NDA', 'PAYSLIP', 'OTHER', 'offer_letter', 'id_proof', 'certificate', 'contract', 'nda', 'payslip', 'other').required(),
  documentName: Joi.string().trim().max(255).required(),
  fileSize: Joi.number().min(0),
  mimeType: Joi.string().trim(),
  expiryDate: Joi.date().iso().allow(null),
  isConfidential: Joi.boolean(),
}).custom((value: Record<string, unknown>, helpers: any) => {
  if (!value.fileUrl && !value.documentUrl) {
    return helpers.error('any.required', { message: 'Either fileUrl or documentUrl is required' });
  }
  return value;
});

export const listEmployeeDocumentsSchema: Joi.ObjectSchema = Joi.object({
  type: Joi.string(),
  page: Joi.number().integer().min(1),
  limit: Joi.number().integer().min(1).max(100),
});

// ─── EMPLOYEE NOTE ───────────────────────────────────────────────────────────

export const createEmployeeNoteSchema: Joi.ObjectSchema = Joi.object({
  content: Joi.string().trim().min(5).max(2000).required(),
  category: Joi.string().valid('PERFORMANCE', 'DISCIPLINARY', 'GENERAL', 'APPRECIATION', 'COMPLAINT', 'OTHER').required(),
  isPinned: Joi.boolean(),
  visibility: Joi.string().valid('HR_ONLY', 'ADMIN_ONLY', 'HR_AND_ADMIN'),
});

export const listEmployeeNotesSchema: Joi.ObjectSchema = Joi.object({
  category: Joi.string(),
  page: Joi.number().integer().min(1),
  limit: Joi.number().integer().min(1).max(100),
});

export const updateEmployeeNoteSchema: Joi.ObjectSchema = Joi.object({
  content: Joi.string().trim().min(5).max(2000),
  category: Joi.string().valid('PERFORMANCE', 'DISCIPLINARY', 'GENERAL', 'APPRECIATION', 'COMPLAINT', 'OTHER'),
  isPinned: Joi.boolean(),
  visibility: Joi.string().valid('HR_ONLY', 'ADMIN_ONLY', 'HR_AND_ADMIN'),
}).min(1);
