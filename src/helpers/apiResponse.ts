import type { Response } from 'express';

interface SuccessBody<T> {
  success: true;
  message: string;
  data: T;
}

interface ErrorBody {
  success: false;
  message: string;
  errors?: unknown;
}

export function sendSuccess<T>(
  res: Response,
  statusCode: number,
  data: T,
  message = 'OK',
): Response {
  const body: SuccessBody<T> = { success: true, message, data };
  return res.status(statusCode).json(body);
}

export function sendError(
  res: Response,
  statusCode: number,
  message: string,
  errors?: unknown,
): Response {
  const body: ErrorBody = { success: false, message };
  if (errors !== undefined) {
    body.errors = errors;
  }
  return res.status(statusCode).json(body);
}