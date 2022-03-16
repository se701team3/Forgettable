import httpStatus from 'http-status';
import databaseOperations from '../../utils/test/db-handler';

import { PersonModel } from '../../models/person.model';
import app from '../../server';
import testUtils from '../../utils/test/test-utils';
import "dotenv/config";

const supertest = require('supertest');

let token;

beforeAll(async () => {
  token = await testUtils.generateTestAuthToken();
  databaseOperations.connectDatabase();
});
afterEach(async () => databaseOperations.clearDatabase());
afterAll(async () => databaseOperations.closeDatabase());

const reqUserData = {
  first_name: 'Bing',
  last_name: 'Bong',
  encounters: [] as any,
  persons: [] as any,
}

const person1Data:PersonModel = {
  first_name: 'testFirstName',
  last_name: 'testLastName',
  interests: ['a', 'b'],
  organisation: 'testorg',
  time_updated: new Date('2022-01-01'),
  how_we_met: 'testmet',
  birthday: new Date('2002-12-12'),
  encounters: [] as any,
  first_met: new Date('2022-01-01'),
  gender: "other",
  image: null as any,
  location: 'Someplace',
  social_media: null as any
};

describe('Creating a person', () => {
  it('Can be created and stored in the user', async () => {
    // Create a new user
    await supertest(app).post('/api/users')
      .set('Accept', 'application/json')
      .set('Authorization', token)
      .send(reqUserData);

    // Create a new person and store it in the user
    const { body: createdPerson } = await supertest(app).post('/api/persons')
      .set('Accept', 'application/json')
      .send(person1Data)
      .set("Authorization", token)
      .expect(httpStatus.CREATED);

    // Ensure user contains reference to the new person
    const { body: user } = await supertest(app).get("/api/users")
      .set("Accept", "application/json")
      .set("Authorization", token)
      .expect(httpStatus.OK);

    expect(user.persons).toEqual([createdPerson._id]);
  });

  it ('Can be updated correctly', async () => {
    // Create a new user
    await supertest(app).post('/api/users')
      .set('Accept', 'application/json')
      .set('Authorization', token)
      .send(reqUserData);

    // Create a new person and store it in the user
    const { body : newPerson } = await supertest(app).post('/api/persons')
      .set('Accept', 'application/json')
      .send(person1Data)
      .set("Authorization", token)
      .expect(httpStatus.CREATED);

    // Change the person's data
    const changedLocation = 'Someplace else';
    person1Data.location = changedLocation;

    // Update the person and check it was successful
    await supertest(app).put(`/api/persons/${newPerson._id}`)
      .set('Accept', 'application/json')
      .send(person1Data)
      .set("Authorization", token)
      .expect(httpStatus.NO_CONTENT);
    
    // Retrieve person from database, and check that the updated person contains the changed location
    const { body: updatedPerson } = await supertest(app).get(`/api/persons/${newPerson._id}`)
      .set('Accept','application/json')
      .set("Authorization", token)
      .expect(httpStatus.OK);

    expect(updatedPerson.location).toEqual(changedLocation);
  });
});
