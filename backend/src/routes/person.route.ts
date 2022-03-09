/**
 * Route configures endpoints, and attaches controller as an action to each route's REST methods
 */
import { Router } from 'express';
import { createPerson, getRandomJson } from '../controllers/person.controller';

const routes = Router();

routes.get('/', getRandomJson);
routes.post('/', createPerson);

export default routes;
