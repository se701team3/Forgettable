import Encounter, {EncounterModel} from '../models/encounter.model';

const createEncounter = async (encounterDetails: EncounterModel) => {
    const encounter = new Encounter(encounterDetails);
    await encounter.save();
    return encounter;
};

const updateEncounter = async (objectID: string, encounterDetails: EncounterModel)=>{
    console.log(objectID)
    const updatedEncounter = await Encounter.findByIdAndUpdate(objectID, encounterDetails, {new: true});
    return updatedEncounter;
}

const deleteEncounters = async (encounterID: string) => {
    await Encounter.deleteOne({_id: encounterID});
}

const encounterService = {
    createEncounter,
    updateEncounter,
    deleteEncounters,
  }

export default encounterService;