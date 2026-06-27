"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCategorySchema = exports.createCategorySchema = exports.closeTicketSchema = exports.changeTicketPrioritySchema = exports.changeTicketStatusSchema = exports.assignTicketSchema = exports.replyTicketSchema = exports.updateTicketSchema = exports.createTicketSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createTicketSchema = joi_1.default.object({
    title: joi_1.default.string().trim().max(200).required(),
    description: joi_1.default.string().trim().max(5000).allow(''),
    priority: joi_1.default.string().valid('LOW', 'MEDIUM', 'HIGH', 'CRITICAL').default('MEDIUM'),
    categoryId: joi_1.default.string().regex(/^[0-9a-fA-F]{24}$/),
    tags: joi_1.default.array().items(joi_1.default.string().trim()),
    attachments: joi_1.default.array().items(joi_1.default.string()),
});
exports.updateTicketSchema = joi_1.default.object({
    title: joi_1.default.string().trim().max(200),
    description: joi_1.default.string().trim().max(5000).allow(''),
    priority: joi_1.default.string().valid('LOW', 'MEDIUM', 'HIGH', 'CRITICAL'),
    categoryId: joi_1.default.string().regex(/^[0-9a-fA-F]{24}$/),
    tags: joi_1.default.array().items(joi_1.default.string().trim()),
    attachments: joi_1.default.array().items(joi_1.default.string()),
});
exports.replyTicketSchema = joi_1.default.object({
    content: joi_1.default.string().trim().max(10000).required(),
    isInternal: joi_1.default.boolean().default(false),
    attachments: joi_1.default.array().items(joi_1.default.string()),
});
exports.assignTicketSchema = joi_1.default.object({
    assigneeId: joi_1.default.string().regex(/^[0-9a-fA-F]{24}$/).required(),
});
exports.changeTicketStatusSchema = joi_1.default.object({
    status: joi_1.default.string().valid('OPEN', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED').required(),
    resolution: joi_1.default.string().trim().max(2000).allow(''),
});
exports.changeTicketPrioritySchema = joi_1.default.object({
    priority: joi_1.default.string().valid('LOW', 'MEDIUM', 'HIGH', 'CRITICAL').required(),
});
exports.closeTicketSchema = joi_1.default.object({
    resolution: joi_1.default.string().trim().max(2000).allow(''),
});
exports.createCategorySchema = joi_1.default.object({
    name: joi_1.default.string().trim().max(100).required(),
    description: joi_1.default.string().trim().max(500).allow(''),
    color: joi_1.default.string().regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/),
    slaHours: joi_1.default.number().integer().min(0),
});
exports.updateCategorySchema = joi_1.default.object({
    name: joi_1.default.string().trim().max(100),
    description: joi_1.default.string().trim().max(500).allow(''),
    color: joi_1.default.string().regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/),
    slaHours: joi_1.default.number().integer().min(0),
    isActive: joi_1.default.boolean(),
});
//# sourceMappingURL=support.validator.js.map