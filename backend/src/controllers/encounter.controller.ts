/* eslint-disable no-underscore-dangle */
/* eslint-disable dot-notation */
/**
 * Controller contains high-level operations using services, consumed by routes
 */
import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import encounterService from '../services/encounter.service';
import logger from '../utils/logger';
import { EncounterModel } from '../models/encounter.model';
import userService, { getUserByAuthId } from '../services/user.service';
import personService from '../services/person.service';

// Util function that won't be needed regularly
const getEncounterFromReqBody = (body: any) => {
  const encounter: EncounterModel = {
    title: body.title,
    date: body.date,
    time_updated: body.time_updated,
    location: body.location,
    description: body.description,
    persons: body.persons,
  };

  return encounter;
};

/**
 * searches for encounter in user by encounter id
 * @param user user which encounter should be found from
 * @param encounterId id of the encounter to be searched from the user
 */
const isEncounterExistsInUser = (user, encounterId: string): boolean => {
  const findEncounter = user.encounters.filter(
    (e) => e.toString() === encounterId,
  );
  return findEncounter.length !== 0;
};

export const createEncounter = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  logger.info('POST /encounter request from frontend');

  const authId = req.headers.authorization?.['user_id'];

  try {
    const user = await getUserByAuthId(authId);

    if (!user) {
      res.status(httpStatus.FORBIDDEN).send('No such User exists').end();
      return;
    }

    const createdEncounter = await encounterService.createEncounter(req.body);
    logger.info(`${createdEncounter._id}`);

    createdEncounter.persons.forEach((personEncountered) => {
      if (!user.persons.includes(personEncountered)) {
        encounterService.deleteEncounter(`${createdEncounter._id}`);
        res.status(httpStatus.FORBIDDEN).send('Person does not exist for this User').end();
      }
    });

    const updateUser = await userService.addEncounterToUser(user.auth_id, createdEncounter._id);
    const updatePerson = await personService
      .addEncounterToPersons(createdEncounter.persons, createdEncounter._id);

    if (!updateUser || !updatePerson) {
      encounterService.deleteEncounter(`${createdEncounter._id}`);
      res.status(httpStatus.CONFLICT).send('Failed to add encounter').end();
    }

    res.status(httpStatus.CREATED).json(createdEncounter).end();
  } catch (e) {
    next(e);
  }
};

export const updateEncounter = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  logger.info('PUT /encounter/:id request from frontend');

  try {
    // check authorization is not a null object (this is necessary check for lint)
    if (req.headers.authorization == null) { return res.status(httpStatus.NOT_FOUND).end(); }

    const encounterIdToUpdate = req.params.id;
    const firebaseAuthId = req.headers.authorization['user_id'];

    // check user exists with the firebase auth_id, and the user specified encounter actually exists
    const userByAuthId = await getUserByAuthId(firebaseAuthId);
    if (!userByAuthId || !isEncounterExistsInUser(userByAuthId, encounterIdToUpdate)) {
      return res.status(httpStatus.NOT_FOUND).end();
    }

    // update encounter
    const newEncounterData = getEncounterFromReqBody(req.body);
    const updatedEncounter = await encounterService.updateEncounter(
      encounterIdToUpdate,
      newEncounterData,
    );
    return res
      .sendStatus(
        updatedEncounter ? httpStatus.NO_CONTENT : httpStatus.NOT_FOUND,
      )
      .end();
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
    const authId = req.headers.authorization?.['user_id'];

    const userCurrent = await userService.getUserByAuthId(authId);
    const encounterId = req.params.id.toString();
    const userEncounters = userCurrent?.encounters;
    const stringEncounters = userEncounters?.map((x) => x.toString());

    if (stringEncounters?.includes(encounterId)) {
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
};

export const deleteEncounters = async (
  req: Request,
  res: Response,
  next: NextFunction,
  ): Promise<void> => {
    logger.info("DELETE /encounters/:encounterID request from frontend");
    const auth_id = req.headers.authorization?.["user_id"];
    
    const current_user = await userService.getUserByAuthId(auth_id);
    const id = req.params.id;
    const user_encounters = current_user?.encounters;
    let string_encounters = user_encounters?.map(x => x.toString());

    if (string_encounters?.includes(id.toString())) {
      try {
        // Delete encounter from Encounter and Person collection
        const deleteEncounterResult = await encounterService.deleteEncounter(id);
        const deletePersonEncountersResult = await personService.deletePersonEncounters(id);
        const deleteUserEncounterResult = await userService.deleteUserEncounter(id);

        // Notify frontend that the operation was successful
        if (deleteEncounterResult && deletePersonEncountersResult && deleteUserEncounterResult) {
          res.sendStatus(httpStatus.OK).end();
        } else {
          res.sendStatus(httpStatus.BAD_REQUEST).end();
        }
        
      } catch(e) {
  
        next(e);
      }
    } else {
      res.sendStatus(httpStatus.NOT_FOUND).end();
    }
    
    res.status(httpStatus.OK).end();
  };

export const getAllEncounters = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  logger.info('GET /encounters request from frontend');

  const authId = req.headers.authorization?.['user_id'];
  const user = await userService.getUserByAuthId(authId);

  try {
    if (!user) {
      res.status(httpStatus.NOT_FOUND).end();
    } else {
      const foundUserEncounters = await encounterService.getAllEncounters(user.encounters);
      res.status(httpStatus.OK).json(foundUserEncounters).end();
    }
  } catch (e) {
    next(e);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).end();
  }
};
