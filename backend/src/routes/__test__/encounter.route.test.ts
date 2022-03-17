import databaseOperations from '../../utils/test/db-handler';
import Person, { PersonModel } from '../../models/person.model';
import Encounter, { EncounterModel } from '../../models/encounter.model';
import User, { UserModel } from '../../models/user.model';
import app from '../../server';
import httpStatus from "http-status";
import testUtils from '../../utils/test/test-utils';
import 'dotenv/config';
import personService from 'src/services/person.service';
import { UserRecord } from 'firebase-admin/lib/auth/user-record';

const supertest = require('supertest');

let token;

beforeAll(async () => {

    token = await testUtils.generateTestAuthToken();

    await databaseOperations.connectDatabase();
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
});

// Delete Encounter 404

describe('Delete /encounter/:id', () => {
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
});

// Delete Encounter 400

describe('Delete /encounter 400', () => {
    it('Sends back a BAD_REQUEST when deleting Encounter with empty persons field: ', async () => {
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
            .expect(httpStatus.BAD_REQUEST);

        // Encounter should still be deleted from the Encounter collection
        expect(await Encounter.findById({_id: encounterOneId})).toEqual(null);
    })

    it('Sends back a BAD_REQUEST when deleting Encounter with duplicate encounter IDs in User: ', async () => {
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
            .expect(httpStatus.BAD_REQUEST);

        // Encounter should still be deleted from User and Collection
        const newUser = await User.findOne({auth_id: user.auth_id});
        expect(newUser?.encounters).not.toContain(encounterOneId);

        expect(await Encounter.findById({_id: encounterOneId})).toEqual(null);
    })
});

// Delete Person 200

describe('Delete /person 200', () => {

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

        expect(await Encounter.findById({_id: encounterOneId})).toEqual(null);
        expect(await Encounter.findById({_id: encounterTwoId})).toEqual(null);

        expect(await Person.findById({_id: personOneId})).toEqual(null);
        expect(await Person.findById({_id: personTwoId})).toEqual(null);
    })
});

// Delete Person 404
describe('Delete /person 404', () => {
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
})

// Delete Person 400
describe('Delete /person 400', () => {
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
