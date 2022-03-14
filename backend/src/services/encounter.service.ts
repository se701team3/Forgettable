import Encounter, {EncounterModel} from '../models/encounter.model';

const createEncounter = async (encounterDetails: EncounterModel) => {
    const encounter = new Encounter(encounterDetails);

    await encounter.save();

    if (encounter.persons.length === 0) {
        await Encounter.deleteOne({ _id: encounter._id }).exec();
        const e = new Error('Persons can\'t be empty');
        e.name = "ValidationError";
        throw e;
    }

    return encounter;
};

const updateEncounter = async (objectID: string, encounterDetails: EncounterModel)=>{
    console.log(objectID)
    const updatedEncounter = await Encounter.findByIdAndUpdate(objectID, encounterDetails, {new: true});
    return updatedEncounter;
}

const deleteEncounter = async (encounterID: String) => {
    await Encounter.deleteOne({ _id: encounterID }).exec();
}

const encounterService = {
    createEncounter,
    updateEncounter,
    deleteEncounter
  }

export default encounterService;