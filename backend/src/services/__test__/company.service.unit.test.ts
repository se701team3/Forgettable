import databaseOperations from '../../utils/test/db-handler';

import companyService from '../company.service';
import Company, { CompanyModel } from '../../models/company.model';
import Person, {PersonModel} from '../../models/person.model';
import {Importance} from "../../enums/importance";

beforeAll(async () => {databaseOperations.connectDatabase()});
afterEach(async () => databaseOperations.clearDatabase());
afterAll(async () => databaseOperations.closeDatabase());

