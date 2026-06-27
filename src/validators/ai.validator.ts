import Joi from 'joi';

export const chatSchema: Joi.ObjectSchema = Joi.object({
  messages: Joi.array()
    .items(
      Joi.object({
        role: Joi.string().valid('user', 'assistant', 'system').required(),
        content: Joi.string().required(),
      })
    )
    .min(1)
    .required(),
  context: Joi.string().trim().allow('', null).default(''),
  stream: Joi.boolean().default(false),
});

export const aiInsightsSchema: Joi.ObjectSchema = Joi.object({
  module: Joi.string().trim().required(),
  data: Joi.object().required(),
});

export const summarizeSchema: Joi.ObjectSchema = Joi.object({
  entityType: Joi.string().trim().required(),
  entityId: Joi.string().hex().length(24).required(),
});

export const generateEmailSchema: Joi.ObjectSchema = Joi.object({
  type: Joi.string().valid('follow_up', 'proposal', 'welcome', 'reminder', 'custom').required(),
  recipient: Joi.string().email().required(),
  subject: Joi.string().trim().allow('', null).default(''),
  keyPoints: Joi.array().items(Joi.string().trim()).default([]),
  tone: Joi.string().valid('formal', 'casual', 'friendly', 'professional').default('professional'),
});

export const forecastSchema: Joi.ObjectSchema = Joi.object({
  label: Joi.string().trim().required(),
  historicalData: Joi.array()
    .items(
      Joi.object({
        period: Joi.string().trim().required(),
        value: Joi.number().required(),
      })
    )
    .min(2)
    .required(),
  periods: Joi.number().integer().min(1).max(12).required(),
});
