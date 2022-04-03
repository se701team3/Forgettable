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
 * Fetches data of a single Company, given the Company's id
 * @param {string} id id of the Company to retrieve
 * @return {Promise} data of the company with the id
 */
export const getCompany = async (id) => {
  return await getData('companies/' + id);
};

/**
 * Fetches data of all Persons
 * @return {Promise} data of all persons
 */
export const getAllPersons = async (page, limit) => {
  if (!page || !limit) return await getData('persons');
  return await getData(`persons?page=${page}&limit=${limit}`);
};

/**
 * Fetches data of all Companies
 * @return {Promise} data of all companies
 */
export const getAllCompanies = async (page, limit) => {
  if (!page || !limit) return await getData('companies');
  return await getData(`companies?page=${page}&limit=${limit}`);
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
 * Creates a Company in the database given the Company's data
 * @param {Object} company data of the Company to create.
 * Must include a name property.
 * @return {Promise} data entry of the new Company created
 */
export const createCompany = async (company) => {
  return await postData('companies', company);
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
 * Updates a Company in the database given the Company's new data.
 * New data will overwrite all old data.
 * @param {string} id id of the Company to update
 * @param {Object} company data of the Company to update.
 * @return {Promise} data entry of the updated Company
 */
export const updateCompany = async (id, company) => {
  return await putData('companies/' + id, company);
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
 * Deletes a Company from the database given the Company's id
 * @param {string} id id of the Company to delete
 * @return {Promise}
 */
export const deleteCompany = async (id) => {
  return await deleteData('companies/' + id);
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
 * Deletes all Encounters for the logged in user where the
 * time_updated field precedes pruneDate
 * @param {*} pruneDate Prune all encounters last modified before this date
 * @return {Promise}
 */
export const pruneEncounters = async (pruneDate) => {
  return await deleteData('encounters/prune/' + pruneDate);
};

/**
 * Fetches Encounters entries with pagination
 * @param {string} page starting page (starting index = 1)
 * @param {string} limit how many entries on one page
 * @return {Promise} data of all Encounters of the user
 */
export const getEncountersByPage = async (page, limit) => {
  if (!page || !limit) return await getAllEncounters();
  return await getData(`encounters/?page=${page}&limit=${limit}`);
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

/**
 * Searches Encounters from the database given a search string
 * @param {string} searchString string to search
 * @param {string} field the field that is going to be search
 * @return {Promise}
 */
export const searchEncounter = async (searchString, field) => {
  return await getData('encounters/?term=' + searchString + '&field=' + field);
};

/**
 * Searches Persons from the database given a search string
 * @param {string} searchString string to search
 * @param {string} field the field that is going to be search
 * @return {Promise}
 */
export const searchPersons = async (searchString, field) => {
  return await getData('persons/?term=' + searchString + '&field=' + field);
};

/**
 * Searches persons with upcoming birthdays on your list
 * @return {Promise}
 */
export const getPeopleWithUpcomingBirthday = async () => {
  return await getData('birthdays');
};

/**
 * Searches Company from the database given a search string
 * @param {string} searchString string to search
 * @return {Promise}
 */
export const searchCompany = async (string) => {
  return await getData('companies/?term=' + string);
};
/**
 * Searches Goal for from database given ID
 * @param {string} goalId id of the Goal to search
 * @return {Promise}
 */
export const getGoal = async (goalId) => {
  return await getData('goal/'+ goalId);
};

/**
 * Creates a new Goal to the database
 * @param {Object} goal goal data too create goal with
 * @return {Promise}
 */
export const createGoal = async (goal) => {
  return await postData('goal', goal);
};

/**
 * Updates a goal in the database given the goal's new data.
 * @param {string} goalId id of the goal to update
 * @param {Object} goal data to update goal
 * @return {Promise}
 */
export const updateGoal = async (goalId, goal) => {
  return await putData('goal/' + goalId, goal);
};

/**
 * Deletes a goal from the database
 * @param {string} goalId id of the goal to update
 * @return {Promise}
 */
export const deleteGoal = async (goalId) => {
  return await deleteData('goal/' + goalId);
};
