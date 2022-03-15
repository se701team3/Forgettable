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
import logger from '../utils/logger';

import { POST } from './controller.types';

export const createPerson: POST = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  logger.info('POST /persons/create request from frontend');

  try {
    const person = await personService.createPerson(req.body);
    res.status(httpStatus.CREATED).send(person);
  } catch (e) {
    next(e);
  }
};

export const getPersonWithId = async (
  req: Request,
  res: Response,
): Promise<void> => {
  logger.info('GET /persons/:id request from frontend');

  const authId = req.headers.authorization?.['user_id'];
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
    } else if (!user.persons.length) {
      res.status(httpStatus.NO_CONTENT).end();
    } else {
      const foundUserPersons = await personService.getPeople(req.query, user.persons);
      res.status(httpStatus.OK).json(foundUserPersons).end();
    }
  } catch (e) {
    next(e);
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
