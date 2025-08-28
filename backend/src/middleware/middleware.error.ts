import { NextFunction, Request, Response } from 'express';
import { ErrorHandler } from 'src/utils/error.handler';

export const error = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'Internal Server Error';

  // Handle invalid JSON web token error
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid JSON web token. Please try again.';
    err = new ErrorHandler(message, 400);
  }

  // Handle expired JSON web token error
  if (err.name === 'JsonWebTokenExpired') {
    const message = 'Your token has expired. Please log in again.';
    err = new ErrorHandler(message, 400);
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};
