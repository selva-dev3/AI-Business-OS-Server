const Joi = require('joi');

const chatSchema = Joi.object({
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

const aiInsightsSchema = Joi.object({
  module: Joi.string().trim().required(),
  data: Joi.object().required(),
});

const summarizeSchema = Joi.object({
  entityType: Joi.string().trim().required(),
  entityId: Joi.string().hex().length(24).required(),
});

const generateEmailSchema = Joi.object({
  type: Joi.string().valid('follow_up', 'proposal', 'welcome', 'reminder', 'custom').required(),
  recipient: Joi.string().email().required(),
  subject: Joi.string().trim().allow('', null).default(''),
  keyPoints: Joi.array().items(Joi.string().trim()).default([]),
  tone: Joi.string().valid('formal', 'casual', 'friendly', 'professional').default('professional'),
});

const forecastSchema = Joi.object({
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

module.exports = {
  chatSchema,
  aiInsightsSchema,
  summarizeSchema,
  generateEmailSchema,
  forecastSchema,
};
