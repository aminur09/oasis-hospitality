import type { NextFunction, Request, Response } from 'express';

export class ApiError extends Error {
  status: number;
  details?: unknown;

  constructor(status: number, message: string, details?: unknown) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  const isApiError = err instanceof ApiError;
  const status = isApiError ? err.status : 500;
  const message = isApiError ? err.message : 'Internal Server Error';

  // Redact any PII if error contains request data
  res.status(status).json({
    error: {
      message,
      ...(isApiError && err.details ? { details: err.details } : {})
    }
  });
}