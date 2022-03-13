/**
 * Service contains database operations
 */
import mongoose from 'mongoose';
import Person, { PersonModel } from '../models/person.model';
import logger from '../utils/logger';

const stringFields = ['full_name', 'gender', 'location', 'how_we_met', 'organisation'];

const createPerson = async (personDetails: PersonModel) => {
  const person = new Person(personDetails);
  await person.save();
  return person;
};

/**
 * Note that .clone is necessary to avoid error 'Query was already executed'
 * Refer to section 'Duplicate Query Execution under https://mongoosejs.com/docs/migrating_to_6.html
 */
const getPeople = async (queryParams: any, userPersons: mongoose.Types.ObjectId[]) => {
  // Log query params if received
  if (Object.keys(queryParams).length > 0) {
    logger.info('Query params received:');
    logger.info(queryParams);
  }

  // Get all persons from the db that belong to the user
  let foundUserPersons = await Person.find({ _id: { $in: userPersons } });

  // Filter them by query params (only works with single string fields)
  let filteredPersons = foundUserPersons.filter(function (person) {
    for (let queryKey in queryParams) {
      if (stringFields.includes(queryKey)) {
        // Get queryValue and personValue as lowercase strings
        let queryValue: string = queryParams[queryKey].toLowerCase();
        let personValue: string = person[queryKey].toLowerCase()

        if (!personValue.includes(queryValue)) {
          return false;
        }
      }
    }
    return true;
  });

  return filteredPersons;
};

const personService = {
  createPerson,
  getPeople,
};

export default personService;
