import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utility/AppError';

const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(error);

  if (error instanceof AppError) {
    const appError = error as AppError;
    return res.status(appError.statusCode).json({
      message: appError.message,
    });
  }

  return res.status(500).send('Something went wrong');
};

export default errorHandler;
