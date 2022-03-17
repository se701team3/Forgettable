import databaseOperations from '../../utils/test/db-handler';
import Person, { PersonModel } from '../../models/person.model';
import Encounter, { EncounterModel } from '../../models/encounter.model';
import app from '../../server';
import httpStatus from "http-status";
import testUtils from '../../utils/test/test-utils';
import 'dotenv/config';
import User, { UserModel } from '../../models/user.model';

const supertest = require('supertest');

let token;

beforeAll(async () => {

    token = await testUtils.generateTestAuthToken();

    await databaseOperations.connectDatabase();
});
afterEach(async () => databaseOperations.clearDatabase());
afterAll(async () => await databaseOperations.closeDatabase());

const user1Data = {
    first_name: 'Bing',
    last_name: 'Bong',
    encounters: [] as any,
    persons: [] as any,
}

const user2Data: UserModel = {
    auth_id: null as any,
    first_name: 'Adam',
    last_name: 'Weng',
    encounters: [] as any,
    persons: [] as any
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

describe('encounter ', () => {
    it('is updated correctly', async () => {
        // create an encounter
        const newEncounter = await supertest(app).post('/api/encounters').set('Accept', 'application/json').send(encounterData)
        const newEncounterId = newEncounter._body._id
        expect(newEncounter._body.location).toBe(encounterData.location)

        // change data
        const changedLocation = "actually it's not there"
        encounterData.location = changedLocation

        // update an encounter
        await supertest(app)
            .put(`/api/encounters/${newEncounterId}`)
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .send(encounterData)
            .expect(httpStatus.NO_CONTENT)

        // retrieve encounter from database, and check that the updated encounter contains the changed location
        // TODO: require findEncounter service to be implemented (blocked by GET /encounters/:id)

    });

    it('is updated with invalid encounter object ID (non-castable)', async () => {
        // update an encounter of id that does not exist
        await supertest(app)
            .put(`/api/encounters/${123}`)
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .send(encounterData)
            .expect(httpStatus.BAD_REQUEST)
    });

    it('is updated with encounter object ID that does not exist', async () => {
        // update an encounter of id that does not exist
        await supertest(app)
            .put(`/api/encounters/622b36166bb3a4e3a1ef62f1`)
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .send(encounterData)
            .expect(httpStatus.NOT_FOUND)
    });
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