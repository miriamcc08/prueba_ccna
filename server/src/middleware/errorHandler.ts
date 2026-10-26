import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import { ApiResponse } from '../../../shared/types';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public override message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'AppError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export function notFoundHandler(req: Request, res: Response): void {
  const response: ApiResponse = {
    success: false,
    error: `Route not found: ${req.method} ${req.originalUrl}`,
  };
  res.status(404).json(response);
}

export function errorHandler(
  err: Error | AppError | ZodError | Prisma.PrismaClientKnownRequestError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void {
  if (process.env.NODE_ENV === 'development') {
    console.error(`[Error] ${req.method} ${req.url}:`, err);
  }

  // Custom AppError
  if (err instanceof AppError) {
    const response: ApiResponse = {
      success: false,
      error: err.message,
      ...(err.details ? { message: typeof err.details === 'string' ? err.details : JSON.stringify(err.details) } : {}),
    };
    res.status(err.statusCode).json(response);
    return;
  }

  // Zod validation errors
  if (err instanceof ZodError) {
    const errorDetails = err.issues.map((e) => `${e.path.join('.')}: ${e.message}`).join('; ');
    const response: ApiResponse = {
      success: false,
      error: 'Validation failed',
      message: errorDetails,
    };
    res.status(400).json(response);
    return;
  }

  // Prisma known errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      const target = Array.isArray(err.meta?.target) ? err.meta.target.join(', ') : 'field';
      const response: ApiResponse = {
        success: false,
        error: `A record with this ${target} already exists.`,
      };
      res.status(409).json(response);
      return;
    }

    if (err.code === 'P2025') {
      const response: ApiResponse = {
        success: false,
        error: 'Record not found.',
      };
      res.status(404).json(response);
      return;
    }
  }

  // Fallback internal server error
  const statusCode = (err as { status?: number; statusCode?: number }).statusCode || 500;
  const message = process.env.NODE_ENV === 'production' && statusCode === 500
    ? 'An unexpected error occurred'
    : err.message || 'Internal server error';

  const response: ApiResponse = {
    success: false,
    error: message,
  };

  res.status(statusCode).json(response);
}
