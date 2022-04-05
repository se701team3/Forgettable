/* eslint-disable dot-notation */
/* eslint-disable no-underscore-dangle */
/**
 * Controller contains high-level operations using services, consumed by routes
 */
import { NextFunction, Request, Response } from 'express';

import httpStatus from 'http-status';
import userService from '../services/user.service';

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
      name: createdUser.name,
      persons: createdUser.persons,
      encounters: createdUser.encounters,
      goals: createdUser.goals,
      companies: createdUser.companies,
    });
  } catch (e) {
    if (e.name === 'Conflict') {
      res.status(httpStatus.CONFLICT).end();
    }
    next(e);
  }
};

export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authId = req.headers.authorization?.['user_id'];
    const user = await userService.getUserByAuthId(authId);

    if (!user) {
      res.status(httpStatus.NOT_FOUND).end();
    } else {
      // Don't return auth_id in the response
      res.status(httpStatus.OK).json({
        _id: user._id,
        name: user.name,
        persons: user.persons,
        encounters: user.encounters,
        goals: user.goals,
        companies: user.companies,
      });
    }
  } catch (e) {
    next(e);
  }
};
