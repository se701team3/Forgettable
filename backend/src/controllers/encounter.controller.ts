/**
 * Controller contains high-level operations using services, consumed by routes
 */
import { NextFunction, Request, Response } from 'express';
import encounterService from '../services/encounter.service';
import logger from '../utils/logger';
import httpStatus from "http-status";
import {EncounterModel} from "../models/encounter.model";
import userService, {getUserByAuthId} from "../services/user.service";
import personService from '../services/person.service';
 
export const createEncounter = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  logger.info("POST /encounter request from frontend");

  const auth_id = req.headers.authorization?.["user_id"];

  try {
    const user = await getUserByAuthId(auth_id);

    if (!user) {
      res.status(httpStatus.FORBIDDEN).send('No such User exists').end();
      return;
    }

    const createdEncounter = await encounterService.createEncounter(req.body);
    logger.info(createdEncounter._id + '');

    createdEncounter.persons.map((personEncountered) => {
      if (!user.persons.includes(personEncountered)) {
        encounterService.deleteEncounter(createdEncounter._id + '');
        res.status(httpStatus.FORBIDDEN).send('Person does not exist for this User').end();
        return;
      }
    })

    const updateUser = await userService.addEncounterToUser(user.auth_id, createdEncounter._id);
    const updatePerson = await personService.addEncounterToPersons(createdEncounter.persons, createdEncounter.id);

    if (!updateUser || !updatePerson) {
      encounterService.deleteEncounter(createdEncounter._id + '');
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
  logger.info("PUT /encounter/:id request from frontend");

  try {
    // check authorization is not a null object (this is necessary check for lint)
    if (req.headers.authorization == null)
      return res.status(httpStatus.NOT_FOUND).end();

    const encounterIdToUpdate = req.params.id;
    const firebaseAuthId = req.headers.authorization["user_id"];

    // check that user exists with that firebase auth_id, and the user specified encounter actually exists
    const userByAuthId = await getUserByAuthId(firebaseAuthId);
    if (
      !userByAuthId ||
      !isEncounterExistsInUser(userByAuthId, encounterIdToUpdate)
    )
      return res.status(httpStatus.NOT_FOUND).end();

    // update encounter
    const newEncounterData = getEncounterFromReqBody(req.body);
    const updatedEncounter = await encounterService.updateEncounter(
      encounterIdToUpdate,
      newEncounterData
    );
    return res
      .sendStatus(
        updatedEncounter ? httpStatus.NO_CONTENT : httpStatus.NOT_FOUND
      )
      .end();
  } catch (e) {
    next(e);
  }
};

export const getAllEncounters = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  logger.info("GET /encounters request from frontend");

  const auth_id = req.headers.authorization?.["user_id"];
  const user = await userService.getUserByAuthId(auth_id);

  try {
    if (!user) {
      res.status(httpStatus.NOT_FOUND).end();
    } else if (!user.encounters.length) {
      res.status(httpStatus.NO_CONTENT).end();
    } else {
      const foundUserEncounters = await encounterService.getAllEncounters(user.encounters);
      res.status(httpStatus.OK).json(foundUserEncounters).end();
    }
  } catch (e) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).end();
  }
};

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
    (e) => e.toString() === encounterId
  );
  return findEncounter.length !== 0;
};
