"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionalAuth = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = __importDefault(require("../config/env"));
const apiResponse_1 = __importDefault(require("../utils/apiResponse"));
const User_1 = __importDefault(require("../models/User"));
const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            apiResponse_1.default.error(res, 401, 'UNAUTHORIZED', 'Access token required');
            return;
        }
        const token = authHeader.replace(/^Bearer\s+/i, '').trim();
        const decoded = jsonwebtoken_1.default.verify(token, env_1.default.jwt.secret);
        const user = await User_1.default.findById(decoded.userId)
            .populate('roleId', 'name permissions')
            .populate('companyId', 'name plan')
            .select('-password');
        if (!user || !user.isActive) {
            apiResponse_1.default.error(res, 401, 'UNAUTHORIZED', 'User not found or inactive');
            return;
        }
        req.user = user;
        req.companyId = user.companyId?._id?.toString() || user.companyId?.toString();
        next();
    }
    catch (error) {
        if (error.name === 'TokenExpiredError') {
            apiResponse_1.default.error(res, 401, 'UNAUTHORIZED', 'Access token expired');
            return;
        }
        apiResponse_1.default.error(res, 401, 'UNAUTHORIZED', 'Invalid access token');
    }
};
exports.authenticate = authenticate;
const optionalAuth = async (req, _res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.replace(/^Bearer\s+/i, '').trim();
            const decoded = jsonwebtoken_1.default.verify(token, env_1.default.jwt.secret);
            const user = await User_1.default.findById(decoded.userId)
                .populate('roleId', 'name permissions')
                .select('-password');
            if (user && user.isActive) {
                req.user = user;
                req.companyId = user.companyId?.toString();
            }
        }
    }
    catch (_) { /* ignore */ }
    next();
};
exports.optionalAuth = optionalAuth;
//# sourceMappingURL=auth.js.map