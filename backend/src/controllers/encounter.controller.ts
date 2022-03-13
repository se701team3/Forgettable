/**
 * Controller contains high-level operations using services, consumed by routes
 */
import { NextFunction, Request, Response } from 'express';

import EncounterModel from '../models/encounter.model';
import encounterService from '../services/encounter.service';
import userService from '../services/user.service';
import httpStatus from 'http-status';
import logger from '../utils/logger';

export const createEncounter = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  logger.info("POST /encounter/create request from frontend");

  try {
    // Grab the data from the req
    const encounterReq = getEncounterFromReqBody(req.body);

    // Pass data to service and attempt to save
    const createdEncounter = await encounterService.createEncounter(encounterReq);

    // Notify frontend that the operation was successful
    res.sendStatus(200);
  } catch (e) {
    next(e);
  }
};

export const getEncounter = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  logger.info('GET /encounters/:id request from frontend');
  try {
    const auth_id = req.headers.authorization?.["user_id"];

    const user_current = await userService.getUserByAuthId(auth_id);
    const encounterId = req.params.id.toString();
    const user_encounters = user_current?.encounters;
    let string_encounters = user_encounters?.map(x => x.toString());

    if (string_encounters?.includes(encounterId)) {
      
      // Find encounter from database
      const encounter = await encounterService.getEncounter(encounterId);
      // Notify frontend that the operation was successful
      res.status(httpStatus.OK).json(encounter).end();

    } else {
      res.sendStatus(httpStatus.NOT_FOUND).end();
    }

  } catch (e) {
    next(e);
  }
  res.status(httpStatus.OK).end();
};

// Util function that won't be needed regularly
const getEncounterFromReqBody = (body: any) => {
  const encounter = {
    date: body.date,
    location: body.location,
    description: body.description,
    persons: body.persons
  }

  return encounter;
}