/**
 * Controller contains high-level operations using services, consumed by routes
 */
 import { NextFunction, Request, Response } from 'express';

 import EncounterModel from '../models/encounter.model';
 import encounterService from '../services/encounter.service';
 import logger from '../utils/logger';
import * as http from "http";
import httpStatus from "http-status";
 
 export const createEncounter = async (
   req: Request,
   res: Response,
   next: NextFunction,
 ): Promise<void> => {
   logger.info("POST /encounter request from frontend");
 
   try {
     // Grab the data from the req
     const encounterReq = getEncounterFromReqBody(req.body);

     // Pass data to service and attempt to save
     const createdEncounter = await encounterService.createEncounter(encounterReq);
     // Notify frontend that the operation was successful
     res.status(httpStatus.CREATED).json(createdEncounter).end();
   } catch (e) {
     next(e);
   }
 };
export const updateEncounter = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    logger.info("PUT /encounter/:id request from frontend");

    try {
        // Grab the data from the req
        const encounterReq = getEncounterFromReqBody(req.body);

        // Pass data to service and attempt to save
        const updatedEncounter = await encounterService.updateEncounter(req.params.id, encounterReq);
        if(!updatedEncounter){
            return res.sendStatus(httpStatus.NOT_FOUND).end();
        }

        // Notify frontend that the operation was successful
        return res.sendStatus(httpStatus.NO_CONTENT).end();
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