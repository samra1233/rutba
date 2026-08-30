import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { sendError } from '../utils/responseFormatter';

export interface AdminAuthRequest extends Request {
  admin?: { id: string; email: string };
}

export const requireAdminAuth = (req: AdminAuthRequest, res: Response, next: NextFunction) => {
  const token = req.cookies.admin_token;
  if (!token) {
    return sendError(res, 'Unauthorized: No token provided', 401, 'UNAUTHORIZED');
  }

  try {
    const decoded = jwt.verify(token, env.jwtSecret) as { id: string; email: string };
    req.admin = decoded;
    next();
  } catch (err) {
    return sendError(res, 'Unauthorized: Invalid session token', 401, 'INVALID_TOKEN');
  }
};
