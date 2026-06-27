import crypto from 'crypto';
import { Request } from 'express';
import { BuildMetaResult } from '../types';

const generateCode = (prefix: string, num: number): string => {
  const padded = String(num).padStart(5, '0');
  return `${prefix}-${new Date().getFullYear()}-${padded}`;
};

const generateOTP = (_length = 6): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const generateApiKey = (): string => {
  return `sk-live-${crypto.randomBytes(32).toString('hex')}`;
};

const maskString = (str: string | null | undefined, visibleCount = 4): string | null => {
  if (!str) return null;
  if (str.length <= visibleCount) return str;
  return 'X'.repeat(str.length - visibleCount) + str.slice(-visibleCount);
};

const calculateWorkingHours = (checkIn: string | Date | null | undefined, checkOut: string | Date | null | undefined): number => {
  if (!checkIn || !checkOut) return 0;
  const diffMs = new Date(checkOut).getTime() - new Date(checkIn).getTime();
  return Math.round((diffMs / (1000 * 60 * 60)) * 100) / 100;
};

const calculateDaysBetween = (from: string | Date, to: string | Date): number => {
  const fromDate = new Date(from);
  const toDate = new Date(to);
  const diffTime = Math.abs(toDate.getTime() - fromDate.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
};

const paginateQuery = (query?: string, page = 1, limit = 20): { skip: number; limit: number; page: number } => {
  const p = Math.max(1, parseInt(query || String(page), 10) || page);
  const l = Math.min(100, Math.max(1, parseInt(String(limit), 10)));
  const skip = (p - 1) * l;
  return { skip, limit: l, page: p };
};

const buildMeta = (total: number, page: number, limit: number): BuildMetaResult => {
  const totalPages = Math.ceil(total / limit);
  return {
    total,
    page,
    limit,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
};

const buildSearchQuery = (search: string | undefined, fields: string[]): Record<string, unknown> => {
  if (!search) return {};
  const regex = new RegExp(search, 'i');
  return { $or: fields.map(f => ({ [f]: regex })) };
};

const getIpAddress = (req: Request): string => {
  return (req.ip || req.socket?.remoteAddress || req.headers['x-forwarded-for'] || 'unknown') as string;
};

const getUserAgent = (req: Request): string => {
  return (req.headers['user-agent'] || 'unknown') as string;
};

export {
  generateCode,
  generateOTP,
  generateApiKey,
  maskString,
  calculateWorkingHours,
  calculateDaysBetween,
  paginateQuery,
  buildMeta,
  buildSearchQuery,
  getIpAddress,
  getUserAgent,
};
