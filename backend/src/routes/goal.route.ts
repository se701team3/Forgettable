/**
 * Route configures endpoints, and attaches controller as an action to each route's REST methods
 */
import { Router } from 'express';
import {
    getGoals, createGoals, updateGoals, deleteGoals,
} from '../controllers/goal.controller';

const routes = Router();

routes.get('/:id', getGoals)
    .post('/:id', createGoals)
    .put('/:id', updateGoals)
    .delete('/:id', deleteGoals);

export default routes;