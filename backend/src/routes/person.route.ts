/**
 * Route configures endpoints, and attaches controller as an action to each route's REST methods
 */
import { Router } from 'express';
import { createPerson } from '../controllers/person.controller';

const routes = Router();

routes.post('/create', createPerson);

export default routes;
