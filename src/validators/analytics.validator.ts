import Joi from 'joi';

export const aiInsightsSchema: Joi.ObjectSchema = Joi.object({
  module: Joi.string().trim().required(),
  data: Joi.object().required(),
});

export const scheduleReportSchema: Joi.ObjectSchema = Joi.object({
  reportType: Joi.string().trim().required(),
  frequency: Joi.string().valid('ONCE', 'DAILY', 'WEEKLY', 'MONTHLY').required(),
  dayOfWeek: Joi.number().integer().min(0).max(6),
  time: Joi.string().pattern(/^\d{2}:\d{2}$/).required(),
  recipients: Joi.array().items(Joi.string().email()).min(1).required(),
  format: Joi.string().valid('pdf', 'xlsx', 'csv').required(),
  modules: Joi.array().items(Joi.string().trim()).default([]),
});
