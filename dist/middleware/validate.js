"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateQuery = exports.validate = void 0;
const apiResponse_1 = __importDefault(require("../utils/apiResponse"));
const validate = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
        if (error) {
            const messages = error.details.map(d => d.message).join(', ');
            apiResponse_1.default.error(res, 400, 'BAD_REQUEST', messages);
            return;
        }
        req.body = value;
        next();
    };
};
exports.validate = validate;
const validateQuery = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.query, { abortEarly: false, stripUnknown: true });
        if (error) {
            const messages = error.details.map(d => d.message).join(', ');
            apiResponse_1.default.error(res, 400, 'BAD_REQUEST', messages);
            return;
        }
        req.query = value;
        next();
    };
};
exports.validateQuery = validateQuery;
//# sourceMappingURL=validate.js.map