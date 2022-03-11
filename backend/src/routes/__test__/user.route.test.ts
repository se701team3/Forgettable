import httpStatus from 'http-status';
import databaseOperations from '../../utils/test/db-handler';

import User, { UserModel } from '../../models/user.model';
import Person, { PersonModel } from '../../models/person.model';
import app from '../../server';

const supertest = require('supertest');

beforeAll(async () => databaseOperations.connectDatabase());
afterEach(async () => databaseOperations.clearDatabase());
afterAll(async () => databaseOperations.closeDatabase());

const user1Data = {
    first_name: 'Bing',
    last_name: 'Bong',
    encounters: [] as any,
    persons: [] as any,
}

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

describe('POST /users', () => {
    it('Failed to create new user without auth token', async () => {
        await supertest(app).post('/api/users')
            .set('Accept', 'application/json')
            .send(user1Data)
            .expect(httpStatus.UNAUTHORIZED)
    })
})
