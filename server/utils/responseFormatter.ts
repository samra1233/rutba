import { Response } from 'express';

export interface SuccessResponse<T> {
  success: true;
  data: T;
  meta?: Record<string, any>;
}

export interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
}

export function sendSuccess<T>(res: Response, data: T, statusCode = 200, meta?: Record<string, any>) {
  const payload: SuccessResponse<T> = {
    success: true,
    data
  };
  if (meta) payload.meta = meta;
  return res.status(statusCode).json(payload);
}

export function sendError(res: Response, message: string, statusCode = 400, code = 'BAD_REQUEST', details?: any) {
  const payload: ErrorResponse = {
    success: false,
    error: {
      code,
      message,
      ...(details ? { details } : {})
    }
  };
  return res.status(statusCode).json(payload);
}
