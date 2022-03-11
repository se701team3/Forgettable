/**
 * Service contains database operations
 */
import Person, { PersonModel } from '../models/person.model';
import logger from '../utils/logger';

const createPerson = async (personDetails: PersonModel) => {
  const person = new Person(personDetails);
  await person.save();
  return person;
};

/**
 * Note that .clone is necessary to avoid error 'Query was already executed'
 * Refer to section 'Duplicate Query Execution under https://mongoosejs.com/docs/migrating_to_6.html
 */
const getPeople = async (queryParams: any) => {
  if (Object.keys(queryParams).length === 0) {
    return await Person.find(() => true).clone();
  } else {
    logger.info('Query params received:');
    logger.info(queryParams);

    return await Person.find({...queryParams}, () => true).clone();
  }
};

const personService = {
  createPerson,
  getPeople,
};

export default personService;
