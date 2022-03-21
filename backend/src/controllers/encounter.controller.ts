/* eslint-disable no-underscore-dangle */
/* eslint-disable dot-notation */
/**
 * Controller contains high-level operations using services, consumed by routes
 */
import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { PaginateableResponse } from 'src/utils/paginateable.response';
import encounterService from '../services/encounter.service';
import logger from '../utils/logger';
import { EncounterModel } from '../models/encounter.model';
import userService, { getUserByAuthId } from '../services/user.service';
import personService from '../services/person.service';
import getPersonDetails from './utils/controller-utils';

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
      let encounterDto = JSON.parse(JSON.stringify(encounter));
      encounterDto.persons = await Promise.all(encounterDto.persons.map(async (personId: any) => (await getPersonDetails(personId))));
      res.status(httpStatus.OK).json(encounterDto).end();
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
  logger.info('DELETE /encounters/:encounterID request from frontend');
  const authId = req.headers.authorization?.['user_id'];
  const user = await userService.getUserByAuthId(authId);

  if (!user) {
    // User cannot be found in db so must be unauthorized
    res.status(httpStatus.UNAUTHORIZED).end();
  }

  const { id } = req.params;
  const userEncounters = user?.encounters;
  const stringEncounters = userEncounters?.map((x) => x.toString());

  if (stringEncounters?.includes(id.toString())) {
    try {
      // Delete encounter from Encounter and Person collection
      const deleteEncounterResult = await encounterService.deleteEncounter(id);
      const deletePersonEncountersResult = await personService.deletePersonEncounters(id);
      const deleteUserEncounterResult = await userService.deleteUserEncounter(id);

      // Notify frontend that the operation was successful
      if (deleteEncounterResult && deletePersonEncountersResult && deleteUserEncounterResult) {
        res.sendStatus(httpStatus.OK).end();
      } else {
        res.sendStatus(httpStatus.CONFLICT).end();
      }
    } catch (e) {
      next(e);
    }
  } else {
    res.sendStatus(httpStatus.NOT_FOUND).end();
  }
};

export const getAllEncounters = async (
  req: Request,
  expressRes: Response,
  next: NextFunction,
): Promise<void> => {
  const res = expressRes as PaginateableResponse;
  logger.info('GET /encounters request from frontend');

  const authId = req.headers.authorization?.['user_id'];
  const user = await userService.getUserByAuthId(authId);

  try {
    if (!user) {
      res.status(httpStatus.NOT_FOUND).end();
    } else {
      // The stringify-parse combo removes typing allowing alteration of the persons field in each encounter
      const foundUserEncounters = JSON.parse(JSON.stringify(await encounterService.getAllEncounters(req.query, user.encounters)));

      // Adds embedded person details to the returned encounters
      for (let i = 0; i < foundUserEncounters.length; i++) {
        foundUserEncounters[i].persons = await Promise.all(foundUserEncounters[i].persons.map(
          async (personsId: any) => (await getPersonDetails(personsId)),
        ));
      }

      res.status(httpStatus.OK).paginate(foundUserEncounters);
    }
  } catch (e) {
    next(e);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).end();
  }
};
