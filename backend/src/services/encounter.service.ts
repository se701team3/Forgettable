import Encounter, { EncounterModel } from '../models/encounter.model';

export const createEncounter = async (encounterDetails: EncounterModel) => {
  const encounter = new Encounter(encounterDetails);
  await encounter.save();
  return encounter;
};

const getEncounter = async (encounterId) => Encounter.findOne({_id: encounterId});

const encounterService = {
  createEncounter,
  getEncounter
}

export default encounterService;