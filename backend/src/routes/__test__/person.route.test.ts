import httpStatus from 'http-status';
import databaseOperations from '../../utils/test/db-handler';
import { PersonModel } from '../../models/person.model';
import app from '../../server';

const supertest = require('supertest');

beforeAll(async () => databaseOperations.connectDatabase());
afterEach(async () => databaseOperations.clearDatabase());
afterAll(async () => databaseOperations.closeDatabase());

const requestPersonData:PersonModel = {
  first_name: 'testFirstName',
  last_name: 'testLastName',
  interests: ['a', 'b'],
  organisation: 'testorg',
  time_updated: new Date('2022-01-01'),
  how_we_met: 'testmet',
  birthday: new Date('2002-12-12'),
  encounters: [] as any,
  first_met: new Date('2022-01-01'),
  gender: "other",
  image: null as any,
  location: 'Someplace',
  social_media: null as any
};

describe('person ', () => {
  it('can be created correctly', async () => {
    await supertest(app).post('/api/persons')
      .set('Accept', 'application/json')
      .send(requestPersonData)
      .expect(httpStatus.CREATED);

    const { body } = await supertest(app).get('/api/persons');
    expect(body).toHaveLength(1);
    const result:PersonModel = body[0];
    expect(result.first_name).toEqual(requestPersonData.first_name);
  });

  it('is updated correctly', async () => {
    // create a person
    const newPerson = await supertest(app).post('/api/persons').set('Accept', 'application/json').send(requestPersonData);
    const newPersonId = newPerson._body._id;
    expect(newPerson._body.location).toBe(requestPersonData.location);

    // change the data
    const changedLocation = 'Someplace else';
    requestPersonData.location = changedLocation;

    // update a person
    await supertest(app)
        .put(`/api/persons/${newPersonId}`)
        .set('Accept', 'application/json')
        .send(requestPersonData)
        .expect(httpStatus.NO_CONTENT);

    // retrieve encounter from database, and check that the updated encounter contains the changed location
    const resPerson = await supertest(app).get(`/api/persons/${newPersonId}`);
    expect(resPerson._body.location).toBe(requestPersonData.location);
  });
});
