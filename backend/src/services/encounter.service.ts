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

const deleteEncounter = async (encounterID: String) => {
  await Encounter.deleteOne({ _id: encounterID }).exec();
};

const encounterService = {
  createEncounter,
  updateEncounter,
  getEncounter,
  getAllEncounters,
  deleteEncounter,
};

export default encounterService;
