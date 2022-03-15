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

const updatePersonWithId = async (reqPersonId: string, personNewDetails: PersonModel) => {
  const query = { _id: reqPersonId };
  return Person.findOneAndUpdate(query, personNewDetails, { upsert: true });
};

const getPersonWithId = async (reqPersonId: string) => {
  const query = { _id: reqPersonId };
  return Person.findOne(query);
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
  const foundUserPersons = await Person.find({ _id: { $in: userPersons } });

  // Filter them by query params (only works with single string fields)
  return foundUserPersons.filter((person) => {
    for (const queryKey in queryParams) {
      if (stringFields.includes(queryKey)) {
        // Get queryValue and personValue as lowercase strings
        const queryValue: string = queryParams[queryKey].toLowerCase();
        const personValue: string = person[queryKey].toLowerCase();

        if (!personValue.includes(queryValue)) {
          return false;
        }
      }
    }
    return true;
  });
};

const deletePersons = async (personID: string) => {
  await Person.deleteOne({_id: personID});
}

const addEncounterToPersons = async (personIds, encounterId) => {
  for (let i = 0; i < personIds.length; i + 1) {
    const result = await Person
      .updateOne({ _id: personIds[i] }, { $push: { encounters: encounterId } });

    // Revert all updates if any update fails
    if (result.modifiedCount !== 1) {
      for (let j = i - 1; j >= 0; j - 1) {
        await Person.updateOne({ _id: personIds[i] }, { $pop: { encounters: 1 } });
      }
      return false;
    }
  }

  return true;
};

const personService = {
  createPerson,
  getPersonWithId,
  getPeople,
  deletePersons,
  addEncounterToPersons,
  updatePersonWithId,
};

export default personService;
