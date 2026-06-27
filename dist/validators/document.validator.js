"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.shareDocumentSchema = exports.updateDocumentSchema = exports.updateFolderSchema = exports.createFolderSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createFolderSchema = joi_1.default.object({
    name: joi_1.default.string().trim().max(200).required(),
    description: joi_1.default.string().trim().max(500).allow('', null).default(''),
    parentId: joi_1.default.string().hex().length(24).allow(null).default(null),
});
exports.updateFolderSchema = joi_1.default.object({
    name: joi_1.default.string().trim().max(200),
    description: joi_1.default.string().trim().max(500).allow('', null),
}).min(1);
exports.updateDocumentSchema = joi_1.default.object({
    name: joi_1.default.string().trim().max(255),
    description: joi_1.default.string().trim().max(1000).allow('', null),
    tags: joi_1.default.array().items(joi_1.default.string().trim()),
}).min(1);
exports.shareDocumentSchema = joi_1.default.object({
    userIds: joi_1.default.array().items(joi_1.default.string().hex().length(24)).min(1).required(),
    access: joi_1.default.string().valid('VIEW', 'EDIT').default('VIEW'),
    generateLink: joi_1.default.boolean().default(false),
});
//# sourceMappingURL=document.validator.js.map