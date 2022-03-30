import { Router } from 'express';
import person from './person.route';
import encounter from './encounter.route';
import user from './user.route';
import goal from './goal.route';
import birthday from './birthday.route';
import company from './company.route';

const routes = Router();

routes.use('/persons', person);
routes.use('/encounters', encounter);
routes.use('/users', user);
routes.use('/goal', goal);
routes.use('/birthdays', birthday);
routes.use('/companies', company);

export default routes;
