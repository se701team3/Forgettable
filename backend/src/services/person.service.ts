/**
 * Service contains database operations
 */
import mongoose from 'mongoose';
import Person, { PersonModel } from '../models/person.model';
import logger from '../utils/logger';

const algoliaSearch = require('algoliasearch');

const client = algoliaSearch(
  process.env.ALGOLIA_APP_ID,
  process.env.ALGOLIA_SECRET_KEY,
);
const index = client.initIndex('persons');

const createPerson = async (personDetails: PersonModel) => {
  const person = new Person(personDetails);
  await person.save();
  return person;
};

const updatePersonWithId = async (reqPersonId: string, personNewDetails: PersonModel) => {
  const query = { _id: reqPersonId };
  
  const updatedPerson = await Person.findOneAndUpdate(query, personNewDetails, { upsert: true });

  const updatedPersonAlgolia : any = await Person.findById(reqPersonId);
  updatedPersonAlgolia.objectID = reqPersonId;
  await index.partialUpdateObject(updatedPersonAlgolia);

  return updatedPerson;
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

    const algoliaSearchResults = await index.search(termValue);
    const algoliaSearchResultsIds = algoliaSearchResults.hits.map((hit) => hit.objectID.toString())
  
    const userPersonResults = foundUserPersons.filter(
      (person) => algoliaSearchResultsIds.includes(person._id.toString()),
    );

    foundUserPersons = userPersonResults;
  }

  return foundUserPersons;
};

const deletePersonEncounters = async (encounterID: string) => {
  const result = await Person.updateMany({ }, { $pullAll: {encounters: [{ _id: encounterID}]} });

  // Check that Persons with the respective encounters has been updated
  if (result.modifiedCount > 0) {
    return true;
  } else {
    return false;
  }
}

const deletePersons = async (personID: string) => {
  const result = await Person.deleteOne({_id: personID});

  if (result.deletedCount == 1) {
    await index.deleteObject(personID);
    return true;
  } else {
    return false;
  }
}

const addEncounterToPersons = async (personIds, encounterId) => {
  for (let i = 0; i < personIds.length; i++) {
    const result = await Person
      .updateOne({ _id: personIds[i] }, { $push: { encounters: encounterId } });

    // Revert all updates if any update fails
    if (result.modifiedCount !== 1) {
      for (let j = i - 1; j >= 0; j--) {
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
  deletePersonEncounters,
  deletePersons,
  addEncounterToPersons,
  updatePersonWithId,
};

export default personService;
