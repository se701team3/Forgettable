/**
 * Controller contains high-level operations using services, consumed by routes
 */
 import { NextFunction, Request, Response } from 'express';

 import UserModel from '../models/user.model';
 import userService from '../services/user.service';
 import logger from '../utils/logger';
 
 export const createUser = async (
   req: Request,
   res: Response,
   next: NextFunction,
 ): Promise<void> => {
   logger.info("POST /encounter/create request from frontend");
 
   try {
     // Grab the data from the req
     const userReq = getUserFromReqBody(req.body);
 
     // Pass data to service and attempt to save
     const createdUser = await userService.createUser(userReq);
 
     // Notify frontend that the operation was successful
     res.sendStatus(200);
   } catch (e) {
     next(e);
   }
 };
 
 // Util function that won't be needed regularly
const getUserFromReqBody = (body: any) => {
    const user = {
        auth_id: body.auth_id,
        first_name: body.first_name,
        last_name: body.last_name,
        persons: body.persons,
        encounters: body.encounters
    }

   return user;
 }