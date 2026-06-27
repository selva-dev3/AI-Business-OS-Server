"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBranchSchema = exports.createBranchSchema = exports.updateSettingsSchema = exports.updateCompanySchema = void 0;
const joi_1 = __importDefault(require("joi"));
const addressSchema = joi_1.default.object({
    street: joi_1.default.string().trim(),
    city: joi_1.default.string().trim(),
    state: joi_1.default.string().trim(),
    country: joi_1.default.string().trim(),
    zip: joi_1.default.string().trim(),
});
exports.updateCompanySchema = joi_1.default.object({
    name: joi_1.default.string().trim().max(100),
    phone: joi_1.default.string().trim(),
    website: joi_1.default.string().uri().trim().allow(''),
    address: addressSchema,
    timezone: joi_1.default.string().trim(),
    currency: joi_1.default.string().trim().uppercase().length(3),
});
exports.updateSettingsSchema = joi_1.default.object({
    attendance: joi_1.default.object({
        workStartTime: joi_1.default.string().pattern(/^\d{2}:\d{2}$/),
        workEndTime: joi_1.default.string().pattern(/^\d{2}:\d{2}$/),
        workingDays: joi_1.default.array().items(joi_1.default.string().valid('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY')),
        lateThresholdMinutes: joi_1.default.number().integer().min(0),
    }),
    leave: joi_1.default.object({
        autoApproveAfterDays: joi_1.default.number().integer().min(0),
        maxConsecutiveDays: joi_1.default.number().integer().min(1),
    }),
    payroll: joi_1.default.object({
        payDay: joi_1.default.number().integer().min(1).max(31),
        pfPercentage: joi_1.default.number().min(0).max(100),
        esiPercentage: joi_1.default.number().min(0).max(100),
    }),
    notifications: joi_1.default.object({
        emailEnabled: joi_1.default.boolean(),
        inAppEnabled: joi_1.default.boolean(),
    }),
});
exports.createBranchSchema = joi_1.default.object({
    name: joi_1.default.string().trim().max(100).required(),
    code: joi_1.default.string().trim().uppercase().required(),
    address: addressSchema,
    phone: joi_1.default.string().trim().allow(''),
    isHQ: joi_1.default.boolean(),
});
exports.updateBranchSchema = joi_1.default.object({
    name: joi_1.default.string().trim().max(100),
    phone: joi_1.default.string().trim().allow(''),
    isActive: joi_1.default.boolean(),
});
//# sourceMappingURL=company.validator.js.map