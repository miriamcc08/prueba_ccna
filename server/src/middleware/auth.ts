import { randomBytes } from 'node:crypto';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ApiResponse } from '../../../shared/types';

export interface AuthUser {
  id: string;
  email: string;
  username: string;
  role: string;
  language: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET must be configured in production.');
}
const JWT_SECRET = process.env.JWT_SECRET || randomBytes(32).toString('hex');
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export function generateToken(payload: AuthUser): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  } as jwt.SignOptions);
}

export function extractToken(req: Request): string | null {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return null;
  }
  const parts = authHeader.split(' ');
  if (parts.length === 2 && parts[0].toLowerCase() === 'bearer') {
    return parts[1];
  }
  return null;
}

export function verifyToken(token: string): AuthUser | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthUser;
    return decoded;
  } catch {
    return null;
  }
}

/**
 * Require valid JWT authentication
 */
export async function requireAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
  const token = extractToken(req);

  if (!token) {
    const response: ApiResponse = {
      success: false,
      error: 'Authentication token is missing. Please log in.',
    };
    res.status(401).json(response);
    return;
  }

  const user = await currentIdentity(token);
  if (!user) {
    const response: ApiResponse = {
      success: false,
      error: 'Invalid or expired authentication token. Please log in again.',
    };
    res.status(401).json(response);
    return;
  }

  req.user = user;
  next();
  } catch (error) { next(error); }
}

/**
 * Optional authentication: attaches user if token is present and valid,
 * but allows unauthenticated requests to proceed.
 */
async function currentIdentity(token: string): Promise<AuthUser | null> {
  const claimed = verifyToken(token);
  if (!claimed || typeof claimed.id !== 'string') return null;
  const { prisma } = await import('../lib/prisma');
  return prisma.user.findUnique({ where: { id: claimed.id }, select: { id: true, email: true, username: true, role: true, language: true } });
}

export async function optionalAuth(req: Request, _res: Response, next: NextFunction): Promise<void> {
  try {
    const token = extractToken(req);
    if (token) req.user = await currentIdentity(token) || undefined;
    next();
  } catch (error) { next(error); }
}

/**
 * Require admin role. Must be preceded by requireAuth.
 */
export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  if (!req.user) {
    const response: ApiResponse = {
      success: false,
      error: 'Authentication required.',
    };
    res.status(401).json(response);
    return;
  }

  if (req.user.role !== 'admin') {
    const response: ApiResponse = {
      success: false,
      error: 'Access denied: Admin privileges required.',
    };
    res.status(403).json(response);
    return;
  }

  next();
}
