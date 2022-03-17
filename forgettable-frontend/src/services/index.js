import {getData, postData, putData, deleteData} from './functions/helpers';

/**
 * Fetches data of a single Person, given the Person's id
 * @param {string} id id of the person to retrieve
 * @return {Promise} data of the person with the id
 */
export const getPerson = async (id) => {
  return await getData('persons/' + id);
};

/**
 * Fetches data of all Persons
 * @return {Promise} data of all persons
 */
export const getAllPersons = async () => {
  return await getData('persons');
};

/**
 * Fetches data of the user given their id
 * @return {Promise} data of the user using the system
 */
export const getUser = async () => {
  return await getData('users');
};

/**
 * Creates a User in the database given the User's data
 * @param {Object} user data of the user to create.
 * Must include a first_name property.
 * @return {Promise} data entry of the new Person created
 */
export const createUser = async (user) => {
  return await postData('users', user);
};

/**
 * Creates a Person in the database given the Person's data
 * @param {Object} person data of the person to create.
 * Must include a first_name property.
 * @return {Promise} data entry of the new Person created
 */
export const createPerson = async (person) => {
  return await postData('persons', person);
};

/**
 * Updates a Person in the database given the Person's new data.
 * New data will overwrite all old data.
 * @param {string} id id of the Person to update
 * @param {Object} person data of the Person to update.
 * @return {Promise} data entry of the updated Person
 */
export const updatePerson = async (id, person) => {
  return await putData('persons/' + id, person);
};

/**
 * Deletes a Person from the database given the Person's id
 * @param {string} id id of the Person to delete
 * @return {Promise}
 */
export const deletePerson = async (id) => {
  return await deleteData('persons/' + id);
};

/**
 * Fetches the data of a single Encounter, given the Encounter's id
 * @param {string} id id of the Encounter to fetch
 * @return {Promise} data of the Encounter with the id
 */
export const getEncounter = async (id) => {
  return await getData('encounters/' + id);
};

/**
 * Fetches all Encounters that the user has been part of
 * @return {Promise} data of all Encounters of the user
 */
export const getAllEncounters = async () => {
  return await getData('encounters');
};

/**
 * Creates a new Encounter in the database given the Encounter's data
 * @param {Object} encounter data of the Encounter to create.
 * @return {Promise} data entry of the new Encounter created
 */
export const createEncounter = async (encounter) => {
  return await postData('encounters', encounter);
};

/**
 * Updates an Encounter in the database given the Encounter's new data.
 * New data will overwrite all old data.
 * @param {string} id id of the Encounter to update
 * @param {Object} encounter data to update the Encounter with.
 * @return {Promise} data entry of the updated Encounter
 */
export const updateEncounter = async (id, encounter) => {
  return await putData('encounters/' + id, encounter);
};

/**
 * Deletes an Encounter from the database given the Encounter's id
 * @param {string} id id of the Encounter to delete
 * @return {Promise}
 */
export const deleteEncounter = async (id) => {
  return await deleteData('encounters/' + id);
};
