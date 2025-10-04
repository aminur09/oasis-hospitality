import type { NextFunction, Request, Response } from 'express';
import { verifyJwt } from '../utils/auth';
import { ApiError } from '../utils/error';

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) {
    return next(new ApiError(401, 'Missing Authorization header'));
  }
  try {
    const payload = verifyJwt(token);
    (req as any).user = payload;
    next();
  } catch (_e) {
    next(new ApiError(401, 'Invalid token'));
  }
}

export function requireRole(roles: Array<'ADMIN' | 'EDITOR' | 'VIEWER'>) {
  return function (req: Request, _res: Response, next: NextFunction) {
    const user = (req as any).user as { role?: 'ADMIN' | 'EDITOR' | 'VIEWER' };
    if (!user || !user.role) {
      return next(new ApiError(401, 'Unauthorized'));
    }
    if (!roles.includes(user.role)) {
      return next(new ApiError(403, 'Forbidden'));
    }
    next();
  };
}