import databaseOperations from '../../utils/test/db-handler';
import User, { UserModel } from '../../models/user.model';
import Person, { PersonModel } from '../../models/person.model';
import Encounter, { EncounterModel } from '../../models/encounter.model';
import app from '../../server';
import httpStatus from "http-status";
import testUtils from '../../utils/test/test-utils';
import 'dotenv/config';
import encounterService from '../../services/encounter.service';
import personService from 'src/services/person.service';
import { UserRecord } from 'firebase-admin/lib/auth/user-record';
import {Importance} from "../../enums/importance";

const supertest = require('supertest');

let token;

beforeAll(async () => {

    token = await testUtils.generateTestAuthToken();

    await databaseOperations.connectDatabase();
});
afterEach(async () => databaseOperations.clearDatabase());
afterAll(async () => await databaseOperations.closeDatabase());

const user1Data: UserModel = {
    auth_id: null as any,
    first_name: 'Bing',
    last_name: 'Bong',
    encounters: [] as any,
    persons: [] as any,
    goals: [] as any,
    companies: [] as any
}

const user2Data: UserModel = {
    auth_id: null as any,
    first_name: 'Adam',
    last_name: 'Weng',
    encounters: [] as any,
    persons: [] as any,
    goals: [] as any,
    companies: [] as any
}

const person1Data: PersonModel = {
    first_name: 'Ping',
    last_name: 'Pong',
    interests: ['video games', 'hockey'],
    labels: ['Devop'],
    organisation: 'helloc',
    time_updated: new Date('2022-01-01'),
    importance_level: Importance.Very_Important,
    how_we_met: 'Hockey club',
    birthday: new Date('2002-12-12'),
    encounters: [] as any,
    companies: [] as any,
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
    labels: ['Devop'],
    organisation: 'helloc',
    time_updated: new Date('2022-02-23'),
    importance_level: Importance.Should_Remember,
    how_we_met: 'Skype',
    birthday: new Date('2001-07-16'),
    encounters: [] as any,
    companies: [] as any,
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
    latLong: [200, 200],
    persons: [] as any
}

const encounter2Data: EncounterModel = {
    title: "Encounter2",
    date: new Date('2022-02-24'),
    time_updated: new Date(Date.now()),
    description: 'Had lunch together',
    location: 'Auckland',
    latLong: [200, 200],
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

const encounter8Data: EncounterModel = {
    title: "Encounter3",
    date: new Date('2022-05-25'),
    time_updated: new Date(Date.now()),
    description: '',
    location: 'Auckland',
    latLong: [200, 200],
    persons: [] as any
}

const encounterData: EncounterModel = {
    title: "EncounterData",
    date: new Date("2022-12-02"),
    time_updated: new Date(Date.now()),
    location: "here",
    latLong: [200, 200],
    description: "we did this and that",
    persons: [] as any,
}

const encounterPruneData: EncounterModel = {
    title: "PruneEncounter",
    date: new Date("2021-10-01T00:51:11.707Z"),
    time_updated: new Date("2021-10-01T00:51:11.707Z"),
    description: "To be pruned",
    persons: [] as any,
    location: ''
}

const encounterDontPruneData: EncounterModel = {
    title: "DontPruneEncounter",
    date: new Date("2021-01-01T00:51:11.707Z"),
    time_updated: new Date("2021-01-01T00:51:11.707Z"),
    description: "Should not be pruend",
    persons: [] as any,
    location: ''
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

describe('GET /encounters/:id', () => {
    it ('Successfully retrieves an encounter with a given json', async () => {
        const newEncounterId = await createUserPersonEncounter(token);

        // retrieve the specified encounter
        const encounter = await supertest(app)
            .get(`/api/encounters/${newEncounterId}`)
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .expect(httpStatus.OK)

        expect(encounter._body.description).toBe(encounterData.description)
        expect(encounter._body.location).toEqual(encounterData.location)

    });
  
    it('Fails when called with invalid encounter object ID', async () => {
        await createUserPersonEncounter(token)
        // update an encounter of id that does not exist
        await supertest(app)
            .get(`/api/encounters/${123}`)
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .expect(httpStatus.NOT_FOUND)
    });

    it('Fails when encounter object ID that does not exist', async () => {
        // update an encounter of id that does not exist
        await supertest(app)
            .get(`/api/encounters/622b36166bb3a4e3a1ef62f1`)
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .expect(httpStatus.NOT_FOUND)
    });
    it('Fails when user does not exist for given token', async ()=>{
        await supertest(app)
            .get(`/api/encounters/1234567890`)
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .expect(httpStatus.NOT_FOUND)
    })
    it('Fails when user is not authenticated', async ()=>{
        await supertest(app)
            .get(`/api/encounters/1234567890`)
            .set('Accept', 'application/json')
            .expect(httpStatus.UNAUTHORIZED)
    })
});

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

describe('GET /encounters pagination', () => {

    async function populateDbWithUsersEncounters() {
        const encounter1 = new Encounter(encounter1Data);
        const encounter2 = new Encounter(encounter2Data);
        const encounter3 = new Encounter(encounter4Data);
        const encounter4 = new Encounter(encounter5Data);
        const encounter5 = new Encounter(encounter1Data);
        const encounter6 = new Encounter(encounter2Data);
        const encounter7 = new Encounter(encounter2Data);
        const encounter8 = new Encounter(encounter5Data);
        const encounter9 = new Encounter(encounter4Data);
        const encounter10 = new Encounter(encounter1Data);
    
        await encounter1.save();
        await encounter2.save();
        await encounter3.save();
        await encounter4.save();
        await encounter5.save();
        await encounter6.save();
        await encounter7.save();
        await encounter8.save();
        await encounter9.save();
        await encounter10.save();
    
        user2Data.auth_id = await testUtils.getAuthIdFromToken(token);
        const user = new User(user2Data);
        user.encounters.push(encounter1._id, encounter2._id, encounter3._id, encounter4._id, encounter5._id, encounter6._id, encounter7._id, encounter8._id, encounter9._id, encounter10._id);
        await user.save();
    
        const storedEncounterIds = [encounter1._id, encounter2._id, encounter3._id, encounter4._id, encounter5._id, encounter6._id, encounter7._id, encounter8._id, encounter9._id, encounter10._id];
    
        return storedEncounterIds;
    }

    it('Response paginated and returns correct number of entries', async () => {
        await populateDbWithUsersEncounters();

        const { body: encounters } = await supertest(app).get('/api/encounters')
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .query({
                limit: 3,
                page: 1
            });

        expect(encounters.length).toEqual(3);
    });

    it('Response paginated and returns the correct page of entries', async () => {
        const storedEncounterIds = await populateDbWithUsersEncounters();

        const { body: encounters } = await supertest(app).get('/api/encounters')
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .query({
                limit: 3,
                page: 2
            });

        expect(encounters[0]).toHaveProperty('_id', storedEncounterIds[3]._id.toString());
        expect(encounters[1]).toHaveProperty('_id', storedEncounterIds[4]._id.toString());
        expect(encounters[2]).toHaveProperty('_id', storedEncounterIds[5]._id.toString());

    });

    it('Response not paginated when limit is not given', async () => {
        await populateDbWithUsersEncounters();

        const { body: encounters } = await supertest(app).get('/api/encounters')
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .query({
                page: 4
            });

        expect(encounters.length).toEqual(10);
    });

    it('Response not paginated when page is not given', async () => {
        await populateDbWithUsersEncounters();

        const { body: encounters } = await supertest(app).get('/api/encounters')
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .query({
                limit: 5,
            });

        expect(encounters.length).toEqual(10);
    });

    it('Response not paginated when limit is not a number', async () => {
        await populateDbWithUsersEncounters();

        const { body: encounters } = await supertest(app).get('/api/encounters')
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .query({
                limit: "four",
                page: 2
            });

        expect(encounters.length).toEqual(10);
    });

    it('Response not paginated when page is not a number', async () => {
        await populateDbWithUsersEncounters();

        const { body: encounters } = await supertest(app).get('/api/encounters')
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .query({
                limit: 5,
                page: "page"
            });

        expect(encounters.length).toEqual(10);
    });

    it('Empty array is returned when page=0', async () => {
        await populateDbWithUsersEncounters();

        const { body: encounters } = await supertest(app).get('/api/encounters')
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .query({
                limit: 4,
                page: 0
            });

        expect(encounters.length).toEqual(0);
    });

    it('Empty array is returned when page<0', async () => {
        await populateDbWithUsersEncounters();

        const { body: encounters } = await supertest(app).get('/api/encounters')
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .query({
                limit: 2,
                page: -5
            });

        expect(encounters.length).toEqual(0);
    });

    it('Empty array is returned when page requested is out of bound', async () => {
        await populateDbWithUsersEncounters();

        const { body: encounters } = await supertest(app).get('/api/encounters')
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .query({
                limit: 7,
                page: 3
            });

        expect(encounters.length).toEqual(0);
    });

    it('Number of response returned is less than limit if (page * limit) < total entries', async () => {
        await populateDbWithUsersEncounters();

        const { body: encounters } = await supertest(app).get('/api/encounters')
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .query({
                limit: 8,
                page: 2
            });

        expect(encounters.length).toEqual(2);
    })
})
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

// Delete Encounters Endpoint tests

// Delete Encounter 200
describe('DELETE /encounter/:id', () => {
    it('Successfully deletes single encounter with single person: ', async () => {
        // Get Authentication ID for User
        const auth_id = await testUtils.getAuthIdFromToken(token);

        // Create Person
        const personOne = new Person(person1Data);
        const personOneId = (await personOne.save())._id;

        // Create Encounter
        const encounterOne = new Encounter(encounter1Data);
        const encounterOneId = (await encounterOne.save())._id;

        // Create User
        const user = new User(user1Data);

        // Add Encounter and Person ID to User encounters
        user.persons.push(personOneId);
        user.encounters.push(encounterOneId);
        user.auth_id = auth_id;
        await user.save();

        // Add Encounter ID and Person ID to each other
        personOne.encounters.push(encounterOneId);
        encounterOne.persons.push(personOneId);
        await personOne.save();
        await encounterOne.save();

        await supertest(app).delete(`/api/encounters/${encounterOneId}`)
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .expect(httpStatus.OK);
        
        // Check that encounter has been removed
        const newUser = await User.findOne({auth_id: user.auth_id});
        expect(newUser?.persons).not.toContain(personOneId);
        expect(newUser?.encounters).not.toContain(encounterOneId);

        const newPerson = await Person.findOne({_id: personOne._id});
        expect(newPerson?.encounters).not.toContain(encounterOneId);

        expect(await Encounter.findById({_id: encounterOneId})).toEqual(null);
    })

    it('Successfully deletes single encounter with multiple persons: ', async () => {
        // Get Authentication ID for User
        const auth_id = await testUtils.getAuthIdFromToken(token);

        // Create Person One
        const personOne = new Person(person1Data);
        const personOneId = (await personOne.save())._id;

        // Create Person Two
        const personTwo = new Person(person2Data);
        const personTwoId = (await personTwo.save())._id;

        // Create Encounter
        const encounterOne = new Encounter(encounter1Data);
        const encounterOneId = (await encounterOne.save())._id;

        // Create User
        const user = new User(user1Data);

        // Add Encounter and Person ID to User encounters
        user.persons.push(personOneId);
        user.persons.push(personTwoId);
        user.encounters.push(encounterOneId);
        user.auth_id = auth_id;
        await user.save();

        // Add Encounter ID and Person ID to each other
        personOne.encounters.push(encounterOneId);
        personTwo.encounters.push(encounterOneId);
        encounterOne.persons.push(personOneId);
        await personOne.save();
        await personTwo.save();
        await encounterOne.save();

        // Call delete endpoints
        await supertest(app).delete(`/api/encounters/${encounterOneId}`)
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .expect(httpStatus.OK);
        
        // Check that encounter has been removed
        const newUser = await User.findOne({auth_id: user.auth_id});
        expect(newUser?.persons).not.toContain(personOneId);
        expect(newUser?.encounters).not.toContain(encounterOneId);

        const newPersonOne = await Person.findOne({_id: personOne._id});
        expect(newPersonOne?.encounters).not.toContain(encounterOneId);

        const newPersonTwo = await Person.findOne({_id: personTwo._id});
        expect(newPersonTwo?.encounters).not.toContain(encounterOneId);

        expect(await Encounter.findById({_id: encounterOneId})).toEqual(null);
    })

    it('Successfully deletes multiple encounters with single persons: ', async () => {
        // Get Authentication ID for User
        const auth_id = await testUtils.getAuthIdFromToken(token);

        // Create Person One
        const personOne = new Person(person1Data);
        const personOneId = (await personOne.save())._id;

        // Create Encounters
        const encounterOne = new Encounter(encounter1Data);
        const encounterOneId = (await encounterOne.save())._id;

        const encounterTwo = new Encounter(encounter2Data);
        const encounterTwoId = (await encounterTwo.save())._id;

        // Create User
        const user = new User(user1Data);

        // Add Encounter and Person ID to User encounters
        user.persons.push(personOneId);
        user.encounters.push(encounterOneId);
        user.encounters.push(encounterTwoId);
        user.auth_id = auth_id;
        await user.save();

        // Add Encounter ID and Person ID to each other
        personOne.encounters.push(encounterOneId);
        personOne.encounters.push(encounterTwoId);
        encounterOne.persons.push(personOneId);
        encounterTwo.persons.push(personOneId);
        await personOne.save();
        await encounterOne.save();
        await encounterTwo.save();

        // Call delete endpoints
        await supertest(app).delete(`/api/encounters/${encounterOneId}`)
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .expect(httpStatus.OK);

        await supertest(app).delete(`/api/encounters/${encounterTwoId}`)
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .expect(httpStatus.OK);
        
        // Check that encounter has been removed
        const newUser = await User.findOne({auth_id: user.auth_id});
        expect(newUser?.persons).not.toContain(personOneId);
        expect(newUser?.encounters).not.toContain(encounterOneId);

        const newPersonOne = await Person.findOne({_id: personOne._id});
        expect(newPersonOne?.encounters).not.toContain(encounterOneId);
        expect(newPersonOne?.encounters).not.toContain(encounterTwoId);

        expect(await Encounter.findById({_id: encounterOneId})).toEqual(null);
        expect(await Encounter.findById({_id: encounterTwoId})).toEqual(null);
    }) 

// Delete Encounter 404

    it('Sends back a NOT_FOUND when invalid encounter ID is requested: ', async () => {
        // Get Authentication ID for User
        const auth_id = await testUtils.getAuthIdFromToken(token);

        // Create Encounters
        const encounterOne = new Encounter(encounter1Data);
        const invalidEncounterId = (await encounterOne.save())._id;

        // Create User
        const user = new User(user1Data);
        user.auth_id = auth_id;
        await user.save();

        await supertest(app).delete(`/api/encounters/${invalidEncounterId}`)
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .expect(httpStatus.NOT_FOUND);

        // Check that no encounters are deleted from User
        const newUser = await User.findOne({auth_id: user.auth_id});
        expect(newUser?.encounters).toHaveLength(user.encounters.length);
        
    })

// Delete Encounter 409

    it('Sends back a CONFLICT when deleting Encounter with empty persons field: ', async () => {
        // Get Authentication Token
        const auth_id = await testUtils.getAuthIdFromToken(token);

        // Create Encounter
        const encounterOne = new Encounter(encounter1Data);
        const encounterOneId = (await encounterOne.save())._id;

        // Create User
        const user = new User(user1Data);

        // Add Encounter ID to User encounters
        user.encounters.push(encounterOneId);
        user.auth_id = auth_id;
        await user.save();

        await supertest(app).delete(`/api/encounters/${encounterOneId}`)
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .send(encounterOne)
            .expect(httpStatus.CONFLICT);

        // Encounter should still be deleted from the Encounter collection
        expect(await Encounter.findById({_id: encounterOneId})).toEqual(null);
    })

    it('Sends back a CONFLICT when deleting Encounter with duplicate encounter IDs in User: ', async () => {
        // Get Authentication ID for User
        const auth_id = await testUtils.getAuthIdFromToken(token);

        // Create Encounter
        const encounterOne = new Encounter(encounter1Data);
        const encounterOneId = (await encounterOne.save())._id;

        // Create User
        const user = new User(user1Data);

        // Add Encounter ID to Users x 2
        user.encounters.push(encounterOneId);
        user.encounters.push(encounterOneId);
        user.auth_id = auth_id;
        await user.save();

        await supertest(app).delete(`/api/encounters/${encounterOneId}`)
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .send(encounterOne)
            .expect(httpStatus.CONFLICT);

        // Encounter should still be deleted from User and Collection
        const newUser = await User.findOne({auth_id: user.auth_id});
        expect(newUser?.encounters).not.toContain(encounterOneId);

        expect(await Encounter.findById({_id: encounterOneId})).toEqual(null);
    })
});

// Prune Encounter 200
describe('DELETE /encounter/prune/:pruneDate', () => {
    it('Successfully prunes entries before a given date: ', async () => {
        // Get Authentication ID for User
        const auth_id = await testUtils.getAuthIdFromToken(token);

        // Create Person
        const personOne = new Person(person1Data);
        const personOneId = (await personOne.save())._id;

        // Create Encounter that needs to be pruned - 2021-10-1
        const encounterPrune = new Encounter(encounterPruneData);
        const encounterPruneId = (await encounterPrune.save())._id;

        // Create Encounter that should not be pruned - 2022-1-1
        const encounterDontPrune = new Encounter(encounterDontPruneData);
        const encounterDontPruneId = (await encounterDontPrune.save())._id;

        // Create User
        const user = new User(user1Data);

        // Add Encounters and Person ID to User encounters
        user.persons.push(personOneId);
        user.encounters.push(encounterPruneId);
        user.encounters.push(encounterDontPruneId);
        user.auth_id = auth_id;
        await user.save();

        // Add Encounter IDs and Person ID to each other
        personOne.encounters.push(encounterPruneId);
        encounterPrune.persons.push(personOneId);
        personOne.encounters.push(encounterDontPruneId);
        encounterDontPrune.persons.push(personOneId);
        await personOne.save();
        await encounterPrune.save();
        await encounterDontPrune.save();

        await supertest(app).delete(`/api/encounters/prune/2021-12-30T00:51:11.707Z`)
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .expect(httpStatus.OK);
        
        // Check that encounterPrune has been removed
        const newUser = await User.findOne({auth_id: user.auth_id});
        expect(newUser?.encounters).not.toContain(encounterPruneId);

        const newPerson = await Person.findOne({_id: personOne._id});
        expect(newPerson?.encounters).not.toContain(encounterPruneId);

        expect(await Encounter.findById({_id: encounterPruneId})).toEqual(null);
    })})

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


