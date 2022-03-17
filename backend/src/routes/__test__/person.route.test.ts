import httpStatus from 'http-status';
import databaseOperations from '../../utils/test/db-handler';
import Person, { PersonModel } from '../../models/person.model';
import app from '../../server';
import testUtils from '../../utils/test/test-utils';
import 'dotenv/config';
import User, { UserModel } from '../../models/user.model';


const supertest = require('supertest');

let token;

beforeAll(async () => {
  token = await testUtils.generateTestAuthToken();

  await databaseOperations.connectDatabase();
});
afterEach(async () => databaseOperations.clearDatabase());
afterAll(async () => await databaseOperations.closeDatabase());

const requestPersonData: PersonModel = {
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

const person1Data: PersonModel = {
  first_name: 'Adam',
  last_name: 'Meng',
  interests: ['Golf', 'Swimming'],
  organisation: 'testorg',
  time_updated: new Date('2022-01-01'),
  how_we_met: 'In a restaurant',
  birthday: new Date('2002-12-12'),
  encounters: [] as any,
  first_met: new Date('2022-01-01'),
  gender: "other",
  image: null as any,
  location: 'Auckland',
  social_media: null as any
}

const person2Data: PersonModel = {
  first_name: 'Samantha',
  last_name: 'Mah',
  interests: ['Reading', 'Music'],
  organisation: 'Finecky',
  time_updated: new Date('2022-01-01'),
  how_we_met: 'Bowling',
  birthday: new Date('2002-12-12'),
  encounters: [] as any,
  first_met: new Date('2022-01-01'),
  gender: "other",
  image: null as any,
  location: 'Browns Bay',
  social_media: null as any
}

const person3Data: PersonModel = {
  first_name: 'Fabian',
  last_name: 'Foh',
  interests: ['Pool', 'Gambling'],
  organisation: 'Partey',
  time_updated: new Date('2022-01-01'),
  how_we_met: 'Party',
  birthday: new Date('2002-12-12'),
  encounters: [] as any,
  first_met: new Date('2022-01-01'),
  gender: "Male",
  image: null as any,
  location: 'Wellington',
  social_media: null as any
}

const person4Data: PersonModel = {
  first_name: 'Kelvin',
  last_name: 'Kong',
  interests: ['Studying', 'Winning'],
  organisation: 'Winnie',
  time_updated: new Date('2022-01-01'),
  how_we_met: 'Bar',
  birthday: new Date('2002-12-12'),
  encounters: [] as any,
  first_met: new Date('2022-01-01'),
  gender: "other",
  image: null as any,
  location: 'Christchurch',
  social_media: null as any
}

const userData: UserModel = {
  auth_id: null as any,
  first_name: 'Ping',
  last_name: 'Pengy',
  encounters: [] as any,
  persons: [] as any
}

describe('person ', () => {
  it('can be created correctly', async () => {
    await supertest(app).post('/api/persons')
      .set('Accept', 'application/json')
      .send(requestPersonData)
      .expect(httpStatus.CREATED);

    const { body } = await supertest(app).get('/api/persons');
    expect(body).toHaveLength(1);
    const result: PersonModel = body[0];
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

describe('GET /persons', () => {
  it('Response paginated and returns correct number of entries', async () => {
    const person1 = new Person(person1Data);
    const person2 = new Person(person2Data);
    const person3 = new Person(person4Data);
    const person4 = new Person(person3Data);
    const person5 = new Person(person1Data);
    const person6 = new Person(person4Data);
    const person7 = new Person(person3Data);
    const person8 = new Person(person2Data);
    const person9 = new Person(person2Data);
    const person10 = new Person(person1Data);

    await person1.save();
    await person2.save();
    await person3.save();
    await person4.save();
    await person5.save();
    await person6.save();
    await person7.save();
    await person8.save();
    await person9.save();
    await person10.save();

    userData.auth_id = await testUtils.getAuthIdFromToken(token);
    const user = new User(userData);
    user.persons.push(person1._id, person2._id, person3._id, person4._id, person5._id, person6._id, person7._id, person8._id, person9._id, person10._id);
    await user.save();

    const { body: persons } = await supertest(app).get('/api/persons')
      .set('Accept', 'application/json')
      .set('Authorization', token)
      .query({
        limit: 4,
        page: 2
      });

    expect(persons.length).toEqual(4);
  });

  it('Response paginated and returns the correct page of entries', async () => {
    const person1 = new Person(person1Data);
    const person2 = new Person(person2Data);
    const person3 = new Person(person4Data);
    const person4 = new Person(person3Data);
    const person5 = new Person(person1Data);
    const person6 = new Person(person4Data);
    const person7 = new Person(person3Data);
    const person8 = new Person(person2Data);
    const person9 = new Person(person2Data);
    const person10 = new Person(person1Data);

    await person1.save();
    await person2.save();
    await person3.save();
    await person4.save();
    await person5.save();
    await person6.save();
    await person7.save();
    await person8.save();
    await person9.save();
    await person10.save();

    userData.auth_id = await testUtils.getAuthIdFromToken(token);
    const user = new User(userData);
    user.persons.push(person1._id, person2._id, person3._id, person4._id, person5._id, person6._id, person7._id, person8._id, person9._id, person10._id);
    await user.save();

    const { body: persons } = await supertest(app).get('/api/persons')
      .set('Accept', 'application/json')
      .set('Authorization', token)
      .query({
        limit: 2,
        page: 4
      });

    expect(persons[0]).toHaveProperty('_id', person7._id.toString());
    expect(persons[1]).toHaveProperty('_id', person8._id.toString());
  });

  it('Response not paginated when limit is not given', async () => {
    const person1 = new Person(person1Data);
    const person2 = new Person(person2Data);
    const person3 = new Person(person4Data);
    const person4 = new Person(person3Data);
    const person5 = new Person(person1Data);
    const person6 = new Person(person4Data);
    const person7 = new Person(person3Data);
    const person8 = new Person(person2Data);
    const person9 = new Person(person2Data);
    const person10 = new Person(person1Data);

    await person1.save();
    await person2.save();
    await person3.save();
    await person4.save();
    await person5.save();
    await person6.save();
    await person7.save();
    await person8.save();
    await person9.save();
    await person10.save();

    userData.auth_id = await testUtils.getAuthIdFromToken(token);
    const user = new User(userData);
    user.persons.push(person1._id, person2._id, person3._id, person4._id, person5._id, person6._id, person7._id, person8._id, person9._id, person10._id);
    await user.save();

    const { body: persons } = await supertest(app).get('/api/persons')
      .set('Accept', 'application/json')
      .set('Authorization', token)
      .query({
        page: 4
      });

    expect(persons.length).toEqual(10);
  });

  it('Response not paginated when page is not given', async () => {
    const person1 = new Person(person1Data);
    const person2 = new Person(person2Data);
    const person3 = new Person(person4Data);
    const person4 = new Person(person3Data);
    const person5 = new Person(person1Data);
    const person6 = new Person(person4Data);
    const person7 = new Person(person3Data);
    const person8 = new Person(person2Data);
    const person9 = new Person(person2Data);
    const person10 = new Person(person1Data);

    await person1.save();
    await person2.save();
    await person3.save();
    await person4.save();
    await person5.save();
    await person6.save();
    await person7.save();
    await person8.save();
    await person9.save();
    await person10.save();

    userData.auth_id = await testUtils.getAuthIdFromToken(token);
    const user = new User(userData);
    user.persons.push(person1._id, person2._id, person3._id, person4._id, person5._id, person6._id, person7._id, person8._id, person9._id, person10._id);
    await user.save();

    const { body: persons } = await supertest(app).get('/api/persons')
      .set('Accept', 'application/json')
      .set('Authorization', token)
      .query({
        limit: 4,
      });

    expect(persons.length).toEqual(10);
  });

  it('Response not paginated when limit is not a number', async () => {
    const person1 = new Person(person1Data);
    const person2 = new Person(person2Data);
    const person3 = new Person(person4Data);
    const person4 = new Person(person3Data);
    const person5 = new Person(person1Data);
    const person6 = new Person(person4Data);
    const person7 = new Person(person3Data);
    const person8 = new Person(person2Data);
    const person9 = new Person(person2Data);
    const person10 = new Person(person1Data);

    await person1.save();
    await person2.save();
    await person3.save();
    await person4.save();
    await person5.save();
    await person6.save();
    await person7.save();
    await person8.save();
    await person9.save();
    await person10.save();

    userData.auth_id = await testUtils.getAuthIdFromToken(token);
    const user = new User(userData);
    user.persons.push(person1._id, person2._id, person3._id, person4._id, person5._id, person6._id, person7._id, person8._id, person9._id, person10._id);
    await user.save();

    const { body: persons } = await supertest(app).get('/api/persons')
      .set('Accept', 'application/json')
      .set('Authorization', token)
      .query({
        page: 2,
        limit: "string"
      });

    expect(persons.length).toEqual(10);
  });

  it('Response not paginated when page is not a number', async () => {
    const person1 = new Person(person1Data);
    const person2 = new Person(person2Data);
    const person3 = new Person(person4Data);
    const person4 = new Person(person3Data);
    const person5 = new Person(person1Data);
    const person6 = new Person(person4Data);
    const person7 = new Person(person3Data);
    const person8 = new Person(person2Data);
    const person9 = new Person(person2Data);
    const person10 = new Person(person1Data);

    await person1.save();
    await person2.save();
    await person3.save();
    await person4.save();
    await person5.save();
    await person6.save();
    await person7.save();
    await person8.save();
    await person9.save();
    await person10.save();

    userData.auth_id = await testUtils.getAuthIdFromToken(token);
    const user = new User(userData);
    user.persons.push(person1._id, person2._id, person3._id, person4._id, person5._id, person6._id, person7._id, person8._id, person9._id, person10._id);
    await user.save();

    const { body: persons } = await supertest(app).get('/api/persons')
      .set('Accept', 'application/json')
      .set('Authorization', token)
      .query({
        page: "asdf",
        limit: 1
      });

    expect(persons.length).toEqual(10);
  });

  it('Empty array is returned when page=0', async () => {
    const person1 = new Person(person1Data);
    const person2 = new Person(person2Data);
    const person3 = new Person(person4Data);
    const person4 = new Person(person3Data);
    const person5 = new Person(person1Data);
    const person6 = new Person(person4Data);
    const person7 = new Person(person3Data);
    const person8 = new Person(person2Data);
    const person9 = new Person(person2Data);
    const person10 = new Person(person1Data);

    await person1.save();
    await person2.save();
    await person3.save();
    await person4.save();
    await person5.save();
    await person6.save();
    await person7.save();
    await person8.save();
    await person9.save();
    await person10.save();

    userData.auth_id = await testUtils.getAuthIdFromToken(token);
    const user = new User(userData);
    user.persons.push(person1._id, person2._id, person3._id, person4._id, person5._id, person6._id, person7._id, person8._id, person9._id, person10._id);
    await user.save();

    const { body: persons } = await supertest(app).get('/api/persons')
      .set('Accept', 'application/json')
      .set('Authorization', token)
      .query({
        page: 0,
        limit: 1
      });

    expect(persons.length).toEqual(0);
  });

  it('Empty array is returned when page<0', async () => {
    const person1 = new Person(person1Data);
    const person2 = new Person(person2Data);
    const person3 = new Person(person4Data);
    const person4 = new Person(person3Data);
    const person5 = new Person(person1Data);
    const person6 = new Person(person4Data);
    const person7 = new Person(person3Data);
    const person8 = new Person(person2Data);
    const person9 = new Person(person2Data);
    const person10 = new Person(person1Data);

    await person1.save();
    await person2.save();
    await person3.save();
    await person4.save();
    await person5.save();
    await person6.save();
    await person7.save();
    await person8.save();
    await person9.save();
    await person10.save();

    userData.auth_id = await testUtils.getAuthIdFromToken(token);
    const user = new User(userData);
    user.persons.push(person1._id, person2._id, person3._id, person4._id, person5._id, person6._id, person7._id, person8._id, person9._id, person10._id);
    await user.save();

    const { body: persons } = await supertest(app).get('/api/persons')
      .set('Accept', 'application/json')
      .set('Authorization', token)
      .query({
        page: -1,
        limit: 1
      });

    expect(persons.length).toEqual(0);
  });

  it('Empty array is returned when page requested is out of bound', async () => {
    const person1 = new Person(person1Data);
    const person2 = new Person(person2Data);
    const person3 = new Person(person4Data);
    const person4 = new Person(person3Data);
    const person5 = new Person(person1Data);
    const person6 = new Person(person4Data);
    const person7 = new Person(person3Data);
    const person8 = new Person(person2Data);
    const person9 = new Person(person2Data);
    const person10 = new Person(person1Data);

    await person1.save();
    await person2.save();
    await person3.save();
    await person4.save();
    await person5.save();
    await person6.save();
    await person7.save();
    await person8.save();
    await person9.save();
    await person10.save();

    userData.auth_id = await testUtils.getAuthIdFromToken(token);
    const user = new User(userData);
    user.persons.push(person1._id, person2._id, person3._id, person4._id, person5._id, person6._id, person7._id, person8._id, person9._id, person10._id);
    await user.save();

    const { body: persons } = await supertest(app).get('/api/persons')
      .set('Accept', 'application/json')
      .set('Authorization', token)
      .query({
        page: 2,
        limit: 7
      });

    expect(persons.length).toEqual(3);
  })
})
