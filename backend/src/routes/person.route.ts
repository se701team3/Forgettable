/**
 * Route configures endpoints, and attaches controller as an action to each route's REST methods
 */
import { Router } from 'express';
import {
  createPerson, getAllPeople, getPersonWithId, updatePersonWithId,
} from '../controllers/person.controller';

const routes = Router();

routes.post('/', createPerson)
  .get('/:id', getPersonWithId)
  .get('/', getAllPeople)
  .put('/:id', updatePersonWithId);

export default routes;
