/**
 * Route configures endpoints, and attaches controller as an action to each route's REST methods
 */
import { Router } from 'express';
import {
  createPerson, getAllPeople, getPersonWithId, updatePersonWithId, deletePersons, getPersonsByCompany, getPersonsByLabel,
} from '../controllers/person.controller';

const routes = Router();

routes.post('/', createPerson)
  .get('/label', getPersonsByLabel)
  .get('/:id', getPersonWithId)
  .get('/', getAllPeople)
  .get('/companies/:id', getPersonsByCompany)
  .put('/:id', updatePersonWithId)
  .delete('/:id', deletePersons);

export default routes;
