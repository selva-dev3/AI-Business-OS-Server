import { Response } from 'express';
import { PaginatedMeta } from '../types';
declare class ApiResponse {
    static success<T>(res: Response, data: T, statusCode?: number): void;
    static paginated<T>(res: Response, data: T[], meta: PaginatedMeta): void;
    static created<T>(res: Response, data: T): void;
    static error(res: Response, statusCode: number, error: string, message: string, path?: string): void;
}
export default ApiResponse;
//# sourceMappingURL=apiResponse.d.ts.map