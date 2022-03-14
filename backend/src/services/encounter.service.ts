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

const encounterService = {
    createEncounter,
    updateEncounter,
    deleteEncounterPerson
  }

export default encounterService;