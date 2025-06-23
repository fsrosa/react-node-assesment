import { Request, Response, NextFunction } from 'express';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

export interface AppError extends Error {
  statusCode?: number;
  code?: string;
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err);

  if (err instanceof PrismaClientKnownRequestError) {
    // Handle Prisma specific errors
    switch (err.code) {
      case 'P2002': // Unique constraint violation
        return res.status(409).json({
          status: 'error',
          message: 'A record with this value already exists',
          error: err.message
        });
      case 'P2025': // Record not found
        return res.status(404).json({
          status: 'error',
          message: 'Record not found',
          error: err.message
        });
      default:
        return res.status(500).json({
          status: 'error',
          message: 'Database error',
          error: err.message
        });
    }
  }

  // Handle custom errors
  if (err.statusCode) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message
    });
  }

  // Handle unknown errors
  return res.status(500).json({
    status: 'error',
    message: 'Internal server error'
  });
}; 