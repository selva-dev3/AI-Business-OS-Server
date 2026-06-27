"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNotificationSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createNotificationSchema = joi_1.default.object({
    userId: joi_1.default.string().hex().length(24).required(),
    type: joi_1.default.string().trim().required(),
    title: joi_1.default.string().trim().max(200).required(),
    message: joi_1.default.string().trim().max(1000).allow('', null).default(''),
    link: joi_1.default.string().uri().allow('', null).default(''),
    metadata: joi_1.default.object().default({}),
});
//# sourceMappingURL=notification.validator.js.map