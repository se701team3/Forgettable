import httpStatus from 'http-status';
import databaseOperations from '../../utils/test/db-handler';
import { PersonModel } from '../../models/person.model';
import app from '../../index';

const supertest = require('supertest');

beforeAll(async () => databaseOperations.connectDatabase());
afterEach(async () => databaseOperations.clearDatabase());
afterAll(async () => databaseOperations.closeDatabase());

const requestPersonData:PersonModel = {
  first_name: 'new person',
  last_name: 'hellob',
  interests: ['a', 'b'],
  organisation: 'helloc',
  time_added: new Date('2022-01-01'),
  how_we_met: 'helloe',
  birthday: new Date('2002-12-12'),
  encounters: [] as any,
};

describe('person ', () => {
  it('can be created correctly', async () => {
    await supertest(app).post('/api/persons/create')
      .set('Accept', 'application/json')
      .send(requestPersonData)
      .expect(httpStatus.CREATED);

    const { body } = await supertest(app).get('/api/persons');
    expect(body).toHaveLength(1);
    const result:PersonModel = body[0];
    expect(result.first_name).toEqual(requestPersonData.first_name);
    expect(result.last_name).toEqual(requestPersonData.last_name);
  });
});
