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

export const getEncounter = async (id) => {
  return await getData('encounters/' + id);
};

export const getAllEncounters = async () => {
  return await getData('encounters');
};

export const createEnncounter = async (encounter) => {
  return await postData('encounters', encounter);
};

export const updateEncounter = async (id, encounter) => {
  return await putData('encounters/' + id, encounter);
};

export const deleteEncounter = async (id) => {
  return await deleteData('encounters/' + id);
};
