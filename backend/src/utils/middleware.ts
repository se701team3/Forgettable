import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import logger from './logger';
import FirebaseAdmin from '../firebase-configs/firebase-config';
import { PaginateableResponse } from './paginateable.response';

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
  if (error.name === 'CastError') {
    // most likely means string could not be casted to mongo ObjectId
    return res.status(httpStatus.BAD_REQUEST).json({ error: error.message });
  }
  next(error);
  return;
};

const authHandler = (req: Request, res: Response, next: NextFunction) => {
  if (!req.headers.authorization) {
    logger.info('No Authorization Header - authHandler');
    res.status(httpStatus.UNAUTHORIZED).end();
  } else {
    const idToken = req.headers.authorization;

    FirebaseAdmin.auth()
      .verifyIdToken(idToken)
      .then((decodedToken) => {
        req.headers.authorization = decodedToken;
        logger.info('Request Authorized - authHandler');
        next();
      })
      .catch((error) => {
        logger.info('Caught Unauthorized Request - authHandler');
        res.status(httpStatus.UNAUTHORIZED).end();
      });
  }
};

/**
 * Middleware for paginating results into pages. This middleware attaches a function
 * to 'res' that can be used for pagination.
 *
 * If either page or limit is less than 1, then an empty array is returned
 */
const paginationHandler = (req: Request, res: Response, next: NextFunction) => {
  const paginateableResponse = res as PaginateableResponse;

  function paginate(result) {
    const page = parseInt(req.query.page as string);
    let limit = parseInt(req.query.limit as string);

    if (!Array.isArray(result) || isNaN(page) || isNaN(limit)) {
      res.json(result).end();
      return res;
    }

    if (limit < 0 || page < 0) {
      limit = 0;
    }

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    res.json(result.slice(startIndex, endIndex)).end();
    return res;
  }

  paginateableResponse.paginate = paginate;
  next();
};

export default {
  errorHandler,
  authHandler,
  paginationHandler,
};
