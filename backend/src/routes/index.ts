import { Router } from 'express';
import person from './person.route';
import encounter from './encounter.route';
import user from './user.route';
import goal from './goal.route';

const routes = Router();

routes.use('/persons', person);
routes.use('/encounters', encounter);
routes.use('/users', user);
routes.use('/goal', goal);

export default routes;
