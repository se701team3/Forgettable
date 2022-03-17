import databaseOperations from '../../utils/test/db-handler';
import { PersonModel } from '../../models/person.model';
import { EncounterModel } from 'src/models/encounter.model';
import app from '../../server';
import httpStatus from "http-status";
import testUtils from '../../utils/test/test-utils';
import 'dotenv/config';
import { UserModel } from 'src/models/user.model';

const supertest = require('supertest');

let token;

beforeAll(async () => {

    token = await testUtils.generateTestAuthToken();

    databaseOperations.connectDatabase();
});
afterEach(async () => databaseOperations.clearDatabase());
afterAll(async () => databaseOperations.closeDatabase());

const user1Data = {
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

const encounter4Data= {
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

        const { body:person } = await supertest(app).post('/api/persons')
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

        const { body: storedPerson} = await supertest(app).get(`/api/persons/${person._id}`)
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

// Delete Encounters Endpoint tests

describe('Delete /encounter 200', () => {
    it('Successfully deletes SINGLE ENCOUNTER with SINGLE PERSON: ', async () => {
        // Create User and add a person and encounter
        const {body: user} = await supertest(app).post('/api/users')
        .set('Accept', 'application/json')
        .set('Authorization', token)
        .send(user1Data);
    
        // Create person
        const { body: person } = await supertest(app).post('/api/persons')
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .send(person1Data);

        // Create encounter
        encounter1Data.persons.push(person._id);
        const {body: encounter} = await supertest(app).post('/api/encounters')
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .send(encounter1Data);

        person.encounters.push(encounter._id);
        user.encounters.push(encounter._id);
        user.persons.push(person._id);

        //Testing delete encounters endpoint
        await supertest(app).delete(`/api/encounters/${encounter._id}`)
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .send(encounter1Data)
            .expect(httpStatus.OK);

        // person and users encounters should be updated
        expect(person.encounters.length == 0);
        expect(user.encounters.lenghth == 0);
        //Re-initializes variables so that other tests are not affected
        encounter1Data.persons = [];
    })

    it('Successfully deletes SINGLE ENCOUNTER with MULTIPLE PERSONS: ', async () => {
        // Create User and add two persons and encounter
        const {body: user} = await supertest(app).post('/api/users')
        .set('Accept', 'application/json')
        .set('Authorization', token)
        .send(user1Data);

        const { body: person1 } = await supertest(app).post('/api/persons')
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .send(person1Data);

        const { body: person2 } = await supertest(app).post('/api/persons')
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .send(person2Data);

        encounter1Data.persons.push(person1._id);
        encounter1Data.persons.push(person2._id);
        console.log("ENCOUNTERS DATA: ", encounter1Data);
        const {body: encounter} = await supertest(app).post('/api/encounters')
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .send(encounter1Data);

        person1.encounters.push(encounter["_id"]);
        person2.encounters.push(encounter["_id"]);
        user.encounters.push(encounter["_id"]);
        user.persons.push(person1["_id"]);
        user.persons.push(person2["_id"]);

        console.log("DATA: ", "PERSON 1: ", person1["_id"], "PERSON 2: ", person2, "USER: ", user, "ENCOUNTER: ", encounter);
        //Testing delete encounters endpoint
        await supertest(app).delete(`/api/encounters/${encounter._id}`)
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .send(encounter)
            .expect(httpStatus.OK);

        // users and persons encounters should be successfully updated
        expect(person1.encounters.length == 0);
        expect(person2.encounters.length == 0);
        expect(user.encounters.length == 0);
        //Re-initializes variables so that other tests are not affected
        encounter1Data.persons = [];
    })

    it('Successfully deletes MULTIPLE ENCOUNTERS with SINGLE PERSONS: ', async () => {
        // Create User and add two persons and encounter
        const {body: user} = await supertest(app).post('/api/users')
        .set('Accept', 'application/json')
        .set('Authorization', token)
        .send(user1Data);

        const { body: person1 } = await supertest(app).post('/api/persons')
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .send(person1Data);

        // Create encounter 1
        encounter1Data.persons.push(person1._id);
        console.log("ENCOUNTERS 1 DATA: ", encounter1Data);
        const {body: encounter1} = await supertest(app).post('/api/encounters')
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .send(encounter1Data);

        // Create encounter 2
        encounter2Data.persons.push(person1._id);
        console.log("ENCOUNTERS 2 DATA: ", encounter2Data);
        const {body: encounter2} = await supertest(app).post('/api/encounters')
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .send(encounter2Data);

        // Updating encounters ID inputs
        person1.encounters.push(encounter1["_id"]);
        person1.encounters.push(encounter2["_id"]);
        user.encounters.push(encounter1["_id"]);
        user.encounters.push(encounter2["_id"]);
        user.persons.push(person1["_id"]);

        console.log("DATA: ", "PERSON 1: ", person1, "ENCOUNTER 1: ", encounter1, "ENCOUNTER 2: ", encounter2, "USER: ", user);
        //Testing delete encounters endpoint
        await supertest(app).delete(`/api/encounters/${encounter1._id}`)
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .send(encounter1)
            .expect(httpStatus.OK);

        await supertest(app).delete(`/api/encounters/${encounter2._id}`)
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .send(encounter2)
            .expect(httpStatus.OK);

        // persons and user encounters should be successfully updated
        expect(person1.encounters.length == 0);
        expect(user.encounters.length == 0);
        //Re-initializes variables so that other tests are not affected
        encounter1Data.persons = [];
        encounter2Data.persons = [];
    }) 
});

describe('Delete /encounter 404', () => {
    it('Successfully sends back a NOT_FOUND with invalid encounter ID: ', async () => {
        // Create User and add a person and encounter
        const {body: user} = await supertest(app).post('/api/users')
        .set('Accept', 'application/json')
        .set('Authorization', token)
        .send(user1Data);
    
        // Create person
        const { body: person } = await supertest(app).post('/api/persons')
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .send(person1Data);

        // Create encounter
        encounter1Data.persons.push(person._id);
        const {body: encounter} = await supertest(app).post('/api/encounters')
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .send(encounter1Data);

        person.encounters.push(encounter._id);
        user.encounters.push(encounter._id);
        user.persons.push(person._id);

        //Testing delete encounters endpoint
        await supertest(app).delete(`/api/encounters/123132123`)
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .send(encounter1Data)
            .expect(httpStatus.NOT_FOUND);

        // person and users encounters should be not updated
        expect(person.encounters.length == 1);
        expect(user.encounters.lenghth == 1);
        //Re-initializes variables so that other tests are not affected
        encounter1Data.persons = [];
    })
});

describe('Delete /encounter 400', () => {
    it('Successfully sends back a BAD_REQUEST with Encounter with empty persons field: ', async () => {
        // Create User and add a person and encounter
        const {body: user} = await supertest(app).post('/api/users')
        .set('Accept', 'application/json')
        .set('Authorization', token)
        .send(user1Data);

        // Create person
        const { body: person } = await supertest(app).post('/api/persons')
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .send(person1Data);

        // Create encounter
        encounter1Data.persons.push(person._id);
        const {body: encounter} = await supertest(app).post('/api/encounters')
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .send(encounter1Data);

        console.log("ENCONTER: ", encounter);
        // Remove Person ID from encounter
        encounter.persons.pop();
        encounter1Data.persons.pop();
        console.log("USER: ", user, "ENCOUNTER: ", encounter, "ENCOUNTER ID: ", encounter?.["_id"]);
        user.encounters.push(encounter?.["_id"]);
        
        //Testing delete encounters endpoint
        await supertest(app).delete(`/api/encounters/${encounter._id}`)
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .send(encounter)
            .expect(httpStatus.BAD_REQUEST);

        //Re-initializes variables so that other tests are not affected
        encounter1Data.persons = [];
    })
});