"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundHandler = exports.errorHandler = void 0;
const logger_1 = __importDefault(require("../config/logger"));
const apiResponse_1 = __importDefault(require("../utils/apiResponse"));
const appError_1 = __importDefault(require("../utils/appError"));
const errorHandler = (err, req, res, _next) => {
    logger_1.default.error(`${err.message}`, { stack: err.stack, path: req.originalUrl });
    if (err instanceof appError_1.default && err.isOperational) {
        apiResponse_1.default.error(res, err.statusCode, err.error, err.message, req.originalUrl);
        return;
    }
    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors)
            .map(e => e.message).join(', ');
        apiResponse_1.default.error(res, 400, 'BAD_REQUEST', messages, req.originalUrl);
        return;
    }
    if (err.code === 11000) {
        const keyValue = err.keyValue;
        const field = Object.keys(keyValue)[0] || 'field';
        apiResponse_1.default.error(res, 409, 'CONFLICT', `Duplicate value for ${field}`, req.originalUrl);
        return;
    }
    if (err.name === 'CastError') {
        const castErr = err;
        apiResponse_1.default.error(res, 400, 'BAD_REQUEST', `Invalid ${String(castErr['path'])}: ${String(castErr['value'])}`, req.originalUrl);
        return;
    }
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
        apiResponse_1.default.error(res, 401, 'UNAUTHORIZED', 'Invalid or expired token', req.originalUrl);
        return;
    }
    if (err.name === 'MulterError') {
        apiResponse_1.default.error(res, 400, 'BAD_REQUEST', err.message, req.originalUrl);
        return;
    }
    apiResponse_1.default.error(res, 500, 'INTERNAL_ERROR', 'Internal server error', req.originalUrl);
};
exports.errorHandler = errorHandler;
const notFoundHandler = (req, res) => {
    apiResponse_1.default.error(res, 404, 'NOT_FOUND', `Route ${req.originalUrl} not found`, req.originalUrl);
};
exports.notFoundHandler = notFoundHandler;
//# sourceMappingURL=errorHandler.js.map