"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scheduleReportSchema = exports.aiInsightsSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.aiInsightsSchema = joi_1.default.object({
    module: joi_1.default.string().trim().required(),
    data: joi_1.default.object().required(),
});
exports.scheduleReportSchema = joi_1.default.object({
    reportType: joi_1.default.string().trim().required(),
    frequency: joi_1.default.string().valid('ONCE', 'DAILY', 'WEEKLY', 'MONTHLY').required(),
    dayOfWeek: joi_1.default.number().integer().min(0).max(6),
    time: joi_1.default.string().pattern(/^\d{2}:\d{2}$/).required(),
    recipients: joi_1.default.array().items(joi_1.default.string().email()).min(1).required(),
    format: joi_1.default.string().valid('pdf', 'xlsx', 'csv').required(),
    modules: joi_1.default.array().items(joi_1.default.string().trim()).default([]),
});
//# sourceMappingURL=analytics.validator.js.map