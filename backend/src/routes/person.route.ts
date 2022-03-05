import {createPerson, getRandomJson} from "../controllers/person.controller";
import {Router} from 'express'

const routes = Router();

routes.get('/', getRandomJson)
routes.post('/', createPerson)

export default routes