/**
 * Controller contains high-level operations using services, consumed by routes
 */
 import { NextFunction, Request, Response } from 'express';

 import EncounterModel from '../models/encounter.model';
 import encounterService from '../services/encounter.service';
 import logger from '../utils/logger';
 
 export const createEncounter = async (
   req: Request,
   res: Response,
   next: NextFunction,
 ): Promise<void> => {
   logger.info("POST /encounter/create request from frontend");
 
   try {
     // Grab the data from the req
     const encounterReq = getEncounterFromReqBody(req.body);
 
     // Pass data to service and attempt to save
     const createdEncounter = await encounterService.createEncounter(encounterReq);
 
     // Notify frontend that the operation was successful
     res.sendStatus(200);
   } catch (e) {
     next(e);
   }
 };
 
 // Util function that won't be needed regularly
const getEncounterFromReqBody = (body: any) => {
    const encounter = {
        date: body.date,
        location: body.location,
        description: body.description,
        persons: body.persons
    }

   return encounter;
 }