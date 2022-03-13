/**
 * Service contains database operations
 */
import Person, { PersonModel } from '../models/person.model';

const createPerson = async (personDetails: PersonModel) => {
  const person = new Person(personDetails);
  await person.save();
  return person;
};

const getPersonWithId = async (reqPersonID: string) => {
  return await Person.findOne({_id: reqPersonID});
}

/**
 * Note that .clone is necessary to avoid error 'Query was already executed'
 * Refer to section 'Duplicate Query Execution under https://mongoosejs.com/docs/migrating_to_6.html
 */
const getPeople = async () => Person.find(() => true).clone();
const personService = {
  createPerson,
  getPersonWithId,
  getPeople
};

export default personService;
