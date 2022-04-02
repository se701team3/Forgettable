/**
 * Service contains database operations
 */
import mongoose from 'mongoose';
import Person, { PersonModel } from '../models/person.model';
import logger from '../utils/logger';

const queryKeys = ['first_name', 'last_name', 'gender', 'location', 'how_we_met', 'organisation'];

const createPerson = async (personDetails: PersonModel) => {
  const person = new Person(personDetails);
  await person.save();
  return person;
};

const updatePersonWithId = async (reqPersonId: string, personNewDetails: PersonModel) => {
  const query = { _id: reqPersonId };

  const updatedPerson = await Person.findOneAndUpdate(query, personNewDetails, { upsert: true });

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

    // If no relevant fields in a Person match 'termValue', remove them from the array
    foundUserPersons = foundUserPersons.filter((person) => {
      if (queryParams.field) {
        if (person[queryParams.field].toLowerCase().includes(termValue)) {
          return true;
        }
      } else {
        for (let i = 0; i < queryKeys.length; i++) {
          // Make sure person has a value for current queryKey
          if (person[queryKeys[i]]) {
            const personValue = (person[queryKeys[i]] as string).toLowerCase();
            if (personValue.includes(termValue)) {
              return true;
            }
          }
        }
      } 
      return false;
    });
  }

  return foundUserPersons;
};

const deletePersonEncounters = async (encounterID: string) => {
  const result = await Person.updateMany({ }, { $pullAll: { encounters: [{ _id: encounterID }] } });

  // Check that Persons with the respective encounters has been updated
  if (result.modifiedCount > 0) {
    return true;
  }
  return false;
};

const deletePersonCompanies = async (companyID: string) => {
  const result = await Person.updateMany({ }, { $pullAll: { companies: [{ _id: companyID }] } });

  // Check that Persons with the respective companies has been updated
  if (result.modifiedCount > 0) {
    return true;
  }
  return false;
};

const deletePersons = async (personID: string) => {
  const result = await Person.deleteOne({ _id: personID });

  if (result.deletedCount == 1) {
    return true;
  }
  return false;
};

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

const getPersonWithBirthdayRange = async (userPersons: mongoose.Types.ObjectId[], startDate: Date, endDate: Date) => {
  function getDayOfYear(date:Date) {
    let start:Date = new Date(date.getFullYear(), 0, 0);
    let diff = (date.valueOf() - start.valueOf()) + ((start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000);
    let oneDay = 1000 * 60 * 60 * 24;
    let day = Math.floor(diff / oneDay);
    return day;
  }

  let foundUserPersons = {};
  const startDay = getDayOfYear(startDate);
  const endDay = getDayOfYear(endDate);

  if (startDay < endDay) {
    foundUserPersons = await Person.aggregate([
      { $project: { name: 1, dayOfYear: { $dayOfYear: '$birthday' } } },
      { $match: { _id: { $in: userPersons } } },
      { $match: { dayOfYear: { $gte: startDay } } },
      { $match: { dayOfYear: { $lt: endDay } } },
    ]);
  } else {
    foundUserPersons = await Person.aggregate([
      { $project: { name: 1, dayOfYear: { $dayOfYear: '$birthday' } } },
      { $match: { _id: { $in: userPersons } } },
      {
        $match: {
          $or:
        [
          { dayOfYear: { $gte: startDay } },
          { dayOfYear: { $lt: endDay } },
        ],
        },
      },
    ]);
  }
  const peopleWithUpcomingBday = await Person.find({ _id: { $in: foundUserPersons } });
  return peopleWithUpcomingBday;
};

const addCompanyToPersons = async (personIds, companyId) => {
  for (let i = 0; i < personIds.length; i++) {
    const result = await Person
      .updateOne({ _id: personIds[i] }, { $push: { companies: companyId } });

    // Revert all updates if any update fails
    if (result.modifiedCount !== 1) {
      for (let j = i - 1; j >= 0; j--) {
        await Person.updateOne({ _id: personIds[i] }, { $pop: { companies: 1 } });
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
  getPersonWithBirthdayRange,
  deletePersonCompanies,
  addCompanyToPersons,
};

export default personService;
function $expr($expr: any, arg1: { $eq: (number | { $month: string; })[]; }) {
  throw new Error('Function not implemented.');
}

function from(from: any, arg1: { $regex: RegExp; }) {
  throw new Error('Function not implemented.');
}
