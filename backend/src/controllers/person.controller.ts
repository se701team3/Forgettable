/* eslint-disable no-underscore-dangle */
/* eslint-disable dot-notation */
/**
 * Controller contains high-level operations using services, consumed by routes
 */
import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import { PersonModel } from 'src/models/person.model';
import { PaginateableResponse } from 'src/utils/paginateable.response';
import userService from '../services/user.service';
import personService from '../services/person.service';
import encounterService from '../services/encounter.service';
import getPersonDetails from './utils/controller-utils';

import logger from '../utils/logger';
import { POST } from './controller.types';
import companyService from '../services/company.service';

export const createPerson: POST = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  logger.info('POST /persons request from frontend');
  const authId = req.headers.authorization?.['user_id'];

  try {
    let user = await userService.getUserByAuthId(authId);

    if (!user) {
      res.status(httpStatus.UNAUTHORIZED).end();
    } else {
      // Create a new person with the provided information
      const createdPerson = await personService.createPerson(req.body);

      if (!createdPerson) {
        res.status(httpStatus.BAD_REQUEST).end();
      } else {
        await Promise.all(createdPerson.companies.map(async (companyId: any) => {
          const company = await companyService.getCompany(companyId);
          // add the person id to all its companies
          if (company) {
            company.persons.push(createdPerson._id);
          }
        }));

        // Add a reference to the created person to the user
        user = await userService.addPersonId(user.auth_id, createdPerson._id);
        // If user doesn't contain reference to new person
        if (!user?.persons.includes(new mongoose.Types.ObjectId(createdPerson._id))) {
          // Return Conflict and delete person from db
          await personService.deletePersons(createdPerson._id.toString());
          res.status(httpStatus.CONFLICT).end();
        } else {
          res.status(httpStatus.CREATED).json(createdPerson).end();
        }
      }
    }
  } catch (e) {
    next(e);
  }
};

export const getPersonWithId = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  logger.info('GET /persons/:id request from frontend');
  const authId = req.headers.authorization?.['user_id'];

  try {
    const user = await userService.getUserByAuthId(authId);

    if (!user) {
      res.status(httpStatus.UNAUTHORIZED).end();
    } else {
      // If the person belongs to this user, find it
      let person: any;
      let personDto: any;
      if (user.persons.includes(new mongoose.Types.ObjectId(req.params.id))) {
        person = await personService.getPersonWithId(req.params.id);

        // Adds embedded encounters with user details to returned person
        // The stringify and parse combo removes typing and allows altering of the parsed objects.
        personDto = JSON.parse(JSON.stringify(person));
        personDto.encounters = JSON.parse(JSON.stringify(
          await Promise.all(personDto.encounters.map(
            async (encounterId: any) => (await encounterService.getEncounter(encounterId)),
          )),
        ));

        for (let i = 0; i < personDto.encounters.length; i++) {
          personDto.encounters[i].persons = await Promise.all(personDto.encounters[i].persons.map(
            async (personsId: any) => (await getPersonDetails(personsId)),
          ));
        }
      }

      if (!person) {
        res.status(httpStatus.NOT_FOUND).end();
      } else {
        res.status(httpStatus.OK).json(personDto).end();
      }
    }
  } catch (e) {
    next(e);
  }
};

export const getAllPeople = async (
  req: Request,
  expressRes: Response,
  next: NextFunction,
): Promise<void> => {
  const res = expressRes as PaginateableResponse;

  logger.info('GET /persons request from frontend');

  const authId = req.headers.authorization?.['user_id'];
  const user = await userService.getUserByAuthId(authId);

  try {
    if (!user) {
      res.status(httpStatus.UNAUTHORIZED).end();
    } else {
      const foundUserPersons = await personService.getPeople(req.query, user.persons);

      res.status(httpStatus.OK).paginate(foundUserPersons);
    }
  } catch (e) {
    next(e);
  }
};

export const getPersonsByCompany = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  logger.info('GET /persons/companies/:id request from frontend');

  const authId = req.headers.authorization?.['user_id'];
  const user = await userService.getUserByAuthId(authId);

  try {
    let company: any;
    let companyPeople: any;
    if (!user) {
      res.status(httpStatus.UNAUTHORIZED).end();
    } else {
      // check if company belongs to user
      if (user.companies.includes(new mongoose.Types.ObjectId(req.params.id))) {
        company = await companyService.getCompany(req.params.id);
        // get each person from the company
        companyPeople = await Promise.all(company.persons.map(
          async (personsId: any) => (await getPersonDetails(personsId)),
        ));
      }

      if (!company) {
        res.status(httpStatus.NOT_FOUND).end();
      } else {
        res.status(httpStatus.OK).json(companyPeople).end();
      }
    }
  } catch (e) {
    next(e);
  }
};

export const getPersonsByLabel = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  logger.info('GET /persons/label request from frontend');

  const authId = req.headers.authorization?.['user_id'];
  const user = await userService.getUserByAuthId(authId);
  const reqLabel = req.query.label?.toString();

  try {
    if (!user) {
      res.status(httpStatus.UNAUTHORIZED).end();
    } else {
      // get all the persons for this user
      let people: any = await Promise.all(user.persons.map(
        async (personsId: any) => (await personService.getPersonWithId(personsId)),
      ));

      // filter, getting all people that have this label ( case insensitive )
      let peopleWithLabel: any = people.filter((person) => person?.labels.some((label) => label.toLowerCase() === reqLabel?.toLowerCase()));

      if (!peopleWithLabel) {
        res.status(httpStatus.NOT_FOUND).end();
      } else {
        res.status(httpStatus.OK).json(peopleWithLabel).end();
      }
    }
  } catch (e) {
    next(e);
  }
};

export const deletePersons = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  logger.info('DELETE /persons/:personID request from frontend');
  const authId = req.headers.authorization?.['user_id'];

  const user = await userService.getUserByAuthId(authId);
  const { id } = req.params;

  if (!user) {
    res.status(httpStatus.UNAUTHORIZED).end();
  }

  const userPersons = user?.persons;
  const stringPersons = userPersons?.map((x) => x.toString());

  if (stringPersons?.includes(id.toString())) {
    try {
      // Delete person from database
      const deletePersonsResult = await personService.deletePersons(id);

      // Return encounters that may have empty persons fields
      const deleteEncountersResult = await encounterService.deleteEncounterPerson(id);
      const emptyEncounters = deleteEncountersResult['array'];
      const encountersBool = deleteEncountersResult['bool'];

      // Delete person from current User document
      const deleteUserResult = await userService.deleteUserPerson(id);

      // Check all service function calls were valid
      if (encountersBool && deletePersonsResult && deleteUserResult) {
        // Make sure that empty encounters are also deleted from User
        for (let i = 0; i < emptyEncounters.length; i++) {
          const result = await userService.deleteUserEncounter(emptyEncounters[i]?._id.toString());

          // Check that a valid deleteUserEncounter was executed
          if (!result) {
            res.sendStatus(httpStatus.CONFLICT).end();
          }
        }
        // Notify frontend that the operation was successful
        res.sendStatus(httpStatus.OK).end();
      } else {
        // Notify frontend that the operation was unsuccessful
        res.sendStatus(httpStatus.CONFLICT).end();
      }
    } catch (e) {
      next(e);
    }
  } else {
    res.sendStatus(httpStatus.NOT_FOUND).end();
  }
};

export const updatePersonWithId = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  logger.info('PUT /persons request from frontend');

  try {
    const authId = req.headers.authorization?.['user_id'];
    const user = await userService.getUserByAuthId(authId);

    if (!user) {
      // User cannot be found in db so must be unauthorized
      return res.status(httpStatus.UNAUTHORIZED).end();
    }
    const newPersonData: PersonModel = req.body;
    // update time_updated to the present time
    newPersonData.time_updated = new Date(Date.now());
    let updatedPerson: any;
    // If the person belongs to this user, find it and update
    if (user.persons.includes(new mongoose.Types.ObjectId(req.params.id))) {
      updatedPerson = await personService.updatePersonWithId(req.params.id, newPersonData);
    } else {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }

    return res.sendStatus(updatedPerson ? httpStatus.NO_CONTENT : httpStatus.NOT_FOUND).end();
  } catch (error) {
    next(error);
  }
};

export const getPeopleWithUpcomingBirthday = async (
  req: Request,
  expressRes: Response,
  next: NextFunction,
): Promise<any> => {
  logger.info('GET /birthdays request from frontend');

  const res = expressRes as PaginateableResponse;
  const authId = req.headers.authorization?.['user_id'];
  const user = await userService.getUserByAuthId(authId);

  try {
    if (!user) {
      res.status(httpStatus.UNAUTHORIZED).end();
    } else {
      let today = new Date();
      today.setHours(0, 0, 0, 0);

      let threeMonthFromToday = new Date();
      threeMonthFromToday.setMonth(threeMonthFromToday.getMonth() + 3);
      threeMonthFromToday.setHours(0, 0, 0, 0);
      const foundUserPersons = await personService.getPersonWithBirthdayRange(user.persons, today, threeMonthFromToday);
      res.status(httpStatus.OK).json(foundUserPersons).end();
    }
  } catch (e) {
    next(e);
  }
};
