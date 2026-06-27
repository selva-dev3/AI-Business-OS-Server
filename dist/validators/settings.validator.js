"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upgradePlanSchema = exports.createApiKeySchema = exports.connectIntegrationSchema = exports.updateTemplateSchema = exports.testEmailSchema = exports.updateEmailSchema = exports.updateRoleSchema = exports.createRoleSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const permissionEntry = joi_1.default.object({
    module: joi_1.default.string().trim().required(),
    action: joi_1.default.string().trim().required(),
    scope: joi_1.default.string().valid('ALL', 'DEPARTMENT', 'OWN').default('OWN'),
});
exports.createRoleSchema = joi_1.default.object({
    name: joi_1.default.string().trim().max(50).required(),
    description: joi_1.default.string().trim().max(200).allow('', null).default(''),
    permissions: joi_1.default.array().items(permissionEntry).default([]),
});
exports.updateRoleSchema = joi_1.default.object({
    description: joi_1.default.string().trim().max(200).allow('', null),
    permissions: joi_1.default.array().items(permissionEntry),
}).min(1);
exports.updateEmailSchema = joi_1.default.object({
    host: joi_1.default.string().trim().required(),
    port: joi_1.default.number().integer().min(1).max(65535).required(),
    secure: joi_1.default.boolean().required(),
    user: joi_1.default.string().trim().required(),
    pass: joi_1.default.string().required(),
    from: joi_1.default.string().trim().required(),
});
exports.testEmailSchema = joi_1.default.object({
    to: joi_1.default.string().email().required(),
});
exports.updateTemplateSchema = joi_1.default.object({
    subject: joi_1.default.string().trim().max(200).required(),
    body: joi_1.default.string().required(),
});
exports.connectIntegrationSchema = joi_1.default.object({
    webhookUrl: joi_1.default.string().uri().required(),
    channel: joi_1.default.string().trim(),
});
exports.createApiKeySchema = joi_1.default.object({
    name: joi_1.default.string().trim().max(100).required(),
    expiresAt: joi_1.default.date().allow(null).default(null),
    permissions: joi_1.default.array().items(joi_1.default.string().trim()).default([]),
});
exports.upgradePlanSchema = joi_1.default.object({
    plan: joi_1.default.string().trim().required(),
    billingCycle: joi_1.default.string().valid('monthly', 'annual').required(),
});
//# sourceMappingURL=settings.validator.js.map