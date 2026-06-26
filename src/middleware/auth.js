const jwt = require('jsonwebtoken');
const env = require('../config/env');
const ApiResponse = require('../utils/apiResponse');
const User = require('../models/User');

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return ApiResponse.error(res, 401, 'UNAUTHORIZED', 'Access token required');
    }

    const token = authHeader.replace(/^Bearer\s+/i, '').replace(/^Bearer\s+/i, '').trim();
    const decoded = jwt.verify(token, env.jwt.secret);

    const user = await User.findById(decoded.userId)
      .populate('roleId', 'name permissions')
      .populate('companyId', 'name plan')
      .select('-password');

    if (!user || !user.isActive) {
      return ApiResponse.error(res, 401, 'UNAUTHORIZED', 'User not found or inactive');
    }

    req.user = user;
    req.companyId = user.companyId?._id || user.companyId;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return ApiResponse.error(res, 401, 'UNAUTHORIZED', 'Access token expired');
    }
    return ApiResponse.error(res, 401, 'UNAUTHORIZED', 'Invalid access token');
  }
};

const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.replace(/^Bearer\s+/i, '').replace(/^Bearer\s+/i, '').trim();
      const decoded = jwt.verify(token, env.jwt.secret);
      const user = await User.findById(decoded.userId)
        .populate('roleId', 'name permissions')
        .select('-password');
      if (user && user.isActive) {
        req.user = user;
        req.companyId = user.companyId;
      }
    }
  } catch (_) { }
  next();
};

module.exports = { authenticate, optionalAuth };
