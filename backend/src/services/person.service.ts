/**
 * Service contains database operations
 */
import Person, {PersonModel} from "../models/person.model";

export const createPerson = async (personDetails: PersonModel): Promise<string> => {
    await new Person(personDetails).save();
    return "whatever string we wanna return"
}
