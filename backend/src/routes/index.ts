import { Router } from 'express';
import person from './person.route';

const routes = Router();

routes.use('/api/person', person);

export default routes;
