/* eslint-disable no-underscore-dangle */
import mongoose from 'mongoose';
import Encounter, { EncounterModel } from '../models/encounter.model';

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

const getEncounter = async (encounterId) => Encounter.findOne({_id: encounterId});

const getAllEncounters = async (userEncounters: mongoose.Types.ObjectId[]) => {
  // Get all encounters from the db which belongs to the user
  const foundUserEncounters = await Encounter.find({ _id: { $in: userEncounters } });

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
  await Encounter.updateMany({ }, { $pullAll: {persons: [{ _id: personID}]} });
  // Store references to the encounters that no longer contain persons so they can be removed from Users later
  const empty_encounters = await Encounter.find({persons : {$exists:true, $size:0}});
  // Delete all the empty encounters
  const deleted_encounters = await Encounter.deleteMany({persons: {$exists: true, $size: 0}});

  // Check that all deleted encounters are returned and Encounters have been updated 
  if (empty_encounters.length == deleted_encounters.deletedCount) {
    return {"array": empty_encounters, "bool": true};
  } else {
    return {"array": empty_encounters, "bool": false};
  }
}

const deleteEncounter = async (encounterID: String) => {
  await Encounter.deleteOne({ _id: encounterID }).exec();
};

const encounterService = {
  createEncounter,
  updateEncounter,
  getEncounter,
  getAllEncounters,
  deleteEncounter,
  deleteEncounterPerson,
};

export default encounterService;
