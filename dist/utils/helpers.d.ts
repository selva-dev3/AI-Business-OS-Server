import { Request } from 'express';
import { BuildMetaResult } from '../types';
declare const generateCode: (prefix: string, num: number) => string;
declare const generateOTP: (_length?: number) => string;
declare const generateApiKey: () => string;
declare const maskString: (str: string | null | undefined, visibleCount?: number) => string | null;
declare const calculateWorkingHours: (checkIn: string | Date | null | undefined, checkOut: string | Date | null | undefined) => number;
declare const calculateDaysBetween: (from: string | Date, to: string | Date) => number;
declare const paginateQuery: (query?: string, page?: number, limit?: number) => {
    skip: number;
    limit: number;
    page: number;
};
declare const buildMeta: (total: number, page: number, limit: number) => BuildMetaResult;
declare const buildSearchQuery: (search: string | undefined, fields: string[]) => Record<string, unknown>;
declare const getIpAddress: (req: Request) => string;
declare const getUserAgent: (req: Request) => string;
export { generateCode, generateOTP, generateApiKey, maskString, calculateWorkingHours, calculateDaysBetween, paginateQuery, buildMeta, buildSearchQuery, getIpAddress, getUserAgent, };
//# sourceMappingURL=helpers.d.ts.map