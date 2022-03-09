/**
 * Service contains database operations
 */
 import Person, { PersonModel } from '../models/person.model';

 export const createPerson = async (personDetails: PersonModel) => {
   const person = new Person(personDetails);
   await person.save();
   return person;
 };
 
 const personService = {
   createPerson
 }
 
 export default personService;