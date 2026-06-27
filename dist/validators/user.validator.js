"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfileSchema = exports.resetUserPasswordSchema = exports.changeRoleSchema = exports.updateUserSchema = exports.inviteUserSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.inviteUserSchema = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    firstName: joi_1.default.string().trim().max(50).required(),
    lastName: joi_1.default.string().trim().max(50).required(),
    roleId: joi_1.default.string().hex().length(24).required(),
});
exports.updateUserSchema = joi_1.default.object({
    firstName: joi_1.default.string().trim().max(50),
    lastName: joi_1.default.string().trim().max(50),
    phone: joi_1.default.string().trim().max(20).allow(null, ''),
    isActive: joi_1.default.boolean(),
}).min(1);
exports.changeRoleSchema = joi_1.default.object({
    roleId: joi_1.default.string().hex().length(24).required(),
});
exports.resetUserPasswordSchema = joi_1.default.object({
    newPassword: joi_1.default.string().min(6).max(128).required(),
    sendEmail: joi_1.default.boolean().required(),
});
exports.updateProfileSchema = joi_1.default.object({
    firstName: joi_1.default.string().trim().max(50),
    lastName: joi_1.default.string().trim().max(50),
    phone: joi_1.default.string().trim().max(20).allow(null, ''),
}).min(1);
//# sourceMappingURL=user.validator.js.map