/**
 * Controller contains high-level operations using services, consumed by routes
 */

import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import logger from '../utils/logger';
import { GoalModel } from '../models/goal.model';
import userService, { getUserByAuthId } from '../services/user.service';
import goalService from '../services/goal.service';
import encounterService from "../services/encounter.service";

// Util function that won't be needed regularly
const getGoalFromReqBody = (body: any) => {
  const goal: GoalModel = {
    date_start: body.date_start,
    date_end: body.date_end,
    duration: body.duration,
    encounter_goal: body.encounter_goal,
    recurring: body.recurring,
  };

  return goal;
};

/**
 * searches for goal in user by goal id
 * @param user user which goal should be found from
 * @param goalId id of the goal to be searched from the user
 */
const isGoalExistsInUser = (user, goalId: string): boolean => {
  const findGoal = user.goals.filter(
    (e) => e.toString() === goalId,
  );
  return findGoal.length !== 0;
};

export const getGoal = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  logger.info('GET /goal/:id request from frontend');
  try {
    const authId = req.headers.authorization?.['user_id'];

    const userCurrent = await userService.getUserByAuthId(authId);
    const goalId = req.params.id.toString();
    const userGoal = userCurrent?.goals;

    if (userGoal === undefined) {
      res.sendStatus(httpStatus.NOT_FOUND).end();
    } else if (userGoal.length === 0) {
      res.sendStatus(httpStatus.NO_CONTENT).end();
    }
    const stringGoal = userGoal?.map((x) => x.toString());
    if (stringGoal?.includes(goalId)) {
      // Find goal from database
      const goal = await goalService.getGoal(goalId);
      if (!goal) {
        res.sendStatus(httpStatus.NOT_FOUND).end();
        return;
      }
      const time_now = new Date();
      time_now.setUTCHours(0, 0, 0, 0);

      // If the date is surpassed and it is a recurring goal, update the current start/end dates accordingly
      if (goal.date_end < time_now && goal.recurring) {
        goal.date_start = time_now;
        goal.date_end = new Date();
        goal.date_end.setDate(goal.date_start.getDate() + parseInt(goal.duration));
        goal.date_end.setUTCHours(0, 0, 0, 0);
        const updatedGoal = await goalService.updateGoal(
          goalId,
          goal,
        );
        res.status(httpStatus.OK).json(updatedGoal).end();
      } else if (goal.date_end < time_now && !goal.recurring) {
        // If the date is surpassed and it isn't a recurring goal, remove the goal and return no content
        const deleteGoalResult = await goalService.deleteGoal(goalId);
        const deleteUserGoalResult = await userService.deleteUserGoal(goalId);
        // Notify frontend that the operation was successful
        if (deleteGoalResult && deleteUserGoalResult) {
          res.sendStatus(httpStatus.NO_CONTENT).end();
        } else {
          res.sendStatus(httpStatus.CONFLICT).end();
        }
      }
      const userEncounterIds = userCurrent?.encounters ?? [];
      const userEncounters = await encounterService.getAllEncounters({}, userEncounterIds);
      let progress_count = 0;
      userEncounters.forEach((encounter) => {
        if (encounter.date >= goal.date_start && encounter.date <= goal.date_end) {
          progress_count++;
        }
        return progress_count;
      });
      let goalProgressDTO = JSON.parse(JSON.stringify(goal));
      goalProgressDTO.progress = progress_count;
      res.status(httpStatus.OK).json(goalProgressDTO).end();
    } else {
      res.sendStatus(httpStatus.NOT_FOUND).end();
    }
  } catch (e) {
    next(e);
  }
};

export const createGoal = async (
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

    if (updateUser !== undefined) {
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

    // check user exists with the firebase auth_id, and the user specified goal actually exists
    const userByAuthId = await getUserByAuthId(firebaseAuthId);
    if (!userByAuthId || !isGoalExistsInUser(userByAuthId, goalIdToUpdate)) {
      return res.status(httpStatus.NOT_FOUND).end();
    }

    // update goal
    const goal = await goalService.getGoal(goalIdToUpdate);
    let newGoalData = JSON.parse(JSON.stringify(goal));
    const reqGoal = getGoalFromReqBody(req.body);

    // Updates goal with request body parameters
    newGoalData.encounter_goal = reqGoal.encounter_goal;
    newGoalData.duration = reqGoal.duration;
    newGoalData.recurring = reqGoal.recurring;

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
      // Delete goal from Goal collection
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
