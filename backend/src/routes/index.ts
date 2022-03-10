import { Router } from 'express';
import person from './person.route';

const routes = Router();

routes.use('/persons', person);

export default routes;
