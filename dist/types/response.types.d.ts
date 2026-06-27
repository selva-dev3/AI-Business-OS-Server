import { Response } from 'express';
export interface TypedResponse<T = unknown> extends Response {
    json: (body: T) => this;
}
export type SuccessBody<T = unknown> = {
    success: true;
    data: T;
    timestamp: string;
    requestId: string;
};
export type ErrorBody = {
    success: false;
    statusCode: number;
    error: string;
    message: string;
    path?: string;
    timestamp: string;
    requestId: string;
};
export type PaginatedBody<T = unknown> = {
    success: true;
    data: {
        data: T[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
            hasNext?: boolean;
            hasPrev?: boolean;
        };
    };
    timestamp: string;
    requestId: string;
};
//# sourceMappingURL=response.types.d.ts.map