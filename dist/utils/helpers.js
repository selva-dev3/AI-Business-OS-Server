"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserAgent = exports.getIpAddress = exports.buildSearchQuery = exports.buildMeta = exports.paginateQuery = exports.calculateDaysBetween = exports.calculateWorkingHours = exports.maskString = exports.generateApiKey = exports.generateOTP = exports.generateCode = void 0;
const crypto_1 = __importDefault(require("crypto"));
const generateCode = (prefix, num) => {
    const padded = String(num).padStart(5, '0');
    return `${prefix}-${new Date().getFullYear()}-${padded}`;
};
exports.generateCode = generateCode;
const generateOTP = (_length = 6) => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};
exports.generateOTP = generateOTP;
const generateApiKey = () => {
    return `sk-live-${crypto_1.default.randomBytes(32).toString('hex')}`;
};
exports.generateApiKey = generateApiKey;
const maskString = (str, visibleCount = 4) => {
    if (!str)
        return null;
    if (str.length <= visibleCount)
        return str;
    return 'X'.repeat(str.length - visibleCount) + str.slice(-visibleCount);
};
exports.maskString = maskString;
const calculateWorkingHours = (checkIn, checkOut) => {
    if (!checkIn || !checkOut)
        return 0;
    const diffMs = new Date(checkOut).getTime() - new Date(checkIn).getTime();
    return Math.round((diffMs / (1000 * 60 * 60)) * 100) / 100;
};
exports.calculateWorkingHours = calculateWorkingHours;
const calculateDaysBetween = (from, to) => {
    const fromDate = new Date(from);
    const toDate = new Date(to);
    const diffTime = Math.abs(toDate.getTime() - fromDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
};
exports.calculateDaysBetween = calculateDaysBetween;
const paginateQuery = (query, page = 1, limit = 20) => {
    const p = Math.max(1, parseInt(query || String(page), 10) || page);
    const l = Math.min(100, Math.max(1, parseInt(String(limit), 10)));
    const skip = (p - 1) * l;
    return { skip, limit: l, page: p };
};
exports.paginateQuery = paginateQuery;
const buildMeta = (total, page, limit) => {
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
exports.buildMeta = buildMeta;
const buildSearchQuery = (search, fields) => {
    if (!search)
        return {};
    const regex = new RegExp(search, 'i');
    return { $or: fields.map(f => ({ [f]: regex })) };
};
exports.buildSearchQuery = buildSearchQuery;
const getIpAddress = (req) => {
    return (req.ip || req.socket?.remoteAddress || req.headers['x-forwarded-for'] || 'unknown');
};
exports.getIpAddress = getIpAddress;
const getUserAgent = (req) => {
    return (req.headers['user-agent'] || 'unknown');
};
exports.getUserAgent = getUserAgent;
//# sourceMappingURL=helpers.js.map