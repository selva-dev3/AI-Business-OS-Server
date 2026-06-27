import Joi from 'joi';

const permissionEntry: Joi.ObjectSchema = Joi.object({
  module: Joi.string().trim().required(),
  action: Joi.string().trim().required(),
  scope: Joi.string().valid('ALL', 'DEPARTMENT', 'OWN').default('OWN'),
});

export const createRoleSchema: Joi.ObjectSchema = Joi.object({
  name: Joi.string().trim().max(50).required(),
  description: Joi.string().trim().max(200).allow('', null).default(''),
  permissions: Joi.array().items(permissionEntry).default([]),
});

export const updateRoleSchema: Joi.ObjectSchema = Joi.object({
  description: Joi.string().trim().max(200).allow('', null),
  permissions: Joi.array().items(permissionEntry),
}).min(1);

export const updateEmailSchema: Joi.ObjectSchema = Joi.object({
  host: Joi.string().trim().required(),
  port: Joi.number().integer().min(1).max(65535).required(),
  secure: Joi.boolean().required(),
  user: Joi.string().trim().required(),
  pass: Joi.string().required(),
  from: Joi.string().trim().required(),
});

export const testEmailSchema: Joi.ObjectSchema = Joi.object({
  to: Joi.string().email().required(),
});

export const updateTemplateSchema: Joi.ObjectSchema = Joi.object({
  subject: Joi.string().trim().max(200).required(),
  body: Joi.string().required(),
});

export const connectIntegrationSchema: Joi.ObjectSchema = Joi.object({
  webhookUrl: Joi.string().uri().required(),
  channel: Joi.string().trim(),
});

export const createApiKeySchema: Joi.ObjectSchema = Joi.object({
  name: Joi.string().trim().max(100).required(),
  expiresAt: Joi.date().allow(null).default(null),
  permissions: Joi.array().items(Joi.string().trim()).default([]),
});

export const upgradePlanSchema: Joi.ObjectSchema = Joi.object({
  plan: Joi.string().trim().required(),
  billingCycle: Joi.string().valid('monthly', 'annual').required(),
});
