import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import logger from "./logger";
import FirebaseAdmin from "../firebase-configs/firebase-config";

const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error(error.message);
  if (error.name === "ValidationError") {
    return res.status(httpStatus.BAD_REQUEST).json({ error: error.message });
  }
  if (error.name === 'CastError'){
    // most likely means string could not be casted to mongo ObjectId
    return res.status(httpStatus.BAD_REQUEST).json({error: error.message});
  }
  next(error);
  return;
};

const authHandler = (req: Request, res: Response, next: NextFunction) => {
  if (!req.headers.authorization) {
    logger.info("No Authorization Header - authHandler");
    res.status(httpStatus.UNAUTHORIZED).end();
  } else {
    const idToken = req.headers.authorization;

    FirebaseAdmin.auth()
      .verifyIdToken(idToken)
      .then((decodedToken) => {
        req.headers.authorization = decodedToken;
        logger.info("Request Authorized - authHandler");
        next();
      })
      .catch((error) => {
        logger.info("Caught Unauthorized Request - authHandler");
        res.status(httpStatus.UNAUTHORIZED).end();
      });
  }
};

export default {
  errorHandler,
  authHandler,
};
