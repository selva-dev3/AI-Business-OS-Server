const Joi = require('joi');

const objectId = Joi.string().regex(/^[0-9a-fA-F]{24}$/);

const createProjectSchema = Joi.object({
  name: Joi.string().trim().max(200).required(),
  code: Joi.string().trim().uppercase().max(50),
  description: Joi.string().trim().max(5000).allow(''),
  status: Joi.string().valid('PLANNING', 'ACTIVE', 'ON_HOLD', 'COMPLETED', 'CANCELLED'),
  priority: Joi.string().valid('LOW', 'MEDIUM', 'HIGH', 'CRITICAL'),
  startDate: Joi.date(),
  endDate: Joi.date(),
  budget: Joi.number().min(0),
  clientId: objectId,
  tags: Joi.array().items(Joi.string().trim()),
});

const updateProjectSchema = Joi.object({
  name: Joi.string().trim().max(200),
  code: Joi.string().trim().uppercase().max(50),
  description: Joi.string().trim().max(5000).allow(''),
  status: Joi.string().valid('PLANNING', 'ACTIVE', 'ON_HOLD', 'COMPLETED', 'CANCELLED'),
  priority: Joi.string().valid('LOW', 'MEDIUM', 'HIGH', 'CRITICAL'),
  startDate: Joi.date(),
  endDate: Joi.date(),
  budget: Joi.number().min(0),
  clientId: objectId.allow(null),
  tags: Joi.array().items(Joi.string().trim()),
});

const addMemberSchema = Joi.object({
  userId: objectId.required(),
  role: Joi.string().valid('PROJECT_MANAGER', 'DEVELOPER', 'DESIGNER', 'TESTER', 'STAKEHOLDER').required(),
});

const createTaskSchema = Joi.object({
  title: Joi.string().trim().max(300).required(),
  description: Joi.string().trim().max(5000).allow(''),
  status: Joi.string().valid('TODO', 'IN_PROGRESS', 'REVIEW', 'DONE'),
  priority: Joi.string().valid('LOW', 'MEDIUM', 'HIGH', 'CRITICAL'),
  assigneeId: objectId,
  milestoneId: objectId,
  parentTaskId: objectId,
  dueDate: Joi.date(),
  estimatedHours: Joi.number().min(0),
  tags: Joi.array().items(Joi.string().trim()),
  attachments: Joi.array().items(Joi.string().uri()),
});

const updateTaskSchema = Joi.object({
  title: Joi.string().trim().max(300),
  description: Joi.string().trim().max(5000).allow(''),
  status: Joi.string().valid('TODO', 'IN_PROGRESS', 'REVIEW', 'DONE'),
  priority: Joi.string().valid('LOW', 'MEDIUM', 'HIGH', 'CRITICAL'),
  assigneeId: objectId.allow(null),
  milestoneId: objectId.allow(null),
  parentTaskId: objectId.allow(null),
  dueDate: Joi.date().allow(null),
  estimatedHours: Joi.number().min(0),
  tags: Joi.array().items(Joi.string().trim()),
  attachments: Joi.array().items(Joi.string().uri()),
});

const moveTaskSchema = Joi.object({
  status: Joi.string().valid('TODO', 'IN_PROGRESS', 'REVIEW', 'DONE').required(),
  position: Joi.number().integer().min(0).required(),
});

const logTimeSchema = Joi.object({
  projectId: objectId.required(),
  date: Joi.date().required(),
  hours: Joi.number().min(0.25).max(24).required(),
  description: Joi.string().trim().max(1000).allow(''),
  isBillable: Joi.boolean(),
});

const addCommentSchema = Joi.object({
  content: Joi.string().trim().max(5000).required(),
});

const createMilestoneSchema = Joi.object({
  name: Joi.string().trim().max(200).required(),
  description: Joi.string().trim().max(5000).allow(''),
  dueDate: Joi.date(),
});

const updateMilestoneSchema = Joi.object({
  name: Joi.string().trim().max(200),
  description: Joi.string().trim().max(5000).allow(''),
  dueDate: Joi.date(),
  status: Joi.string().valid('PENDING', 'IN_PROGRESS', 'COMPLETED'),
});

const createTimesheetSchema = Joi.object({
  projectId: objectId.required(),
  taskId: objectId,
  date: Joi.date().required(),
  hours: Joi.number().min(0.25).max(24).required(),
  description: Joi.string().trim().max(1000).allow(''),
  isBillable: Joi.boolean(),
});

module.exports = {
  createProjectSchema,
  updateProjectSchema,
  addMemberSchema,
  createTaskSchema,
  updateTaskSchema,
  moveTaskSchema,
  logTimeSchema,
  addCommentSchema,
  createMilestoneSchema,
  updateMilestoneSchema,
  createTimesheetSchema,
};
