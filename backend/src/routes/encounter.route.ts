/**
 * Route configures endpoints, and attaches controller as an action to each route's REST methods
 */
import { Router } from 'express';
import { createEncounter } from '../controllers/encounter.controller';
import { getEncounter } from '../controllers/encounter.controller';

const routes = Router();

routes.post('/', createEncounter)
      .get('/:id', getEncounter);

export default routes;
