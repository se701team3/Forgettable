import databaseOperations from '../../utils/test/db-handler';
import { PersonModel } from '../../models/person.model';
import { EncounterModel } from 'src/models/encounter.model';
import app from '../../server';
import httpStatus from "http-status";

const supertest = require('supertest');

beforeAll(async () => databaseOperations.connectDatabase());
afterEach(async () => databaseOperations.clearDatabase());
afterAll(async () => databaseOperations.closeDatabase());

const encounterData: EncounterModel = {
  date: new Date("2022-12-02"),
  location: "here",
  description: "we did this and that",
  persons: [] as any,
}

describe('encounter ', () => {
  it('is created correctly', async ()=>{
    const {_body} = await supertest(app).post('/api/encounters')
        .set('Accept', 'application/json')
        .send(encounterData)
        .expect(httpStatus.CREATED)

    expect(_body.location).toBe(encounterData.location)
    expect(_body.description).toBe(encounterData.description)
  })

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
        .send(encounterData)
        .expect(httpStatus.BAD_REQUEST)
  });

  it('is updated with encounter object ID that does not exist', async () => {
    // update an encounter of id that does not exist
    await supertest(app)
        .put(`/api/encounters/622b36166bb3a4e3a1ef62f1`)
        .set('Accept', 'application/json')
        .send(encounterData)
        .expect(httpStatus.NOT_FOUND)
  });
});
const person1Data: PersonModel = {
    first_name: 'Ray',
    last_name: 'Ping',
    interests: ['video games', 'hockey'],
    organisation: 'helloc',
    time_added: new Date('2022-01-01'),
    how_we_met: 'Hockey club',
    birthday: new Date('2002-12-12'),
    encounters: [] as any,
};

const person2Data: PersonModel = {
    first_name: 'Adam',
    last_name: 'Bong',
    interests: ['badminton', 'golf'],
    organisation: 'helloc',
    time_added: new Date('2022-02-23'),
    how_we_met: 'Skype',
    birthday: new Date('2001-07-16'),
    encounters: [] as any,
}

const encounter1Data: EncounterModel = {
    date: new Date('2022-02-23'),
    description: 'Met at a cafe',
    location: 'Auckland',
    persons: [] as any
}

const encounter2Data: EncounterModel = {
    date: new Date('2022-02-24'),
    description: 'Had lunch together',
    location: 'Auckland',
    persons: [] as any
}

//Bad encounter entry as description is not given
const encounter3Data = {
    date: new Date('2022-05-25'),
    location: 'Auckland',
}

const encounter4Data = {
    description: 'Play badminton together',
    location: 'Auckland',
    persons: []
}

const encounter5Data = {
    date: new Date('2022-05-25'),
    location: 'Auckland',
    persons: []
}

const encounter6Data = {
    date: new Date('2022-05-25'),
    description: 'Play badminton together',
    persons: []
}

const encounter7Data = {
    date: new Date('2022-02-23'),
    description: 'Met at a cafe',
    location: 'Auckland',
}

const encounterData: EncounterModel = {
    date: new Date("2022-12-02"),
    location: "here",
    description: "we did this and that",
    persons: [] as any,
}

describe('POST /encounter', () => {
    it('Successfully creating an encounter with empty persons array', async () => {
        await supertest(app).post('/api/encounters')
            .set('Accept', 'application/json')
            .send(encounter1Data)
            .expect(httpStatus.CREATED);
    })

    it('Encounter stored in database when request is successful', async () => {
        await supertest(app).post('/api/encounters')
            .set('Accept', 'application/json')
            .send(encounter1Data)
            .expect(httpStatus.CREATED);

        //TODO: needs to get the encounter to make a check that the encounter was successfully made
    })

    it('Encounter not stored in database when request is unsuccessful', async () => {
        await supertest(app).post('/api/encounters')
            .set('Accept', 'application/json')
            .send(encounter3Data)
            .expect(httpStatus.BAD_REQUEST);

        //TODO: needs to get encounter to make a check that the encounter was not stored in database
    })

    it('Successfully creating an encounter with 2 persons', async () => {
        const { body: person1 } = await supertest(app).post('/api/persons')
            .set('Accept', 'application/json')
            .send(person1Data);

        const { body: person2 } = await supertest(app).post('/api/persons')
            .set('Accept', 'application/json')
            .send(person2Data);

        encounter1Data.persons.push(person1._id);
        encounter1Data.persons.push(person2._id);

        await supertest(app).post('/api/encounters')
            .set('Accept', 'application/json')
            .send(encounter1Data)
            .expect(httpStatus.CREATED);
    })

    it('Failed to create an encounter without a persons field', async () => {
        await supertest(app).post('/api/encounters')
            .set('Accept', 'application/json')
            .send(encounter3Data)
            .expect(httpStatus.BAD_REQUEST)
    })

    it('Successfully creating an encounter without a date field', async () => {
        await supertest(app).post('/api/encounters')
            .set('Accept', 'application/json')
            .send(encounter4Data)
            .expect(httpStatus.CREATED);
    })

    it('Failed to create an encounter without a description field', async () => {
        await supertest(app).post('/api/encounters')
            .set('Accept', 'application/json')
            .send(encounter5Data)
            .expect(httpStatus.BAD_REQUEST);
    })

    it('Successfuly creating an encounter without a location field', async () => {
        await supertest(app).post('/api/encounters')
            .set('Accept', 'application/json')
            .send(encounter6Data)
            .expect(httpStatus.CREATED);
    })

    it('Successfuly creating an encounter without a persons field', async () => {
        await supertest(app).post('/api/encounters')
            .set('Accept', 'application/json')
            .send(encounter7Data)
            .expect(httpStatus.CREATED);
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
        .send(encounterData)
        .expect(httpStatus.BAD_REQUEST)
  });

  it('is updated with encounter object ID that does not exist', async () => {
    // update an encounter of id that does not exist
    await supertest(app)
        .put(`/api/encounters/622b36166bb3a4e3a1ef62f1`)
        .set('Accept', 'application/json')
        .send(encounterData)
        .expect(httpStatus.NOT_FOUND)
  });
});
