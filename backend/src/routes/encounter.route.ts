/**
 * Route configures endpoints, and attaches controller as an action to each route's REST methods
 */
import { Router } from 'express';
import {
  createEncounter,
  getAllEncounters,
  updateEncounter,
  getEncounter,
  deleteEncounters,
  pruneEncounters,
} from '../controllers/encounter.controller';

const routes = Router();

routes.get('/', getAllEncounters);
routes.post('/', createEncounter);
routes.put('/:id', updateEncounter);
routes.get('/:id', getEncounter);
routes.delete('/:id', deleteEncounters);
routes.delete('/prune/:pruneDate', pruneEncounters);

export default routes;
