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
  await Encounter.deleteMany({persons: {$exists: true, $size: 0}});
  
  // return encounters that may have empty persons fields
  return empty_encounters;
}

const deleteEncounter = async (encounterID: String) => {
  const result = await Encounter.deleteOne({ _id: encounterID }).exec();
  
  // Check that Encounter has been deleted
  if (result.deletedCount == 1) {
    return true;
  } else {
    return false;
  }

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
