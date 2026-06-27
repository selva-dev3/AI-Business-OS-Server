import Joi from 'joi';

export const createTicketSchema: Joi.ObjectSchema = Joi.object({
  title: Joi.string().trim().max(200).required(),
  description: Joi.string().trim().max(5000).allow(''),
  priority: Joi.string().valid('LOW', 'MEDIUM', 'HIGH', 'CRITICAL').default('MEDIUM'),
  categoryId: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
  tags: Joi.array().items(Joi.string().trim()),
  attachments: Joi.array().items(Joi.string()),
});

export const updateTicketSchema: Joi.ObjectSchema = Joi.object({
  title: Joi.string().trim().max(200),
  description: Joi.string().trim().max(5000).allow(''),
  priority: Joi.string().valid('LOW', 'MEDIUM', 'HIGH', 'CRITICAL'),
  categoryId: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
  tags: Joi.array().items(Joi.string().trim()),
  attachments: Joi.array().items(Joi.string()),
});

export const replyTicketSchema: Joi.ObjectSchema = Joi.object({
  content: Joi.string().trim().max(10000).required(),
  isInternal: Joi.boolean().default(false),
  attachments: Joi.array().items(Joi.string()),
});

export const assignTicketSchema: Joi.ObjectSchema = Joi.object({
  assigneeId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
});

export const changeTicketStatusSchema: Joi.ObjectSchema = Joi.object({
  status: Joi.string().valid('OPEN', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED').required(),
  resolution: Joi.string().trim().max(2000).allow(''),
});

export const changeTicketPrioritySchema: Joi.ObjectSchema = Joi.object({
  priority: Joi.string().valid('LOW', 'MEDIUM', 'HIGH', 'CRITICAL').required(),
});

export const closeTicketSchema: Joi.ObjectSchema = Joi.object({
  resolution: Joi.string().trim().max(2000).allow(''),
});

export const createCategorySchema: Joi.ObjectSchema = Joi.object({
  name: Joi.string().trim().max(100).required(),
  description: Joi.string().trim().max(500).allow(''),
  color: Joi.string().regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/),
  slaHours: Joi.number().integer().min(0),
});

export const updateCategorySchema: Joi.ObjectSchema = Joi.object({
  name: Joi.string().trim().max(100),
  description: Joi.string().trim().max(500).allow(''),
  color: Joi.string().regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/),
  slaHours: Joi.number().integer().min(0),
  isActive: Joi.boolean(),
});
