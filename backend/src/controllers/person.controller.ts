/* eslint-disable dot-notation */
/**
 * Controller contains high-level operations using services, consumed by routes
 */
import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import { PersonModel } from 'src/models/person.model';
import userService from '../services/user.service';
import personService from '../services/person.service';
import encounterService from '../services/encounter.service';

import logger from '../utils/logger';
import { POST } from './controller.types';

export const createPerson: POST = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  logger.info('POST /persons request from frontend');
  const auth_id = req.headers.authorization?.["user_id"];

  try {
    let user = await userService.getUserByAuthId(auth_id);

    if (!user) {
      res.status(httpStatus.NOT_FOUND).end();
    } else {
      // Create a new person with the provided information
      const createdPerson = await personService.createPerson(req.body);

      if (!createdPerson) {
        res.status(httpStatus.BAD_REQUEST).end();
      } else {
        // Add a reference to the created person to the user
        user = await userService.addPersonId(user.auth_id, createdPerson._id)
        // If user doesn't contain reference to new person 
        if (!user?.persons.includes(new mongoose.Types.ObjectId(createdPerson._id))) {
          // return Conflict and delete person from db
          await personService.deletePersons(createdPerson._id.toString());
          res.status(httpStatus.CONFLICT).end();
        } else {
          res.status(httpStatus.CREATED).json(createdPerson).end();
        }
      }
    }
  }
  catch (e) {
    next(e);
  }
};

export const getPersonWithId = async (
  req: Request,
  res: Response,
  next: NextFunction
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
      if (user.persons.includes(new mongoose.Types.ObjectId(req.params.id))) {
        person = await personService.getPersonWithId(req.params.id);
      }

      if (!person) {
        res.status(httpStatus.NOT_FOUND).end();
      } else {
        res.status(httpStatus.OK).json(person).end();
      }
    }
  } catch (e) {
    next(e);
  }
};

export const getAllPeople = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  logger.info('GET /persons request from frontend');

  const authId = req.headers.authorization?.['user_id'];
  const user = await userService.getUserByAuthId(authId);

  try {
    if (!user) {
      res.status(httpStatus.NOT_FOUND).end();
    } else {
      const foundUserPersons = await personService.getPeople(req.query, user.persons);
      res.status(httpStatus.OK).json(foundUserPersons).end();
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
    logger.info("DELETE /persons/:personID request from frontend");
    const auth_id = req.headers.authorization?.["user_id"];
    
    const current_user = await userService.getUserByAuthId(auth_id);
    const user_id = req.params.id;

    const user_persons = current_user?.persons;
    let string_persons = user_persons?.map(x => x.toString());

    if (string_persons?.includes(user_id.toString())) {
      try {
        // Delete user from database
        await personService.deletePersons(req.params.id);

        // return encounters that may have empty persons fields
        const empty_encounters = await encounterService.deleteEncounterPerson(req.params.id);
        await userService.deleteUserPerson(req.params.id);

        // Make sure that empty encounters are also deleted from User
        for (let i = 0; i < empty_encounters.length; i++) {
          await userService.deleteUserEncounter(empty_encounters[i]?._id.toString());
        }
        
        // Notify frontend that the operation was successful
        res.sendStatus(httpStatus.OK).end();
      } catch(e) {
  
        next(e);
      }
    } else {
      res.sendStatus(httpStatus.NOT_FOUND).end();
    }
    
    res.status(httpStatus.OK).end();
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

