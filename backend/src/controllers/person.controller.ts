/**
 * Controller contains high-level operations using services, consumed by routes
 */
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import personService from '../services/person.service';
import logger from '../utils/logger';

import { POST } from './controller.types';

export const createPerson: POST = async (req: Request, res: Response): Promise<void> => {
  logger.info("POST /persons/create request from frontend");

  try {
    const person = await personService.createPerson(req.body);
    res.status(httpStatus.CREATED).send(person);
  } catch (e) {
    logger.error(e);
    res.status(httpStatus.BAD_REQUEST);
  }
};
