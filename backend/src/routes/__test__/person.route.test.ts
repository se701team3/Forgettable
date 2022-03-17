import httpStatus from 'http-status';
import databaseOperations from '../../utils/test/db-handler';

import { PersonModel } from '../../models/person.model';
import app from '../../server';
import testUtils from '../../utils/test/test-utils';
import "dotenv/config";
import personService from '../../services/person.service';
import userService from '../../services/user.service';

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

const person1Data: PersonModel = {
  first_name: 'Ping',
  last_name: 'Pong',
  interests: ['video games', 'hockey'],
  organisation: 'helloc',
  time_updated: new Date('2022-01-01'),
  how_we_met: 'Hockey club',
  birthday: new Date('2002-12-12'),
  encounters: [] as any,
  first_met: new Date('2022-01-01'),
  gender: "male",
  location: "Auckland",
  image: null as any,
  social_media: null as any
};

const person2Data: PersonModel = {
  first_name: 'Adam',
  last_name: 'Bong',
  interests: ['badminton', 'golf'],
  organisation: 'helloc',
  time_updated: new Date('2022-02-23'),
  how_we_met: 'Skype',
  birthday: new Date('2001-07-16'),
  encounters: [] as any,
  first_met: null as any,
  gender: "male",
  image: null as any,
  location: null as any,
  social_media: null as any
}

const person3Data: PersonModel = {
  first_name: 'Billy',
  last_name: 'John',
  interests: ['surfing', 'cooking'],
  organisation: 'an organisation',
  time_updated: new Date('2022-02-23'),
  how_we_met: 'At the park',
  birthday: new Date('2001-07-16'),
  encounters: [] as any,
  first_met: null as any,
  gender: "male",
  image: null as any,
  location: null as any,
  social_media: null as any
}

describe('POST persons/', () => {
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

describe('GET persons/:id', () => {
  it ('Can be retrieved by id', async () => {
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

    // Attempt to retrieve it
    const { body: retrievedPerson } = await supertest(app).get(`/api/persons/${createdPerson._id}`)
      .set('Accept','application/json')
      .set("Authorization", token)
      .expect(httpStatus.OK);

    expect(retrievedPerson._id).toEqual(createdPerson._id);
  });

  it ('Is not retrieved if the user does not contain it', async () => {
    // Create a new user
    const { body: user } = await supertest(app).post('/api/users')
      .set('Accept', 'application/json')
      .set('Authorization', token)
      .send(reqUserData);

    // Create three persons and store only the first two in the user
    const { body : person1 } = await supertest(app).post('/api/persons')
      .set('Accept', 'application/json')
      .send(person1Data)
      .set("Authorization", token)
      .expect(httpStatus.CREATED);

    const { body : person2 } = await supertest(app).post('/api/persons')
      .set('Accept', 'application/json')
      .send(person2Data)
      .set("Authorization", token)
      .expect(httpStatus.CREATED);  

    const person3 = await personService.createPerson(person3Data);

    // Ensure only person1 and person2 can be retrieved
    await supertest(app).get(`/api/persons/${person1._id}`)
      .set('Accept','application/json')
      .set("Authorization", token)
      .expect(httpStatus.OK);

    await supertest(app).get(`/api/persons/${person2._id}`)
      .set('Accept','application/json')
      .set("Authorization", token)
      .expect(httpStatus.OK);

    await supertest(app).get(`/api/persons/${person3._id}`)
      .set('Accept','application/json')
      .set("Authorization", token)
      .expect(httpStatus.NOT_FOUND);
  });

  it ('Returns "Unauthorized" if the user does not have a valid auth_id', async () => {
      await supertest(app).get(`/api/persons/FAKE_PERSON_ID`)
        .set('Accept','application/json')
        .set("Authorization", "FAKE_AUTH_TOKEN")
        .expect(httpStatus.UNAUTHORIZED);
  });
});
