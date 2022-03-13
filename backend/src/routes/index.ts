import { Router } from 'express';
import person from './person.route';
import encounter from './encounter.route';
import user from './user.route';

const routes = Router();

routes.use('/persons', person);
routes.use('/encounters', encounter);
routes.use('/users', user);

export default routes;
