/* eslint-disable no-underscore-dangle */
import mongoose from 'mongoose';
import Encounter, { EncounterModel } from '../models/encounter.model';
import logger from '../utils/logger';

const queryKeys = ['title', 'location', 'description'];

const createEncounter = async (encounterDetails: EncounterModel) => {
  const encounter = new Encounter(encounterDetails);

  await encounter.save();

  if (encounter.persons.length === 0) {
    await Encounter.deleteOne({ _id: encounter._id }).exec();
    const e = new Error('Persons can\'t be empty');
    e.name = 'ValidationError';
    throw e;
  }

  return encounter;
};

const getEncounter = async (encounterId) => Encounter.findOne({ _id: encounterId });

const getAllEncounters = async (queryParams: any, userEncounters: mongoose.Types.ObjectId[]) => {
  // Get all encounters from the db which belongs to the user
  let foundUserEncounters = await Encounter.find({ _id: { $in: userEncounters } });

  // Filter the found encounters by query params
  if (queryParams.term) {
    logger.info('Query params received:');
    logger.info(queryParams);
    const termValue = queryParams.term.toLowerCase();

    // If no relevant fields in an Encounter match 'termValue', remove them from the array
    foundUserEncounters = foundUserEncounters.filter((encounter) => {
      if (queryParams.field) {
        if (encounter[queryParams.field].toLowerCase().includes(termValue)) {
          return true;
        }
      } else {
        for (let i = 0; i < queryKeys.length; i++) {
          // Make sure person has a value for current queryKey
          if (encounter[queryKeys[i]]) {
            const encounterValue = (encounter[queryKeys[i]] as string).toLowerCase();
            if (encounterValue.includes(termValue)) {
              return true;
            }
          }
        }
      }
      return false;
    });
  }

  return foundUserEncounters;
};

const updateEncounter = async (objectID: string, encounterDetails: EncounterModel) => {
  console.log(objectID);
  const updatedEncounter = await Encounter
    .findByIdAndUpdate(objectID, encounterDetails, { new: true });

  return updatedEncounter;
};

// Service is used for deletePersons endpoint
const deleteEncounterPerson = async (personID: string) => {
  // Remove the person with the supplied ID from all existing encounters
  const result = await Encounter.updateMany({ }, { $pullAll: { persons: [{ _id: personID }] } });
  // Store references to the encounters that no longer contain persons so they can be removed from Users later
  const empty_encounters = await Encounter.find({ persons: { $exists: true, $size: 0 } });
  // Delete all the empty encounters
  const deleted_encounters = await Encounter.deleteMany({ persons: { $exists: true, $size: 0 } });

  // Check that all deleted encounters are returned and Encounters have been updated
  if (empty_encounters.length == deleted_encounters.deletedCount) {
    return { array: empty_encounters, bool: true };
  }
  return { array: empty_encounters, bool: false };
};

const deleteEncounter = async (encounterID: String) => {
  const result = await Encounter.deleteOne({ _id: encounterID }).exec();

  // Check that Encounter has been deleted
  if (result.deletedCount == 1) {
    return true;
  }
  return false;
};

/**
 * Service used for pruning encounters
 * Users can specify a date where they want all encounters that haven't been modified before that date to be deleted
 * @param userEncounters List of encounters belonging to the signed in user
 * @param pruneDateString Prune date in string form, e.g. 2021-10-30T00:51:11.707Z
 * @returns List of encounters after pruning
 */
const pruneEncounters = async (userEncounters: mongoose.Types.ObjectId[], pruneDateString: string) => {
  let foundUserEncounters = await Encounter.find({ _id: { $in: userEncounters } });
  let pruneDate = new Date(pruneDateString);

  foundUserEncounters = foundUserEncounters.filter(async (encounter) => {
    let currentEncounter = await getEncounter(encounter);
    if (currentEncounter?.time_updated) {
      let encounterDate = new Date(currentEncounter.time_updated);
      // Delete all encounters whose last time_updated precedes pruneDate
      if (encounterDate.getTime() <= pruneDate.getTime()) {
        deleteEncounter(currentEncounter._id.toString());
      }
    }
  });
  return foundUserEncounters;
};

const encounterService = {
  createEncounter,
  updateEncounter,
  getEncounter,
  getAllEncounters,
  deleteEncounter,
  deleteEncounterPerson,
  pruneEncounters,
};

export default encounterService;
