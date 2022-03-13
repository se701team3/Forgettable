/**
 * Controller contains high-level operations using services, consumed by routes
 */
import { NextFunction, Request, Response } from 'express';

import userService from '../services/user.service';
import httpStatus from 'http-status';

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  
  let decodedToken: any;
  if (req.headers.authorization) {
    decodedToken = req.headers.authorization as any;
    req.body.auth_id = decodedToken.uid;
  }

  try {
    const createdUser = await userService.createUser(req.body);

    // Don't return auth_id in the response
    res.status(httpStatus.CREATED).json({
      _id: createdUser._id,
      first_name: createdUser.first_name,
      last_name: createdUser.last_name,
      persons: createdUser.persons,
      encounters: createdUser.encounters
    });

  } catch (e) {
    if (e.name === 'Conflict') {
      res.status(httpStatus.CONFLICT).end();
    }
    next(e);
  }
};