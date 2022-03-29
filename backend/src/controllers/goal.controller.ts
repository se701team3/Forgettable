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
import goalService from '../services/goal.service';
import getPersonDetails from './utils/controller-utils';
import personService from '../services/person.service';
import { EncounterModel } from '../models/encounter.model';

// Util function that won't be needed regularly
const getGoalFromReqBody = (body: any) => {
  const goal: GoalModel = {
    date_start: body.date_start,
    date_end: body.date_end,
    duration: body.duration,
    recurring: body.recurring,
  };

  return goal;
};

/**
 * searches for encounter in user by goal id
 * @param user user which goal should be found from
 * @param encounterId id of the goal to be searched from the user
 */
const isGoalExistsInUser = (user, goalId: string): boolean => {
  const findGoal = user.goals.filter(
    (e) => e.toString() === goalId,
  );
  return findGoal.length !== 0;
};

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
        res.status(httpStatus.OK).json(userDTO).end();
      } else if (date > date_now && !userDTO.goals.recurring) {
        userDTO.goals = null;
        res.status(httpStatus.NO_CONTENT).json(userDTO).end();
      }
    }
  }
};

export const createGoals = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const authId = req.headers.authorization?.['user_id'];

  try {
    const user = await userService.getUserByAuthId(authId);

    if (!user) {
      res.status(httpStatus.FORBIDDEN).send('No such User exists').end();
      return;
    }
    const createdGoal = await goalService.createGoal(req.body);
    logger.info(`${createdGoal._id}`);

    const updateUser = await userService.addGoalToUser(user.auth_id, createdGoal._id);

    if (!updateUser) {
      goalService.deleteGoal(`${createdGoal._id}`);
      res.status(httpStatus.CONFLICT).send('Failed to add goal').end();
    }

    res.status(httpStatus.CREATED).json(createdGoal).end();
  } catch (e) {
    next(e);
  }
};

export const updateGoal = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  logger.info('PUT /goal/:id request from frontend');

  try {
    // check authorization is not a null object (this is necessary check for lint)
    if (req.headers.authorization == null) { return res.status(httpStatus.NOT_FOUND).end(); }

    const goalIdToUpdate = req.params.id;
    const firebaseAuthId = req.headers.authorization['user_id'];

    // check user exists with the firebase auth_id, and the user specified encounter actually exists
    const userByAuthId = await getUserByAuthId(firebaseAuthId);
    if (!userByAuthId || !isGoalExistsInUser(userByAuthId, goalIdToUpdate)) {
      return res.status(httpStatus.NOT_FOUND).end();
    }

    // update encounter
    const newGoalData = getGoalFromReqBody(req.body);
    const updatedGoal = await goalService.updateGoal(
      goalIdToUpdate,
      newGoalData,
    );
    return res
      .sendStatus(
        updatedGoal ? httpStatus.NO_CONTENT : httpStatus.NOT_FOUND,
      )
      .end();
  } catch (e) {
    next(e);
  }
};

export const deleteGoal = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  logger.info('DELETE /goal/:goalID request from frontend');
  const authId = req.headers.authorization?.['user_id'];
  const user = await userService.getUserByAuthId(authId);

  if (!user) {
    // User cannot be found in db so must be unauthorized
    res.status(httpStatus.UNAUTHORIZED).end();
  }

  const { id } = req.params;
  const userGoal = user?.goals;
  const stringGoal = userGoal?.map((x) => x.toString());

  if (stringGoal?.includes(id.toString())) {
    try {
      // Delete encounter from Encounter and Person collection
      const deleteGoalResult = await goalService.deleteGoal(id);
      const deleteUserGoalResult = await userService.deleteUserGoal(id);

      // Notify frontend that the operation was successful
      if (deleteGoalResult && deleteUserGoalResult) {
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
