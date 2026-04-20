import type { ErrorCode } from './errors';

export interface SuccessEnvelope<T> {
  success: true;
  data: T;
}

export interface ErrorEnvelope {
  success: false;
  error: {
    code: ErrorCode;
    message: string;
    details?: unknown;
  };
}

export function successResponse<T>(data: T): SuccessEnvelope<T> {
  return {
    success: true,
    data,
  };
}

export function errorResponse(code: ErrorCode, message: string, details?: unknown): ErrorEnvelope {
  return {
    success: false,
    error: {
      code,
      message,
      ...(details === undefined ? {} : { details }),
    },
  };
}