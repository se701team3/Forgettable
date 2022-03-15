/**
 * Service contains database operations
 */
import mongoose from 'mongoose';
import Person, { PersonModel } from '../models/person.model';
import logger from '../utils/logger';

const queryKeys = ['first_name', 'last_name', 'location', 'how_we_met', 'organisation'];

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

const getPeople = async (queryParams: any, userPersons: mongoose.Types.ObjectId[]) => {
  // Get all persons from the db that belong to the user
  let foundUserPersons = await Person.find({ _id: { $in: userPersons } });

  // Filter the found persons by query params
  if (queryParams.term) {
    logger.info('Query params received:');
    logger.info(queryParams);
    const termValue = queryParams.term.toLowerCase();

    // If no relevant fields in a Person match 'termValue', remove them from the array
    foundUserPersons = foundUserPersons.filter((person) => {
      for (let i = 0; i < queryKeys.length; i++) {
        const personValue = (person[queryKeys[i]] as string).toLowerCase();
        if (personValue.includes(termValue)) {
          return true;
        }
      }
      return false;
    })
  }

  return foundUserPersons;
};

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
  addEncounterToPersons,
  updatePersonWithId,
};

export default personService;
