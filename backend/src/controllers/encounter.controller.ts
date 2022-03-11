/**
 * Controller contains high-level operations using services, consumed by routes
 */
import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import FirebaseAdmin from 'src/firebase-configs/firebase-config';

import encounterService from '../services/encounter.service';
import logger from '../utils/logger';

export const createEncounter = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {

  //TODO: has to verify user token here first and retreive the list of persons belonging to the user


  try {
    // Pass data to service and attempt to save
    const createdEncounter = await encounterService.createEncounter(req.body);
    // Notify frontend that the operation was successful
    res.status(httpStatus.CREATED).json(createdEncounter);
  } catch (e) {
    next(e);
  }
};
