/**
 * Route configures endpoints, and attaches controller as an action to each route's REST methods
 */
import { Router } from 'express';
import { getPeopleWithUpcomingBirthday } from '../controllers/person.controller';

const routes = Router();

routes.get('/', getPeopleWithUpcomingBirthday);

export default routes;
