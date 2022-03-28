/**
 * Controller contains high-level operations using services, consumed by routes
 */

import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { PaginateableResponse } from 'src/utils/paginateable.response';
import mongoose from 'mongoose';
import encounterService from '../services/encounter.service';
import logger from '../utils/logger';
import { GoalModel } from '../models/goal.model';
import userService, { getUserByAuthId } from '../services/user.service';
import personService from '../services/person.service';
import getPersonDetails from './utils/controller-utils';

export const getGoals = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  logger.info('GET /goal request from frontend');
  const authId = req.headers.authorization?.['user_id'];
  const user = await userService.getUserByAuthId(authId);

  if (!user) {
    res.status(httpStatus.NOT_FOUND).end();
  } else {
    const { goals } = user;
    if (!goals) {
      res.status(httpStatus.NO_CONTENT).end();
    } else {
      const userDTO = JSON.parse(JSON.stringify(user));
      const date = userDTO.goals.date_start;
      const date_now = new Date(Date.now());
      if (date > date_now && userDTO.goals.recurring) {
        userDTO.goals.date_start = date_now;
        userDTO.goals.date_end = date_now.setDate(date_now.getDate() + 14);
      } else if (date > date_now && !userDTO.goals.recurring) {
        userDTO.goals = null;
        res.status(httpStatus.NO_CONTENT).end();
      }
    }
  }

  // try {
  //   let user = await userService.getUserByAuthId(authId);
  //
  //   if (!user) {
  //     res.status(httpStatus.UNAUTHORIZED).end();
  //   } else {
  //     // Create a new person with the provided information
  //     const createdPerson = await personService.createPerson(req.body);
  //
  //     if (!createdPerson) {
  //       res.status(httpStatus.BAD_REQUEST).end();
  //     } else {
  //       // Add a reference to the created person to the user
  //       user = await userService.addPersonId(user.auth_id, createdPerson._id);
  //       // If user doesn't contain reference to new person
  //       if (!user?.persons.includes(new mongoose.Types.ObjectId(createdPerson._id))) {
  //         // Return Conflict and delete person from db
  //         await personService.deletePersons(createdPerson._id.toString());
  //         res.status(httpStatus.CONFLICT).end();
  //       } else {
  //         res.status(httpStatus.CREATED).json(createdPerson).end();
  //       }
  //     }
  //   }
  // } catch (e) {
  //   next(e);
  // }
};
