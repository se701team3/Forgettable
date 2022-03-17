import databaseOperations from '../../utils/test/db-handler';
import User from '../../models/user.model';
import Person, { PersonModel } from '../../models/person.model';
import Encounter, { EncounterModel } from '../../models/encounter.model';
import app from '../../server';
import httpStatus from "http-status";
import testUtils from '../../utils/test/test-utils';
import 'dotenv/config';

const supertest = require('supertest');

let token;

beforeAll(async () => {

    token = await testUtils.generateTestAuthToken();

    await databaseOperations.connectDatabase();
});
afterEach(async () => databaseOperations.clearDatabase());
afterAll(async () => databaseOperations.closeDatabase());

const user1Data = {
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

const encounter3Data = {
    title: "Encounter3",
    date: new Date('2022-05-25'),
    time_updated: new Date(Date.now()),
    location: 'Auckland',
    persons: [] as any
}

const encounter4Data = {
    title: "Encounter4",
    description: 'Play badminton together',
    time_updated: new Date(Date.now()),
    location: 'Auckland',
    persons: [] as any
}

const encounter5Data = {
    title: "Encounter5",
    date: new Date('2022-05-25'),
    description: 'Played badminton together',
    time_updated: new Date(Date.now()),
    persons: [] as any
}

const encounter6Data = {
    title: "Encounter6",
    date: new Date('2022-02-23'),
    time_updated: new Date(Date.now()),
    description: 'Met at a cafe',
    location: 'Auckland'
}

const encounter7Data = {
    date: new Date('2019-08-17'),
    description: 'Shopping',
    time_updated: new Date(Date.now()),
    location: 'Auckland',
    persons: [] as any
}

const encounterData: EncounterModel = {
    title: "EncounterData",
    date: new Date("2022-12-02"),
    time_updated: new Date(Date.now()),
    location: "here",
    description: "we did this and that",
    persons: [] as any,
}

describe('POST /encounter', () => {
    it('Successfully creates an encounter with all info given', async () => {
        await supertest(app).post('/api/users')
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .send(user1Data);

        const { body: person } = await supertest(app).post('/api/persons')
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .send(person1Data)

        encounter1Data.persons.push(person._id);

        await supertest(app).post('/api/encounters')
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .send(encounter1Data)
            .expect(httpStatus.CREATED);

        //Re-initializes variables so that other tests are not affected
        encounter1Data.persons = [];
    })


    it('Successfully creating an encounter without date field', async () => {
        await supertest(app).post('/api/users')
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .send(user1Data);

        const { body: person } = await supertest(app).post('/api/persons')
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .send(person1Data)

        encounter4Data.persons.push(person._id);

        const { body: newEncounter } = await supertest(app).post('/api/encounters')
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .send(encounter4Data)
            .expect(httpStatus.CREATED);

        expect(newEncounter.date).not.toEqual('');

        encounter4Data.persons = [];
    })

    it('Successfuly creating an encounter without a location field', async () => {
        await supertest(app).post('/api/users')
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .send(user1Data);

        const { body: person } = await supertest(app).post('/api/persons')
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .send(person1Data)

        encounter5Data.persons.push(person._id);

        const { body: newEncounter } = await supertest(app).post('/api/encounters')
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .send(encounter5Data)
            .expect(httpStatus.CREATED);

        expect(newEncounter.location).toEqual(undefined);

        encounter5Data.persons = [];
    })

    it('Successful encounter creation return correct encounter data', async () => {
        await supertest(app).post('/api/users')
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .send(user1Data);

        const { body: person } = await supertest(app).post('/api/persons')
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .send(person1Data)
            .expect(httpStatus.CREATED);

        encounter1Data.persons.push(person._id);

        const { body: storedEncounter } = await supertest(app).post('/api/encounters')
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .send(encounter1Data);

        expect(storedEncounter.title).toEqual(encounter1Data.title);
        expect(storedEncounter.description).toEqual(encounter1Data.description);
        expect(new Date(storedEncounter.date)).toEqual(encounter1Data.date);
        expect(storedEncounter.location).toEqual(encounter1Data.location);
        encounter1Data.persons.map((person) => {
            expect(storedEncounter.persons).toContain(person);
        })

        encounter1Data.persons = [];
    })

    it('Failed to create an encounter without a persons field', async () => {
        await supertest(app).post('/api/users')
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .send(user1Data);

        await supertest(app).post('/api/persons')
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .send(person1Data);

        await supertest(app).post('/api/encounters')
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .send(encounter6Data)
            .expect(httpStatus.BAD_REQUEST);

    })

    it('Failed to create an encounter with empty persons field', async () => {
        await supertest(app).post('/api/users')
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .send(user1Data);

        const { body: person } = await supertest(app).post('/api/persons')
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .send(person1Data)

        await supertest(app).post('/api/encounters')
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .send(encounter1Data)
            .expect(httpStatus.BAD_REQUEST);
    })

    it('Failed to create an encounter without a description', async () => {
        await supertest(app).post('/api/users')
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .send(user1Data);

        const { body: person } = await supertest(app).post('/api/persons')
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .send(person1Data)

        encounter3Data.persons.push(person._id);

        await supertest(app).post('/api/encounters')
            .set('Authorization', token)
            .set('Accept', 'application/json')
            .send(encounter3Data)
            .expect(httpStatus.BAD_REQUEST);

        encounter3Data.persons = [];
    })

    it('Failed to create an encounter without a title', async () => {
        await supertest(app).post('/api/users')
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .send(user1Data);

        const { body: person } = await supertest(app).post('/api/persons')
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .send(person1Data);

        encounter7Data.persons.push(person._id);

        await supertest(app).post('/api/encounters')
            .set('Authorization', token)
            .set('Accept', 'application/json')
            .send(encounter7Data)
            .expect(httpStatus.BAD_REQUEST);

        encounter7Data.persons = [];
    })

    it('Failed to create without an auth token', async () => {
        await supertest(app).post('/api/users')
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .send(user1Data);

        const { body: person } = await supertest(app).post('/api/persons')
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .send(person1Data);

        encounter1Data.persons.push(person._id);

        await supertest(app).post('/api/encounters')
            .set('Accept', 'application/json')
            .send(encounter1Data)
            .expect(httpStatus.UNAUTHORIZED);

        encounter1Data.persons = [];
    })

    it('Encounter not stored in database when request is unsuccessful', async () => {
        await supertest(app).post('/api/users')
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .send(user1Data);

        const { body: person } = await supertest(app).post('/api/persons')
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .send(person1Data)

        encounter3Data.persons.push(person._id);

        const { body: encounter } = await supertest(app).post('/api/encounters')
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .send(encounter3Data);

        await supertest(app).get(`/api/encounters/${encounter._id}`)
            .set('Authorization', token)
            .expect(httpStatus.NOT_FOUND)

        const { body: storedPerson } = await supertest(app).get(`/api/persons/${person._id}`)
            .set('Authorization', token)
            .expect(httpStatus.OK);
        expect(storedPerson.encounters).not.toContain(encounter._id);

        const { body: storedUser } = await supertest(app).get('/api/users')
            .set('Authorization', token)
            .expect(httpStatus.OK);
        expect(storedUser).not.toContain(encounter._id);

        encounter3Data.persons = [];
    })
})


describe('PUT /encounters/:id ', () => {
    it('Successfully updates an encounter with a given json', async () => {
        const newEncounterId = await createUserPersonEncounter(token);

        // update an encounter with 'encounter4Data'
        await supertest(app)
            .put(`/api/encounters/${newEncounterId}`)
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .send(encounter4Data)
            .expect(httpStatus.NO_CONTENT) // since it's no content, need to get this encounter to check updated fields

        // retrieve the updated encounter and compare
        const updatedEncounter = await supertest(app)
            .get(`/api/encounters/${newEncounterId}`)
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .send(encounter4Data)
            .expect(httpStatus.OK)

        expect(updatedEncounter._body.description).toBe(encounter4Data.description)
        expect(updatedEncounter._body.location).toEqual(encounter4Data.location)
    });

    it('Fails when called with invalid encounter object ID', async () => {
        await createUserPersonEncounter(token)
        // update an encounter of id that does not exist
        await supertest(app)
            .put(`/api/encounters/${123}`)
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .send(encounterData)
            .expect(httpStatus.NOT_FOUND)
    });

    it('Fails when encounter object ID that does not exist', async () => {
        // update an encounter of id that does not exist
        await supertest(app)
            .put(`/api/encounters/622b36166bb3a4e3a1ef62f1`)
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .send(encounterData)
            .expect(httpStatus.NOT_FOUND)
    });
    it('Fails when user does not exist for given token', async ()=>{
        await supertest(app)
            .put(`/api/encounters/1234567890`)
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .expect(httpStatus.NOT_FOUND)
    })
    it('Fails when user is not authenticated', async ()=>{
        await supertest(app)
            .put(`/api/encounters/1234567890`)
            .set('Accept', 'application/json')
            .expect(httpStatus.UNAUTHORIZED)
    })
});

describe('GET encounters/', () => {
    it ('Only return encounters associated with the user', async () => {
      const encounter1ID = (await new Encounter(encounter1Data).save()).id;
      const encounter2ID = (await new Encounter(encounter2Data).save()).id;
      await new Encounter(encounter4Data).save();
  
      user1Data.encounters = [encounter1ID, encounter2ID];
      user1Data.auth_id = await testUtils.getAuthIdFromToken(token);
      await new User(user1Data).save();
  
      const { body: retrievedEncounters } = await supertest(app)
        .get('/api/encounters')
        .set('Accept', 'application/json')
        .set('Authorization', token)
        .expect(httpStatus.OK)
  
      expect(retrievedEncounters).toHaveLength(2);
      expect(retrievedEncounters[0]._id).toEqual(encounter1ID);
      expect(retrievedEncounters[1]._id).toEqual(encounter2ID);
    });

    it ('Return all encounters if the "term" query param is empty', async () => {
        const encounter1ID = (await new Encounter(encounter1Data).save()).id;
        const encounter2ID = (await new Encounter(encounter2Data).save()).id;
        const encounter4ID = (await new Encounter(encounter4Data).save()).id;
    
        user1Data.encounters = [encounter1ID, encounter2ID, encounter4ID];
        user1Data.auth_id = await testUtils.getAuthIdFromToken(token);
        await new User(user1Data).save();
    
        const { body: retrievedEncounters } = await supertest(app)
          .get('/api/encounters')
          .set('Accept', 'application/json')
          .set('Authorization', token)
          .query({ term: "" })
          .expect(httpStatus.OK)
    
        expect(retrievedEncounters).toHaveLength(3);
    });

    it ('Return "200 OK" with an empty array if the user has no encounters', async () => {
        await new Encounter(encounter1Data).save();
        await new Encounter(encounter2Data).save();
        await new Encounter(encounter4Data).save();
    
        user1Data.encounters = [];
        user1Data.auth_id = await testUtils.getAuthIdFromToken(token);
        await new User(user1Data).save();
    
        const { body: retrievedEncounters } = await supertest(app)
          .get('/api/encounters')
          .set('Accept', 'application/json')
          .set('Authorization', token)
          .expect(httpStatus.OK)
    
        expect(retrievedEncounters).toHaveLength(0);
      });

    it ('Return "200 OK" with an empty array if no encounters match the query param "term"', async () => {
        const encounter1ID = (await new Encounter(encounter1Data).save()).id;
        const encounter2ID = (await new Encounter(encounter2Data).save()).id;
        const encounter4ID = (await new Encounter(encounter4Data).save()).id;
    
        user1Data.encounters = [encounter1ID, encounter2ID, encounter4ID];
        user1Data.auth_id = await testUtils.getAuthIdFromToken(token);
        await new User(user1Data).save();
    
        const { body: retrievedEncounters } = await supertest(app)
          .get('/api/encounters')
          .set('Accept', 'application/json')
          .set('Authorization', token)
          .query({ term: "a query that no encounters will match" })
          .expect(httpStatus.OK)
    
        expect(retrievedEncounters).toHaveLength(0);
      });
  
    it ('Correctly filters encounters by the "term" query param', async () => {
      encounter1Data.title = "Movie - Spider-Man: No Way Home"
      const encounter1ID = (await new Encounter(encounter1Data).save()).id;
      encounter2Data.title = "MOVIE - Free Guy"
      const encounter2ID = (await new Encounter(encounter2Data).save()).id;
      encounter4Data.title = "Sports - Badminton"
      const encounter4ID = (await new Encounter(encounter4Data).save()).id;
  
      user1Data.encounters = [encounter1ID, encounter2ID, encounter4ID];
      user1Data.auth_id = await testUtils.getAuthIdFromToken(token);
      await new User(user1Data).save();
  
      const { body: retrievedEncounters } = await supertest(app)
        .get('/api/encounters')
        .set('Accept', 'application/json')
        .set('Authorization', token)
        .query({ term: 'Movie' })
        .expect(httpStatus.OK)
  
      expect(retrievedEncounters).toHaveLength(2);
      expect(retrievedEncounters[0].title).toBe("Movie - Spider-Man: No Way Home");
      expect(retrievedEncounters[1].title).toBe("MOVIE - Free Guy");
    });
  
    it ('Does not return duplicates if multiple fields in an encounter match the "term" query', async () => {
      encounter1Data.title = "Test";
      encounter1Data.location = "Test";
      encounter1Data.description = "Test";
      const encounter1ID = (await new Encounter(encounter1Data).save()).id;
      encounter2Data.title = "Test";
      const encounter2ID = (await new Encounter(encounter2Data).save()).id;
  
      user1Data.encounters = [encounter1ID, encounter2ID];
      user1Data.auth_id = await testUtils.getAuthIdFromToken(token);
      await new User(user1Data).save();
  
      const { body: retrievedEncounters } = await supertest(app)
        .get('/api/encounters')
        .set('Accept', 'application/json')
        .set('Authorization', token)
        .query({ term: "Test" })
        .expect(httpStatus.OK)
  
      expect(retrievedEncounters).toHaveLength(2);
      expect(retrievedEncounters[0].title).toBe("Test");
      expect(retrievedEncounters[0].location).toBe("Test");
      expect(retrievedEncounters[0].description).toBe("Test");
      expect(retrievedEncounters[1].title).toBe("Test");
    });

    it ('Correct data is embedded in the "persons" field for each encounter returned', async () => {
      const person1ID = (await new Person(person1Data).save()).id;
      const person2ID = (await new Person(person2Data).save()).id;
      encounter1Data.persons = [person1ID, person2ID];
      const encounter1ID = (await new Encounter(encounter1Data).save()).id;
      encounter2Data.persons = [person1ID];
      const encounter2ID = (await new Encounter(encounter2Data).save()).id;

      user1Data.encounters = [encounter1ID, encounter2ID];
      user1Data.auth_id = await testUtils.getAuthIdFromToken(token);
      await new User(user1Data).save();

      const { body: retrievedEncounters } = await supertest(app)
        .get('/api/encounters')
        .set('Accept', 'application/json')
        .set('Authorization', token)
        .expect(httpStatus.OK)

      expect(retrievedEncounters).toHaveLength(2);
      expect(retrievedEncounters[0].persons[0].first_name).toBe("Ping");
      expect(retrievedEncounters[0].persons[1].first_name).toBe("Adam");
      expect(retrievedEncounters[1].persons[0].first_name).toBe("Ping");
    });
  
    it ('Return "401 Unauthorized" if the user does not have a valid auth_id', async () => {
      await supertest(app)
        .get('/api/encounters')
        .set('Accept', 'application/json')
        .set("Authorization", "FAKE_AUTH_TOKEN")
        .expect(httpStatus.UNAUTHORIZED);
    });
  });


/*****************************************************************
 * Utility functions
 ****************************************************************/

/**
 * Creates user and creates person to that user, then an encounter with that person
 * Something like: user -> person -> encounter
 * returns id of the encounter
 * @param token
 * @return id of created encounter
 */
const createUserPersonEncounter = async (token): Promise<any>=>{
    // create user
    await supertest(app)
        .post('/api/users')
        .set('Accept', 'application/json')
        .set('Authorization', token)
        .send(user1Data)
        .expect(httpStatus.CREATED)

    // create a person
    const createdPerson = await supertest(app)
        .post('/api/persons')
        .set('Accept', 'application/json')
        .set('Authorization', token)
        .send(person1Data)

    // create an encounter
    encounterData.persons = [createdPerson._body._id]
    const newEncounter = await supertest(app)
        .post('/api/encounters')
        .set('Accept', 'application/json')
        .set('Authorization', token)
        .send(encounterData)

    return newEncounter._body._id
}
