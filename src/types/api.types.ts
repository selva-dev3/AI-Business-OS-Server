export interface ApiSuccessResponse<T = unknown> {
  success: true;
  data: T;
  timestamp: string;
  requestId: string;
}

export interface ApiErrorResponse {
  success: false;
  statusCode: number;
  error: string;
  message: string;
  path?: string;
  timestamp: string;
  requestId: string;
}

export interface PaginatedMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext?: boolean;
  hasPrev?: boolean;
}

export interface PaginatedResponse<T = unknown> {
  success: true;
  data: {
    data: T[];
    meta: PaginatedMeta;
  };
  timestamp: string;
  requestId: string;
}

export interface HealthResponse {
  status: 'OK';
  uptime: number;
  timestamp: string;
}

export interface RootResponse {
  success: boolean;
  message: string;
  version: string;
}
