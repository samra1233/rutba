import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { env } from '../config/env';
import { sendError } from '../utils/responseFormatter';
import { db } from '../db';

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
    return sendError(res, 'Unauthorized: Invalid session token',401, 'INVALID_TOKEN');
  }
};

/**
 * Verifies admin credentials against:
 * 1. A bcrypt-hashed admin record stored in the local database (managed by the seed endpoint).
 * 2. Environment-configured ADMIN_EMAIL / ADMIN_PASSWORD fallback..
 *
 * Returns the matched admin id or null when credentials are wrong..
 */
export function verifyAdminCredentials(email: string, password: string): { id: string; email: string } | null {
  const cleanEmail = String(email || '').trim().toLowerCase();
  const cleanPassword = String(password || '');

  if (!cleanEmail || !cleanPassword) return null;

  const admin = db.getAdminByEmail(cleanEmail);
  if (admin?.passwordHash && admin.passwordHash.startsWith('$2')) {
    const ok = bcrypt.compareSync(cleanPassword, admin.passwordHash);
    if (ok) return { id: admin.id, email: cleanEmail };
  }

  const envAdminConfigured = Boolean(env.adminEmail && env.adminPassword);
  if (envAdminConfigured && cleanEmail === env.adminEmail && cleanPassword === env.adminPassword) {

    return { id: 'admin-configured', email: cleanEmail };
  }

  return null;
}