const Joi = require('joi');

const permissionEntry = Joi.object({
  module: Joi.string().trim().required(),
  action: Joi.string().trim().required(),
  scope: Joi.string().valid('ALL', 'DEPARTMENT', 'OWN').default('OWN'),
});

const createRoleSchema = Joi.object({
  name: Joi.string().trim().max(50).required(),
  description: Joi.string().trim().max(200).allow('', null).default(''),
  permissions: Joi.array().items(permissionEntry).default([]),
});

const updateRoleSchema = Joi.object({
  description: Joi.string().trim().max(200).allow('', null),
  permissions: Joi.array().items(permissionEntry),
}).min(1);

const updateEmailSchema = Joi.object({
  host: Joi.string().trim().required(),
  port: Joi.number().integer().min(1).max(65535).required(),
  secure: Joi.boolean().required(),
  user: Joi.string().trim().required(),
  pass: Joi.string().required(),
  from: Joi.string().trim().required(),
});

const testEmailSchema = Joi.object({
  to: Joi.string().email().required(),
});

const updateTemplateSchema = Joi.object({
  subject: Joi.string().trim().max(200).required(),
  body: Joi.string().required(),
});

const connectIntegrationSchema = Joi.object({
  webhookUrl: Joi.string().uri().required(),
  channel: Joi.string().trim(),
});

const createApiKeySchema = Joi.object({
  name: Joi.string().trim().max(100).required(),
  expiresAt: Joi.date().allow(null).default(null),
  permissions: Joi.array().items(Joi.string().trim()).default([]),
});

const upgradePlanSchema = Joi.object({
  plan: Joi.string().trim().required(),
  billingCycle: Joi.string().valid('monthly', 'annual').required(),
});

module.exports = {
  createRoleSchema,
  updateRoleSchema,
  updateEmailSchema,
  testEmailSchema,
  updateTemplateSchema,
  connectIntegrationSchema,
  createApiKeySchema,
  upgradePlanSchema,
};
