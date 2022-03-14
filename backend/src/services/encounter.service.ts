import Encounter, {EncounterModel} from '../models/encounter.model';

const createEncounter = async (encounterDetails: EncounterModel) => {
    const encounter = new Encounter(encounterDetails);

    if (encounter.persons.length === 0) {
        const e = new Error('Persons can\'t be empty');
        e.name = "ValidationError";
        throw e;
    }

    await encounter.save();
    return encounter;
};

const updateEncounter = async (objectID: string, encounterDetails: EncounterModel)=>{
    console.log(objectID)
    const updatedEncounter = await Encounter.findByIdAndUpdate(objectID, encounterDetails, {new: true});
    return updatedEncounter;
}

const deleteEncounter = async (encounterID: String) => {
    await Encounter.findByIdAndDelete(encounterID);
}

const encounterService = {
    createEncounter,
    updateEncounter,
    deleteEncounter
  }

export default encounterService;