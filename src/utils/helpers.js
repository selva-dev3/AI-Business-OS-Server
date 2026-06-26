const crypto = require('crypto');

const generateCode = (prefix, num) => {
  const padded = String(num).padStart(5, '0');
  return `${prefix}-${new Date().getFullYear()}-${padded}`;
};

const generateOTP = (length = 6) => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const generateApiKey = () => {
  return `sk-live-${crypto.randomBytes(32).toString('hex')}`;
};

const maskString = (str, visibleCount = 4) => {
  if (!str) return null;
  if (str.length <= visibleCount) return str;
  return 'X'.repeat(str.length - visibleCount) + str.slice(-visibleCount);
};

const calculateWorkingHours = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return 0;
  const diffMs = new Date(checkOut) - new Date(checkIn);
  return Math.round((diffMs / (1000 * 60 * 60)) * 100) / 100;
};

const calculateDaysBetween = (from, to) => {
  const fromDate = new Date(from);
  const toDate = new Date(to);
  const diffTime = Math.abs(toDate - fromDate);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
};

const paginateQuery = (query, page = 1, limit = 20) => {
  const p = Math.max(1, parseInt(page));
  const l = Math.min(100, Math.max(1, parseInt(limit)));
  const skip = (p - 1) * l;
  return { skip, limit: l, page: p };
};

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

const buildSearchQuery = (search, fields) => {
  if (!search) return {};
  const regex = new RegExp(search, 'i');
  return { $or: fields.map(f => ({ [f]: regex })) };
};

const getIpAddress = (req) => {
  return req.ip || req.connection?.remoteAddress || req.headers['x-forwarded-for'] || 'unknown';
};

const getUserAgent = (req) => {
  return req.headers['user-agent'] || 'unknown';
};

module.exports = {
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
