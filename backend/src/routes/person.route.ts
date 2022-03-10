/**
 * Route configures endpoints, and attaches controller as an action to each route's REST methods
 */
import { Router } from 'express';
import { createPerson, getAllPeople } from '../controllers/person.controller';

const routes = Router();

routes.post('/create', createPerson);
routes.get('/', getAllPeople);

export default routes;
