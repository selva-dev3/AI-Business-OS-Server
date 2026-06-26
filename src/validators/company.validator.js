const Joi = require('joi');

const addressSchema = Joi.object({
  street: Joi.string().trim(),
  city: Joi.string().trim(),
  state: Joi.string().trim(),
  country: Joi.string().trim(),
  zip: Joi.string().trim(),
});

const updateCompanySchema = Joi.object({
  name: Joi.string().trim().max(100),
  phone: Joi.string().trim(),
  website: Joi.string().uri().trim().allow(''),
  address: addressSchema,
  timezone: Joi.string().trim(),
  currency: Joi.string().trim().uppercase().length(3),
});

const updateSettingsSchema = Joi.object({
  attendance: Joi.object({
    workStartTime: Joi.string().pattern(/^\d{2}:\d{2}$/),
    workEndTime: Joi.string().pattern(/^\d{2}:\d{2}$/),
    workingDays: Joi.array().items(
      Joi.string().valid('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY')
    ),
    lateThresholdMinutes: Joi.number().integer().min(0),
  }),
  leave: Joi.object({
    autoApproveAfterDays: Joi.number().integer().min(0),
    maxConsecutiveDays: Joi.number().integer().min(1),
  }),
  payroll: Joi.object({
    payDay: Joi.number().integer().min(1).max(31),
    pfPercentage: Joi.number().min(0).max(100),
    esiPercentage: Joi.number().min(0).max(100),
  }),
  notifications: Joi.object({
    emailEnabled: Joi.boolean(),
    inAppEnabled: Joi.boolean(),
  }),
});

const createBranchSchema = Joi.object({
  name: Joi.string().trim().max(100).required(),
  code: Joi.string().trim().uppercase().required(),
  address: addressSchema,
  phone: Joi.string().trim().allow(''),
  isHQ: Joi.boolean(),
});

const updateBranchSchema = Joi.object({
  name: Joi.string().trim().max(100),
  phone: Joi.string().trim().allow(''),
  isActive: Joi.boolean(),
});

module.exports = {
  updateCompanySchema,
  updateSettingsSchema,
  createBranchSchema,
  updateBranchSchema,
};
