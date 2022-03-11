/**
 * Controller contains high-level operations using services, consumed by routes
 */
import { NextFunction, Request, Response } from 'express';

import userService from '../services/user.service';
import FirebaseAdmin from '../firebase-configs/firebase-config';
import httpStatus from 'http-status';

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {

  try {
    const authHeader = req.headers['authorization'];
    let authToken;

    if (authHeader) {
      authToken = authHeader.split(' ')[1];
    }
  
    const { uid } = await FirebaseAdmin.auth().verifyIdToken(authToken);
    req.body.auth_id = uid;

  } catch (e) {
    //Catch all errors as unauthorized access errors
    const err = new Error('Invalid auth token');
    err.name = 'Unauthorized';
    next(err);
    return;
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
    next(e);
  }
};