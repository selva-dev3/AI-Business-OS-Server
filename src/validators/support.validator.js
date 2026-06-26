const Joi = require('joi');

const createTicketSchema = Joi.object({
  title: Joi.string().trim().max(200).required(),
  description: Joi.string().trim().max(5000).allow(''),
  priority: Joi.string().valid('LOW', 'MEDIUM', 'HIGH', 'CRITICAL').default('MEDIUM'),
  categoryId: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
  tags: Joi.array().items(Joi.string().trim()),
  attachments: Joi.array().items(Joi.string()),
});

const updateTicketSchema = Joi.object({
  title: Joi.string().trim().max(200),
  description: Joi.string().trim().max(5000).allow(''),
  priority: Joi.string().valid('LOW', 'MEDIUM', 'HIGH', 'CRITICAL'),
  categoryId: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
  tags: Joi.array().items(Joi.string().trim()),
  attachments: Joi.array().items(Joi.string()),
});

const replyTicketSchema = Joi.object({
  content: Joi.string().trim().max(10000).required(),
  isInternal: Joi.boolean().default(false),
  attachments: Joi.array().items(Joi.string()),
});

const assignTicketSchema = Joi.object({
  assigneeId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
});

const changeTicketStatusSchema = Joi.object({
  status: Joi.string().valid('OPEN', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED').required(),
  resolution: Joi.string().trim().max(2000).allow(''),
});

const changeTicketPrioritySchema = Joi.object({
  priority: Joi.string().valid('LOW', 'MEDIUM', 'HIGH', 'CRITICAL').required(),
});

const closeTicketSchema = Joi.object({
  resolution: Joi.string().trim().max(2000).allow(''),
});

const createCategorySchema = Joi.object({
  name: Joi.string().trim().max(100).required(),
  description: Joi.string().trim().max(500).allow(''),
  color: Joi.string().regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/),
  slaHours: Joi.number().integer().min(0),
});

const updateCategorySchema = Joi.object({
  name: Joi.string().trim().max(100),
  description: Joi.string().trim().max(500).allow(''),
  color: Joi.string().regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/),
  slaHours: Joi.number().integer().min(0),
  isActive: Joi.boolean(),
});

module.exports = {
  createTicketSchema,
  updateTicketSchema,
  replyTicketSchema,
  assignTicketSchema,
  changeTicketStatusSchema,
  changeTicketPrioritySchema,
  closeTicketSchema,
  createCategorySchema,
  updateCategorySchema,
};
