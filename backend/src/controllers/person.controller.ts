/**
 * Controller contains high-level operations using services, consumed by routes
 */
import { NextFunction, Request, Response } from 'express';
import { createPerson as createPersonService } from '../services/person.service';

export const getRandomJson = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    res.json({ someString: 'hello world' });
  } catch (e) {
    next(e);
  }
};

export const createPerson = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { name, organisation } = req.body;
  try {
    await createPersonService({ name, organisation });
    res.status(200).end();
  } catch (e) {
    next(e);
  }
};
