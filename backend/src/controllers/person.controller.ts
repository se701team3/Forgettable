/**
 * Controller contains high-level operations using services, consumed by routes
 */
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import personService from '../services/person.service';
import logger from '../utils/logger';

export const createPerson = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  logger.info("POST /persons/create request from frontend");

  try {
    const person = await personService.createPerson(req.body);
    res.status(httpStatus.CREATED).send(person);
  } catch (e) {
    next(e);
  }
};
