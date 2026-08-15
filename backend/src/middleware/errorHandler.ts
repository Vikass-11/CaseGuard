import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

import { ZodError } from 'zod';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  logger.error(err.stack || err.message);

  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let code = 'INTERNAL_SERVER_ERROR';
  let message = err.message || 'An unexpected error occurred';
  let details = null;

  if (err instanceof ZodError) {
    statusCode = 400;
    code = 'VALIDATION_ERROR';
    message = 'Invalid input data';
    details = err.errors;
  } else if (err.name === 'UnauthorizedError' || statusCode === 401) {
    code = 'UNAUTHORIZED';
  } else if (statusCode === 403) {
    code = 'FORBIDDEN';
  } else if (statusCode === 404) {
    code = 'NOT_FOUND';
  }

  res.status(statusCode).json({
    error: {
      code,
      message,
      details,
      stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
    }
  });
};
