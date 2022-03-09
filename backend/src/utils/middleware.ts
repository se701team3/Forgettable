import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import logger from './logger';

const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  logger.error(error.message);
  if (error.name === 'ValidationError') {
    return res.status(httpStatus.BAD_REQUEST).json({ error: error.message });
  }
  next(error);
};

export default {
  errorHandler,
};
