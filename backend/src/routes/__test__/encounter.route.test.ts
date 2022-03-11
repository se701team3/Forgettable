import httpStatus from 'http-status';
import databaseOperations from '../../utils/test/db-handler';
import { EncounterModel } from 'src/models/encounter.model';
import app from '../../index';

const supertest = require('supertest');

beforeAll(async () => databaseOperations.connectDatabase());
afterEach(async () => databaseOperations.clearDatabase());
afterAll(async () => databaseOperations.closeDatabase());

const requestEncounterData:EncounterModel = {
  date: new Date('2000-01-01'),
  location: 'testloc',
  description: 'testdesc',
  persons: [] as any
};

describe('encounter ', () => {
  it('can be created correctly', async () => {
    await supertest(app).post('/api/encounters/create')
      .set('Accept', 'application/json')
      .send(requestEncounterData)
      .expect(httpStatus.CREATED);

    const { body } = await supertest(app).get('/api/encounters');
    expect(body).toHaveLength(1);
    const result:EncounterModel = body[0];
    expect(result.location).toEqual(requestEncounterData.location);
    expect(result.description).toEqual(requestEncounterData.description);
  });
});
