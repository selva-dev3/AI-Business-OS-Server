import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { SuccessBody, ErrorBody, PaginatedBody, PaginatedMeta } from '../types';

class ApiResponse {
  static success<T>(res: Response, data: T, statusCode = 200): void {
    const body: SuccessBody<T> = {
      success: true,
      data,
      timestamp: new Date().toISOString(),
      requestId: uuidv4(),
    };
    res.status(statusCode).json(body);
  }

  static paginated<T>(res: Response, data: T[], meta: PaginatedMeta): void {
    const body: PaginatedBody<T> = {
      success: true,
      data: { data, meta },
      timestamp: new Date().toISOString(),
      requestId: uuidv4(),
    };
    res.status(200).json(body);
  }

  static created<T>(res: Response, data: T): void {
    this.success(res, data, 201);
  }

  static error(res: Response, statusCode: number, error: string, message: string, path?: string): void {
    const body: ErrorBody = {
      success: false,
      statusCode,
      error,
      message,
      path: path || (res.req?.originalUrl ?? undefined),
      timestamp: new Date().toISOString(),
      requestId: uuidv4(),
    };
    res.status(statusCode).json(body);
  }
}

export default ApiResponse;
