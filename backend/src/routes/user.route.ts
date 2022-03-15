/**
 * Route configures endpoints, and attaches controller as an action to each route's REST methods
 */
import { Router } from 'express';
import { createUser, getUser } from '../controllers/user.controller';

const routes = Router();

routes.post('/', createUser);
routes.get('/', getUser);

export default routes;
