import httpStatus from 'http-status';
import databaseOperations from '../../utils/test/db-handler';

import User, { UserModel } from '../../models/user.model';
import Person, { PersonModel } from '../../models/person.model';
import app from '../../server';
import FirebaseAdmin from '../../firebase-configs/firebase-config';
import { auth } from 'firebase-admin';

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

const user2Data = {
    encounters: [] as any,
    persons: [] as any
}

const user3Data = {
    first_name: 'Tingy',
    last_name: 'Tangy',
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

jest.mock('../../firebase-configs/firebase-config');

describe('POST /users', () => {
    const token = "testToken";

    FirebaseAdmin.auth = jest.fn().mockReturnThis();

    FirebaseAdmin.verifyIdToken = jest.fn().mockImplementation((authToken) => {

        if (authToken === undefined) {
            throw new Error("First argument to verifyIdToken() must be a Firebase ID token string.");
        }
        const decodedToken = {uid: "RgPScJyjeabsvAOwg0GIKjSkX462"};
        return decodedToken;
    })

    it('Failed to create new user without auth token', async () => {
        await supertest(app).post('/api/users')
            .set('Accept', 'application/json')
            .send(user1Data)
            .expect(httpStatus.UNAUTHORIZED);
    })

    it('Failed to create new user without first and last name', async () => {
        await supertest(app).post('/api/users')
            .set('Accept', 'application/json')
            .send(user2Data)
            .set('Authorization', `Bearer ${token}`)
            .expect(httpStatus.BAD_REQUEST)
    })

    it('Successfully created a new user', async () => {
        await supertest(app).post('/api/users')
            .set('Accept', 'application/json')
            .send(user1Data)
            .set('Authorization', `Bearer ${token}`)
            .expect(httpStatus.CREATED)
    })

    it('User stored in database when request is successful', async () => {
        const { body: user } = await supertest(app).post('/api/users')
            .set('Accept', 'application/json')
            .send(user1Data)
            .set('Authorization', `Bearer ${token}`);

        const { body } = await supertest(app).get(`/api/users/${user._id}`);
        expect(body._id).toEqual(user._id); //Assume two objects in mongodb with same _id is equal
    })

    it('User not stored in database when request is unsuccessful', async () => {
        const { body: user } = await supertest(app).post('/api/users')
            .set('Accept', 'application/json')
            .send(user1Data);

        const { body } = await supertest(app).get(`/api/users/${user._id}`);
        expect(body._id).toEqual(user._id); //Assume two objects in mongodb with same _id is equal
    })

    it ('User with same UID and info cannot be created twice', async () => {
        await supertest(app).post('/api/users')
        .set('Accept', 'application/json')
        .send(user1Data)
        .set('Authorization', `Bearer ${token}`)
        .expect(httpStatus.CREATED)

        await supertest(app).post('/api/users')
        .set('Accept', 'application/json')
        .send(user1Data)
        .set('Authorization', `Bearer ${token}`)
        .expect(httpStatus.CONFLICT);
    })

    it ('User with same UID but different info cannot be created twice', async () => {
        await supertest(app).post('/api/users')
        .set('Accept', 'application/json')
        .send(user1Data)
        .set('Authorization', `Bearer ${token}`)
        .expect(httpStatus.CREATED)

        await supertest(app).post('/api/users')
        .set('Accept', 'application/json')
        .send(user2Data)
        .set('Authorization', `Bearer ${token}`)
        .expect(httpStatus.CONFLICT);
    })
})
