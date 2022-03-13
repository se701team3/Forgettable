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

const deleteEncounterPerson = async (personID: string) => {
  // Service is used for deletePersons endpoint

  await Encounter.updateMany({ }, { $pullAll: {persons: [{ _id: personID}]} });
  const empty_encounters = await Encounter.find({persons : {$exists:true, $size:0}});
  await Encounter.deleteMany({persons: {$exists: true, $size: 0}});

  // return encounters that may have empty persons fields
  return empty_encounters;
}

const encounterService = {
    createEncounter,
    updateEncounter,
    deleteEncounterPerson
  }

export default encounterService;