/**
 * Route configures endpoints, and attaches controller as an action to each route's REST methods
 */
import { Router } from 'express';
import {
  getGoal, createGoal, updateGoal, deleteGoal,
} from '../controllers/goal.controller';

const routes = Router();

routes.get('/:id', getGoal)
  .post('/', createGoal)
  .put('/:id', updateGoal)
  .delete('/:id', deleteGoal);

export default routes;
