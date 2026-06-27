"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.forecastSchema = exports.generateEmailSchema = exports.summarizeSchema = exports.aiInsightsSchema = exports.chatSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.chatSchema = joi_1.default.object({
    messages: joi_1.default.array()
        .items(joi_1.default.object({
        role: joi_1.default.string().valid('user', 'assistant', 'system').required(),
        content: joi_1.default.string().required(),
    }))
        .min(1)
        .required(),
    context: joi_1.default.string().trim().allow('', null).default(''),
    stream: joi_1.default.boolean().default(false),
});
exports.aiInsightsSchema = joi_1.default.object({
    module: joi_1.default.string().trim().required(),
    data: joi_1.default.object().required(),
});
exports.summarizeSchema = joi_1.default.object({
    entityType: joi_1.default.string().trim().required(),
    entityId: joi_1.default.string().hex().length(24).required(),
});
exports.generateEmailSchema = joi_1.default.object({
    type: joi_1.default.string().valid('follow_up', 'proposal', 'welcome', 'reminder', 'custom').required(),
    recipient: joi_1.default.string().email().required(),
    subject: joi_1.default.string().trim().allow('', null).default(''),
    keyPoints: joi_1.default.array().items(joi_1.default.string().trim()).default([]),
    tone: joi_1.default.string().valid('formal', 'casual', 'friendly', 'professional').default('professional'),
});
exports.forecastSchema = joi_1.default.object({
    label: joi_1.default.string().trim().required(),
    historicalData: joi_1.default.array()
        .items(joi_1.default.object({
        period: joi_1.default.string().trim().required(),
        value: joi_1.default.number().required(),
    }))
        .min(2)
        .required(),
    periods: joi_1.default.number().integer().min(1).max(12).required(),
});
//# sourceMappingURL=ai.validator.js.map