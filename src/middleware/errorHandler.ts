import { Request, Response, NextFunction } from 'express';
import logger from '../config/logger';
import ApiResponse from '../utils/apiResponse';
import AppError from '../utils/appError';

const errorHandler = (err: Error, req: Request, res: Response, _next: NextFunction): void => {
  logger.error(`${err.message}`, { stack: err.stack, path: req.originalUrl });

  if (err instanceof AppError && err.isOperational) {
    ApiResponse.error(res, err.statusCode, err.error, err.message, req.originalUrl);
    return;
  }

  if (err.name === 'ValidationError') {
    const messages = Object.values((err as unknown as Record<string, unknown>).errors as Record<string, { message: string }>)
      .map(e => e.message).join(', ');
    ApiResponse.error(res, 400, 'BAD_REQUEST', messages, req.originalUrl);
    return;
  }

  if ((err as unknown as Record<string, unknown>).code === 11000) {
    const keyValue = (err as unknown as Record<string, unknown>).keyValue as Record<string, string>;
    const field = Object.keys(keyValue)[0] || 'field';
    ApiResponse.error(res, 409, 'CONFLICT', `Duplicate value for ${field}`, req.originalUrl);
    return;
  }

  if (err.name === 'CastError') {
    const castErr = err as unknown as Record<string, unknown>;
    ApiResponse.error(res, 400, 'BAD_REQUEST', `Invalid ${String(castErr['path'])}: ${String(castErr['value'])}`, req.originalUrl);
    return;
  }

  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    ApiResponse.error(res, 401, 'UNAUTHORIZED', 'Invalid or expired token', req.originalUrl);
    return;
  }

  if (err.name === 'MulterError') {
    ApiResponse.error(res, 400, 'BAD_REQUEST', err.message, req.originalUrl);
    return;
  }

  ApiResponse.error(res, 500, 'INTERNAL_ERROR', 'Internal server error', req.originalUrl);
};

const notFoundHandler = (req: Request, res: Response): void => {
  ApiResponse.error(res, 404, 'NOT_FOUND', `Route ${req.originalUrl} not found`, req.originalUrl);
};

export { errorHandler, notFoundHandler };
