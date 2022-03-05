import person from './person.route'
import {Router} from 'express'

const routes = Router();

routes.use('/api/person', person);

export default routes