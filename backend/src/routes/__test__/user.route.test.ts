import httpStatus from 'http-status';
import databaseOperations from '../../utils/test/db-handler';
import { UserModel } from 'src/models/user.model';
import app from '../../server';

const supertest = require('supertest');

beforeAll(async () => databaseOperations.connectDatabase());
afterEach(async () => databaseOperations.clearDatabase());
afterAll(async () => databaseOperations.closeDatabase());

const requestUserData:UserModel = {
  auth_id: 'testauth',
  first_name: 'testname',
  last_name: 'testlname',
  persons: [] as any,
  encounters: [] as any
};

describe('user ', () => {
  it('can be created correctly', async () => {
    await supertest(app).post('/api/users')
      .set('Accept', 'application/json')
      .send(requestUserData)
      .expect(httpStatus.CREATED);

    const { body } = await supertest(app).get('/api/users');
    expect(body).toHaveLength(1);
    const result:UserModel = body[0];
    expect(result.first_name).toEqual(requestUserData.first_name);
    expect(result.last_name).toEqual(requestUserData.last_name);
  });
});
