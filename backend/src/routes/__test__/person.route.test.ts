import httpStatus from 'http-status';
import databaseOperations from '../../utils/test/db-handler';

import Person, { PersonModel } from '../../models/person.model';
import User, { UserModel } from '../../models/user.model';
import Encounter, { EncounterModel } from '../../models/encounter.model';
import personService from '../../services/person.service';
import app from '../../server';
import "dotenv/config";
import testUtils from '../../utils/test/test-utils';

const supertest = require('supertest');

let token;

beforeAll(async () => {
  token = await testUtils.generateTestAuthToken();
  databaseOperations.connectDatabase();
});
afterEach(async () => databaseOperations.clearDatabase());
afterAll(async () => databaseOperations.closeDatabase());

const user1Data : UserModel = {
  auth_id: null as any,
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

const person4Data = {
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

const person5Data = {
  first_name: 'Billy',
  last_name: 'John',
  interests: ['surfing', 'cooking'],
  organisation: 'an organisation',
  how_we_met: 'At the park',
  birthday: new Date('2001-07-16'),
  encounters: [] as any,
  first_met: null as any,
  gender: "male",
  image: null as any,
  location: null as any,
  social_media: null as any
}

const encounter1Data: EncounterModel = {
  title: "Encounter1",
  date: new Date('2022-02-23'),
  time_updated: new Date(Date.now()),
  description: 'Met at a cafe',
  location: 'Auckland',
  persons: [] as any
}

const encounter2Data: EncounterModel = {
  title: "Encounter2",
  date: new Date('2022-02-24'),
  time_updated: new Date(Date.now()),
  description: 'Had lunch together',
  location: 'Auckland',
  persons: [] as any
}

describe('POST persons/', () => {
  it ('Can be created and stored in the user when all information is provided', async () => {
    // Create a new user
    await supertest(app).post('/api/users')
      .set('Accept', 'application/json')
      .set('Authorization', token)
      .send(user1Data);

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

  it ('Can be created if "time_updated" is not provided', async() => {
    // Create a new user
    await supertest(app).post('/api/users')
      .set('Accept', 'application/json')
      .set('Authorization', token)
      .send(user1Data);

    // Create a new person and store it in the user
    const { body: createdPerson } = await supertest(app).post('/api/persons')
      .set('Accept', 'application/json')
      .send(person5Data)
      .set("Authorization", token)
      .expect(httpStatus.CREATED);

    // Ensure user contains reference to the new person
    const { body: user } = await supertest(app).get("/api/users")
      .set("Accept", "application/json")
      .set("Authorization", token)
      .expect(httpStatus.OK);

    expect(user.persons).toEqual([createdPerson._id]);
  });

  it ('Cannot be created if a first name is not provided', async ()=> {
    // Create a new user
    await supertest(app).post('/api/users')
      .set('Accept', 'application/json')
      .set('Authorization', token)
      .send(user1Data);

    // Create a new person without a first name and try to store it in the user
    await supertest(app).post('/api/persons')
      .set('Accept', 'application/json')
      .send(person4Data)
      .set("Authorization", token)
      .expect(httpStatus.BAD_REQUEST);
  });

  it ('Returns "Unauthorized" if the user does not have a valid auth_id', async () => {
    await supertest(app).get(`/api/persons/FAKE_PERSON_ID`)
      .set('Accept','application/json')
      .set("Authorization", "FAKE_AUTH_TOKEN")
      .expect(httpStatus.UNAUTHORIZED);
  });
});

describe('PUT persons/', () => {
  it ('Can be updated correctly', async () => {
    // Create a new user
    await supertest(app).post('/api/users')
      .set('Accept', 'application/json')
      .set('Authorization', token)
      .send(user1Data);

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

describe('GET persons/', () => {
  it ('Only returns people associated with a user', async () => {
    const person1ID = (await new Person(person1Data).save()).id;
    const person2ID = (await new Person(person2Data).save()).id;
    const person3ID = (await new Person(person3Data).save()).id;

    user1Data.persons = [person1ID, person2ID];
    user1Data.auth_id = await testUtils.getAuthIdFromToken(token);
    const user = await new User(user1Data).save();

    const { body: retrievedPersons } = await supertest(app)
      .get('/api/persons')
      .set('Accept', 'application/json')
      .set('Authorization', token)
      .expect(httpStatus.OK)

    expect(retrievedPersons).toHaveLength(2);
    expect(retrievedPersons[0]._id).toEqual(person1ID);
    expect(retrievedPersons[1]._id).toEqual(person2ID);
  });

  it ('Correctly filters persons by the "term" query param', async () => {
    person1Data.first_name = "Bing"
    const person1ID = (await new Person(person1Data).save()).id;
    person2Data.first_name = "Billy"
    const person2ID = (await new Person(person2Data).save()).id;
    person3Data.first_name = "John"
    const person3ID = (await new Person(person3Data).save()).id;

    user1Data.persons = [person1ID, person2ID, person3ID];
    user1Data.auth_id = await testUtils.getAuthIdFromToken(token);
    await new User(user1Data).save();

    const { body: retrievedPersons } = await supertest(app)
      .get('/api/persons')
      .set('Accept', 'application/json')
      .set('Authorization', token)
      .query({ term: 'bi' })
      .expect(httpStatus.OK)

    expect(retrievedPersons).toHaveLength(2);
    expect(retrievedPersons[0].first_name).toBe("Bing");
    expect(retrievedPersons[1].first_name).toBe("Billy");
  });

  it ('Returns all persons if the "term" query param is empty', async () => {
    const person1ID = (await new Person(person1Data).save()).id;
    const person2ID = (await new Person(person2Data).save()).id;
    const person3ID = (await new Person(person3Data).save()).id;

    user1Data.persons = [person1ID, person2ID, person3ID];
    user1Data.auth_id = await testUtils.getAuthIdFromToken(token);
    await new User(user1Data).save();

    const { body: retrievedPersons } = await supertest(app)
      .get('/api/persons')
      .set('Accept', 'application/json')
      .set('Authorization', token)
      .query({ term: "" })
      .expect(httpStatus.OK)

    expect(retrievedPersons).toHaveLength(3);
  });

  it ('Does not return duplicates if all persons match the "term" query', async () => {
    person1Data.first_name = "A test name";
    const person1ID = (await new Person(person1Data).save()).id;
    const person2ID = (await new Person(person1Data).save()).id;
    const person3ID = (await new Person(person1Data).save()).id;
    const person4ID = (await new Person(person1Data).save()).id;
    const person5ID = (await new Person(person1Data).save()).id;

    user1Data.persons = [person1ID, person2ID, person3ID, person4ID, person5ID];
    user1Data.auth_id = await testUtils.getAuthIdFromToken(token);
    await new User(user1Data).save();

    const { body: retrievedPersons } = await supertest(app)
      .get('/api/persons')
      .set('Accept', 'application/json')
      .set('Authorization', token)
      .query({ term: "A test name" })
      .expect(httpStatus.OK)

    // Loop through each person id in user1, and check if each person is only found once in retrievedPersons
    user1Data.persons.forEach(personID => {
      expect(retrievedPersons.filter(person => person._id === personID)).toHaveLength(1);
    })
  });

  it ('Returns "OK" with an empty array if the user has no persons', async () => {
    await new Person(person1Data);
    await new Person(person2Data).save();
    await new Person(person3Data).save();

    user1Data.persons = [];
    user1Data.auth_id = await testUtils.getAuthIdFromToken(token);
    await new User(user1Data).save();

    const { body: retrievedPersons } = await supertest(app)
      .get('/api/persons')
      .set('Accept', 'application/json')
      .set('Authorization', token)
      .expect(httpStatus.OK)

    expect(retrievedPersons).toHaveLength(0);
  });

  it ('Returns "OK" with an empty array if no persons match the "term" query param', async () => {
    const person1ID = (await new Person(person1Data).save()).id;
    const person2ID = (await new Person(person2Data).save()).id;
    const person3ID = (await new Person(person3Data).save()).id;

    user1Data.persons = [person1ID, person2ID, person3ID];
    user1Data.auth_id = await testUtils.getAuthIdFromToken(token);
    await new User(user1Data).save();

    const { body: retrievedPersons } = await supertest(app)
      .get('/api/persons')
      .set('Accept', 'application/json')
      .set('Authorization', token)
      .query({ term: "a query that no persons will match" })
      .expect(httpStatus.OK)

    expect(retrievedPersons).toHaveLength(0);
  });

  it ('Returns "Unauthorized" if the user does not have a valid auth_id', async () => {
    await supertest(app).get(`/api/persons/FAKE_PERSON_ID`)
      .set('Accept','application/json')
      .set("Authorization", "FAKE_AUTH_TOKEN")
      .expect(httpStatus.UNAUTHORIZED);
  });
});

describe('GET persons/:id', () => {
  it ('Can be retrieved by id', async () => {
    // Create a new user
    await supertest(app).post('/api/users')
      .set('Accept', 'application/json')
      .set('Authorization', token)
      .send(user1Data);

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
      .send(user1Data);

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

  it ('Contains embedded encounters', async () => {
    await supertest(app).post('/api/users')
      .set('Accept', 'application/json')
      .set('Authorization', token)
      .send(user1Data);

  // Create a new person and store it in the user
    const { body: createdPerson } = await supertest(app).post('/api/persons')
      .set('Accept', 'application/json')
      .send(person1Data)
      .set("Authorization", token)
      .expect(httpStatus.CREATED);

      const { body: createdPerson2 } = await supertest(app).post('/api/persons')
      .set('Accept', 'application/json')
      .send(person2Data)
      .set("Authorization", token)
      .expect(httpStatus.CREATED);  

    encounter1Data.persons = [createdPerson._id, createdPerson2._id];

    await supertest(app).post('/api/encounters')
      .set('Accept', 'application/json')
      .send(encounter1Data)
      .set("Authorization", token)
      .expect(httpStatus.CREATED);

    const { body: retrievedPerson } =  await supertest(app).get(`/api/persons/${createdPerson._id}`)
      .set('Accept','application/json')
      .set("Authorization", token)
      .expect(httpStatus.OK);

    expect(retrievedPerson.encounters[0].title).toEqual(encounter1Data.title)
  })
});

// Delete Person 200

describe('DELETE /person/:id', () => {

  it('Successfully deletes single person with no encounter: ', async () => {
      // Get Authentication ID for User
      const auth_id = await testUtils.getAuthIdFromToken(token);

      // Create Person
      const personOne = new Person(person1Data);
      const personOneId = (await personOne.save())._id;

      // Create User
      const user = new User(user1Data);
      // Add Encounter and Person ID to User encounters
      user.persons.push(personOneId);
      user.auth_id = auth_id;
      await user.save();

      await supertest(app).delete(`/api/persons/${personOneId}`)
          .set('Accept', 'application/json')
          .set('Authorization', token)
          .expect(httpStatus.OK);

      const newUser = await User.findOne({auth_id: user.auth_id});
      expect(newUser?.persons).not.toContain(personOneId);
  })

  it('Successfully deletes single person with single encounter: ', async () => {
      // Get Authentication ID for User
      const auth_id = await testUtils.getAuthIdFromToken(token);

      // Create Encounter
      const encounterOne = new Encounter(encounter1Data);
      const encounterOneId = (await encounterOne.save())._id;

      // Create Person
      const personOne = new Person(person1Data);
      const personOneId = (await personOne.save())._id;

      // Create User
      const user = new User(user1Data);
      // Add Encounter and Person ID to User encounters
      user.encounters.push(encounterOneId);
      user.persons.push(personOneId);
      user.auth_id = auth_id;
      await user.save();

      // Add Encounter and Person IDs to respective objects
      personOne.encounters.push(encounterOneId);
      encounterOne.persons.push(personOneId);
      await personOne.save();
      await encounterOne.save();

      await supertest(app).delete(`/api/persons/${personOneId}`)
          .set('Accept', 'application/json')
          .set('Authorization', token)
          .expect(httpStatus.OK);

      const newUser = await User.findOne({auth_id: user.auth_id});
      expect(newUser?.persons).not.toContain(personOneId);
  })

  it('Successfully deletes multiple persons with multiple encounters', async () => {
      // Get Authentication ID for User
      const auth_id = await testUtils.getAuthIdFromToken(token);

      // Create Encounter One
      const encounterOne = new Encounter(encounter1Data);
      const encounterOneId = (await encounterOne.save())._id;

      // Create Encounter Two
      const encounterTwo = new Encounter(encounter2Data);
      const encounterTwoId = (await encounterTwo.save())._id;

      // Create Person One
      const personOne = new Person(person1Data);
      const personOneId = (await personOne.save())._id;

      // Create Person Two
      const personTwo = new Person(person2Data);
      const personTwoId = (await personTwo.save())._id;

      // Create User
      const user = new User(user1Data);
      // Add Encounter and Person ID to User encounters
      user.encounters.push(encounterOneId);
      user.encounters.push(encounterTwoId);
      user.persons.push(personOneId);
      user.persons.push(personTwoId);
      user.auth_id = auth_id;
      await user.save();

      // Add Encounter and Person IDs to respective objects
      personOne.encounters.push(encounterOneId);
      personOne.encounters.push(encounterTwoId);
      encounterOne.persons.push(personOneId);
      encounterOne.persons.push(personTwoId);

      personTwo.encounters.push(encounterOneId);
      personTwo.encounters.push(encounterTwoId);
      encounterTwo.persons.push(personOneId);
      encounterTwo.persons.push(personTwoId);

      await personOne.save();
      await personTwo.save();
      await encounterOne.save();
      await encounterTwo.save();

      await supertest(app).delete(`/api/persons/${personOneId}`)
          .set('Accept', 'application/json')
          .set('Authorization', token)
          .expect(httpStatus.OK);

      await supertest(app).delete(`/api/persons/${personTwoId}`)
          .set('Accept', 'application/json')
          .set('Authorization', token)
          .expect(httpStatus.OK);

      // Check Encounters and Persons are removed
      const newUser = await User.findOne({auth_id: user.auth_id});
      expect(newUser?.persons).not.toContain(personOneId);
      expect(newUser?.persons).not.toContain(personTwoId);

      expect(newUser?.encounters).not.toContain(encounterOneId);
      expect(newUser?.encounters).not.toContain(encounterTwoId);
      
      expect(await Person.findById({_id: personOneId})).toEqual(null);
      expect(await Person.findById({_id: personTwoId})).toEqual(null);
  })

// Delete Person 404

  it('Sends NOT_FOUND for invalid ID: ', async () => {
      // Get Authentication ID for User
      const auth_id = await testUtils.getAuthIdFromToken(token);

      // Create Person
      const personOne = new Person(person1Data);
      const invalidPersonId = (await personOne.save())._id;

      // Create User
      const user = new User(user1Data);
      // Add Encounter and Person ID to User encounters
      user.auth_id = auth_id;
      await user.save();

      await supertest(app).delete(`/api/persons/${invalidPersonId}`)
          .set('Accept', 'application/json')
          .set('Authorization', token)
          .expect(httpStatus.NOT_FOUND);

      // Check that no encounters are deleted from User
      const newUser = await User.findOne({auth_id: user.auth_id});
      expect(newUser?.persons).toHaveLength(user.persons.length);
  })

// Delete Person 400
  it('Sends BAD_REQUEST if Person ID is not in Collection: ', async () => {
      // Get Authentication ID for User
      const auth_id = await testUtils.getAuthIdFromToken(token);

      // Create Person
      const encounterOne = new Encounter(encounter1Data);
      const invalidPersonId = (await encounterOne.save())._id;

      // Create User
      const user = new User(user1Data);
      // Add invalid Person ID to User
      user.auth_id = auth_id;
      user.persons.push(invalidPersonId)
      await user.save();

      await supertest(app).delete(`/api/persons/${invalidPersonId}`)
          .set('Accept', 'application/json')
          .set('Authorization', token)
          .expect(httpStatus.BAD_REQUEST);

      // Check that invalid ID is deleted from User
      const newUser = await User.findOne({auth_id: user.auth_id});
      expect(newUser?.persons).not.toContain(invalidPersonId);
  })
})

