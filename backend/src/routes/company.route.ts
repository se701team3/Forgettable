/**
 * Route configures endpoints, and attaches controller as an action to each route's REST methods
 */
import { Router } from 'express';
import {
  createCompany,
  getAllCompanies,
  updateCompany,
  getCompany,
  deleteCompanies,
} from '../controllers/company.controller';

const routes = Router();

routes.get('/', getAllCompanies);
routes.post('/', createCompany);
routes.put('/:id', updateCompany);
routes.get('/:id', getCompany);
routes.delete('/:id', deleteCompanies);

export default routes;