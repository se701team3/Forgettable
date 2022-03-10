/**
 * Route configures endpoints, and attaches controller as an action to each route's REST methods
 */
 import { Router } from 'express';
 import { createUser } from '../controllers/user.controller';
 
 const routes = Router();
 
 routes.post('/', createUser);
 
 export default routes;
 