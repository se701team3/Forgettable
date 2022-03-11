import databaseOperations from '../../utils/test/db-handler';
import app from '../../index';
import {EncounterModel} from "../../models/encounter.model";
import httpStatus from "http-status";
import encounterService from "../encounter.service";

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
