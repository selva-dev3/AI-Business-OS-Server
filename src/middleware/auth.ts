import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import env from '../config/env';
import ApiResponse from '../utils/apiResponse';
import User from '../models/User';
import { AuthRequest, JwtPayload } from '../types';

const authenticate = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    let token = '';
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.replace(/^Bearer\s+/i, '').trim();
    } else if (req.query.token) {
      token = req.query.token as string;
    }

    if (!token) {
      ApiResponse.error(res, 401, 'UNAUTHORIZED', 'Access token required');
      return;
    }

    const decoded = jwt.verify(token, env.jwt.secret) as JwtPayload;

    const user = await User.findById(decoded.userId)
      .populate('roleId', 'name permissions')
      .populate('companyId', 'name plan')
      .select('-password');

    if (!user || !user.isActive) {
      ApiResponse.error(res, 401, 'UNAUTHORIZED', 'User not found or inactive');
      return;
    }

    req.user = user;
    req.companyId = user.companyId?._id?.toString() || user.companyId?.toString();
    next();
  } catch (error) {
    if ((error as Error).name === 'TokenExpiredError') {
      ApiResponse.error(res, 401, 'UNAUTHORIZED', 'Access token expired');
      return;
    }
    ApiResponse.error(res, 401, 'UNAUTHORIZED', 'Invalid access token');
  }
};

const optionalAuth = async (req: AuthRequest, _res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.replace(/^Bearer\s+/i, '').trim();
      const decoded = jwt.verify(token, env.jwt.secret) as JwtPayload;
      const user = await User.findById(decoded.userId)
        .populate('roleId', 'name permissions')
        .select('-password');
      if (user && user.isActive) {
        req.user = user;
        req.companyId = user.companyId?.toString();
      }
    }
  } catch (_) { /* ignore */ }
  next();
};

export { authenticate, optionalAuth };
