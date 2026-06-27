"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTimesheetSchema = exports.updateMilestoneSchema = exports.createMilestoneSchema = exports.addCommentSchema = exports.logTimeSchema = exports.moveTaskSchema = exports.updateTaskSchema = exports.createTaskSchema = exports.addMemberSchema = exports.updateProjectSchema = exports.createProjectSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const objectId = joi_1.default.string().regex(/^[0-9a-fA-F]{24}$/);
exports.createProjectSchema = joi_1.default.object({
    name: joi_1.default.string().trim().max(200).required(),
    code: joi_1.default.string().trim().uppercase().max(50),
    description: joi_1.default.string().trim().max(5000).allow(''),
    status: joi_1.default.string().valid('PLANNING', 'ACTIVE', 'ON_HOLD', 'COMPLETED', 'CANCELLED'),
    priority: joi_1.default.string().valid('LOW', 'MEDIUM', 'HIGH', 'CRITICAL'),
    startDate: joi_1.default.date(),
    endDate: joi_1.default.date(),
    budget: joi_1.default.number().min(0),
    clientId: objectId,
    tags: joi_1.default.array().items(joi_1.default.string().trim()),
});
exports.updateProjectSchema = joi_1.default.object({
    name: joi_1.default.string().trim().max(200),
    code: joi_1.default.string().trim().uppercase().max(50),
    description: joi_1.default.string().trim().max(5000).allow(''),
    status: joi_1.default.string().valid('PLANNING', 'ACTIVE', 'ON_HOLD', 'COMPLETED', 'CANCELLED'),
    priority: joi_1.default.string().valid('LOW', 'MEDIUM', 'HIGH', 'CRITICAL'),
    startDate: joi_1.default.date(),
    endDate: joi_1.default.date(),
    budget: joi_1.default.number().min(0),
    clientId: objectId.allow(null),
    tags: joi_1.default.array().items(joi_1.default.string().trim()),
});
exports.addMemberSchema = joi_1.default.object({
    userId: objectId.required(),
    role: joi_1.default.string().valid('PROJECT_MANAGER', 'DEVELOPER', 'DESIGNER', 'TESTER', 'STAKEHOLDER').required(),
});
exports.createTaskSchema = joi_1.default.object({
    title: joi_1.default.string().trim().max(300).required(),
    description: joi_1.default.string().trim().max(5000).allow(''),
    status: joi_1.default.string().valid('TODO', 'IN_PROGRESS', 'REVIEW', 'DONE'),
    priority: joi_1.default.string().valid('LOW', 'MEDIUM', 'HIGH', 'CRITICAL'),
    assigneeId: objectId,
    milestoneId: objectId,
    parentTaskId: objectId,
    dueDate: joi_1.default.date(),
    estimatedHours: joi_1.default.number().min(0),
    tags: joi_1.default.array().items(joi_1.default.string().trim()),
    attachments: joi_1.default.array().items(joi_1.default.string().uri()),
});
exports.updateTaskSchema = joi_1.default.object({
    title: joi_1.default.string().trim().max(300),
    description: joi_1.default.string().trim().max(5000).allow(''),
    status: joi_1.default.string().valid('TODO', 'IN_PROGRESS', 'REVIEW', 'DONE'),
    priority: joi_1.default.string().valid('LOW', 'MEDIUM', 'HIGH', 'CRITICAL'),
    assigneeId: objectId.allow(null),
    milestoneId: objectId.allow(null),
    parentTaskId: objectId.allow(null),
    dueDate: joi_1.default.date().allow(null),
    estimatedHours: joi_1.default.number().min(0),
    tags: joi_1.default.array().items(joi_1.default.string().trim()),
    attachments: joi_1.default.array().items(joi_1.default.string().uri()),
});
exports.moveTaskSchema = joi_1.default.object({
    status: joi_1.default.string().valid('TODO', 'IN_PROGRESS', 'REVIEW', 'DONE').required(),
    position: joi_1.default.number().integer().min(0).required(),
});
exports.logTimeSchema = joi_1.default.object({
    projectId: objectId.required(),
    date: joi_1.default.date().required(),
    hours: joi_1.default.number().min(0.25).max(24).required(),
    description: joi_1.default.string().trim().max(1000).allow(''),
    isBillable: joi_1.default.boolean(),
});
exports.addCommentSchema = joi_1.default.object({
    content: joi_1.default.string().trim().max(5000).required(),
});
exports.createMilestoneSchema = joi_1.default.object({
    name: joi_1.default.string().trim().max(200).required(),
    description: joi_1.default.string().trim().max(5000).allow(''),
    dueDate: joi_1.default.date(),
});
exports.updateMilestoneSchema = joi_1.default.object({
    name: joi_1.default.string().trim().max(200),
    description: joi_1.default.string().trim().max(5000).allow(''),
    dueDate: joi_1.default.date(),
    status: joi_1.default.string().valid('PENDING', 'IN_PROGRESS', 'COMPLETED'),
});
exports.createTimesheetSchema = joi_1.default.object({
    projectId: objectId.required(),
    taskId: objectId,
    date: joi_1.default.date().required(),
    hours: joi_1.default.number().min(0.25).max(24).required(),
    description: joi_1.default.string().trim().max(1000).allow(''),
    isBillable: joi_1.default.boolean(),
});
//# sourceMappingURL=project.validator.js.map