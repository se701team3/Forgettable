/**
 * Route configures endpoints, and attaches controller as an action to each route's REST methods
 */
 import { Router } from 'express';
 import {createEncounter, deleteEncounters, updateEncounter} from '../controllers/encounter.controller';
 
 const routes = Router();
 
 routes.post('/', createEncounter);
 routes.put('/:id', updateEncounter);
 routes.delete(':/id', deleteEncounters)
 
 export default routes;
 