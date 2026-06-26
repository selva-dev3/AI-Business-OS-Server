const logger = require('../config/logger');
const ApiResponse = require('../utils/apiResponse');
const AppError = require('../utils/appError');

const errorHandler = (err, req, res, _next) => {
  logger.error(`${err.message}`, { stack: err.stack, path: req.originalUrl });

  if (err.isOperational) {
    return ApiResponse.error(res, err.statusCode, err.error, err.message, req.originalUrl);
  }

  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message).join(', ');
    return ApiResponse.error(res, 400, 'BAD_REQUEST', messages, req.originalUrl);
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return ApiResponse.error(res, 409, 'CONFLICT', `Duplicate value for ${field}`, req.originalUrl);
  }

  if (err.name === 'CastError') {
    return ApiResponse.error(res, 400, 'BAD_REQUEST', `Invalid ${err.path}: ${err.value}`, req.originalUrl);
  }

  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return ApiResponse.error(res, 401, 'UNAUTHORIZED', 'Invalid or expired token', req.originalUrl);
  }

  if (err.name === 'MulterError') {
    return ApiResponse.error(res, 400, 'BAD_REQUEST', err.message, req.originalUrl);
  }

  return ApiResponse.error(res, 500, 'INTERNAL_ERROR', 'Internal server error', req.originalUrl);
};

const notFoundHandler = (req, res) => {
  return ApiResponse.error(res, 404, 'NOT_FOUND', `Route ${req.originalUrl} not found`, req.originalUrl);
};

module.exports = { errorHandler, notFoundHandler };
