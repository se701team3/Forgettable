import Encounter, {EncounterModel} from '../models/encounter.model';

export const createEncounter = async (encounterDetails: EncounterModel) => {
    const encounter = new Encounter(encounterDetails);
    await encounter.save();
    return encounter;
};

const encounterService = {
    createEncounter
  }

export default encounterService;