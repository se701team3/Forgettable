import httpStatus from 'http-status';
import databaseOperations from '../../utils/test/db-handler';

import Person, { PersonModel } from '../../models/person.model';
import User, { UserModel } from '../../models/user.model';
import Encounter, { EncounterModel } from '../../models/encounter.model';
import personService from '../../services/person.service';
import app from '../../server';
import "dotenv/config";
import testUtils from '../../utils/test/test-utils';
import {Importance} from "../../enums/importance";
import Company, { CompanyModel } from 'src/models/company.model';
import companyService from '../../services/company.service';

const supertest = require('supertest');

let token;

beforeAll(async () => {
  token = await testUtils.generateTestAuthToken();

  await databaseOperations.connectDatabase();
});
afterEach(async () => databaseOperations.clearDatabase());
afterAll(async () => await databaseOperations.closeDatabase());

const user1Data : UserModel = {
  auth_id: null as any,
  first_name: 'Bing',
  last_name: 'Bong',
  encounters: [] as any,
  persons: [] as any,
  goals: [] as any,
  companies: [] as any
}

const person1Data: PersonModel = {
  first_name: 'Ping',
  last_name: 'Pong',
  interests: ['video games', 'hockey'],
  labels: ['Devop'],
  organisation: 'helloc',
  time_updated: new Date('2022-01-01'),
  importance_level: Importance.Very_Important,
  how_we_met: 'Hockey club',
  birthday: new Date('2002-12-12'),
  encounters: [] as any,
  companies: [] as any,
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
  labels: ['Devop'],
  organisation: 'helloc',
  time_updated: new Date('2022-02-23'),
  importance_level: Importance.Should_Remember,
  how_we_met: 'Skype',
  birthday: new Date('2001-07-16'),
  encounters: [] as any,
  companies: [] as any,
  first_met: null as any,
  gender: "male",
  image: null as any,
  location: null as any,
  social_media: null as any
}

const person3Data: PersonModel = {
  first_name: 'Billy',
  last_name: 'John',
  interests: ['surfing', 'cooking'],
  labels: ['Devop'],
  organisation: 'an organisation',
  time_updated: new Date('2022-02-23'),
  importance_level: Importance.Casual_Contact,
  how_we_met: 'At the park',
  birthday: new Date('2001-07-16'),
  encounters: [] as any,
  companies: [] as any,
  first_met: null as any,
  gender: "male",
  image: null as any,
  location: null as any,
  social_media: null as any
}

const person4Data: PersonModel = {
  first_name: 'Kelvin',
  last_name: 'Kong',
  interests: ['Studying', 'Winning'],
  labels: ['Devop'],
  organisation: 'Winnie',
  time_updated: new Date('2022-01-01'),
  importance_level: Importance.Very_Important,
  how_we_met: 'Bar',
  birthday: new Date('2002-12-12'),
  encounters: [] as any,
  companies: [] as any,
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
  persons: [] as any,
  goals: [] as any,
  companies: [] as any
}
const person5Data = {
  last_name: 'John',
  interests: ['surfing', 'cooking'],
  labels: ['Devop'],
  organisation: 'an organisation',
  time_updated: new Date('2022-02-23'),
  importance_level: Importance.Casual_Contact,
  how_we_met: 'At the park',
  birthday: new Date('2001-07-16'),
  encounters: [] as any,
  companies: [] as any,
  first_met: null as any,
  gender: "male",
  image: null as any,
  location: null as any,
  social_media: null as any
}

const person6Data = {
  first_name: 'Billy',
  last_name: 'John',
  interests: ['surfing', 'cooking'],
  labels: ['Devop'],
  organisation: 'an organisation',
  how_we_met: 'At the park',
  birthday: new Date('2001-07-16'),
  encounters: [] as any,
  companies: [] as any,
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
  latLong: [200, 200],
  persons: [] as any
}

const encounter2Data: EncounterModel = {
  title: "Encounter2",
  date: new Date('2022-02-24'),
  time_updated: new Date(Date.now()),
  description: 'Had lunch together',
  location: 'Auckland',
  latLong: [200, 200],
  persons: [] as any
}

const person7Data = {
  first_name: 'Yesterday',
  last_name: 'Birthday',
  interests: ['surfing', 'cooking'],
  labels: [],
  organisation: 'an organisation',
  how_we_met: 'At the park',
  birthday: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
  encounters: [] as any,
  first_met: null as any,
  gender: "male",
  image: null as any,
  location: null as any,
  social_media: null as any
}

const person8Data = {
  first_name: 'Tomorrow',
  last_name: 'Birthday',
  interests: ['surfing', 'cooking'],
  labels: ['Devop'],
  organisation: 'an organisation',
  how_we_met: 'At the park',
  birthday: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
  encounters: [] as any,
  first_met: null as any,
  gender: "male",
  image: null as any,
  location: null as any,
  social_media: null as any
}

const person9Data = {
  first_name: 'NextMonth',
  last_name: 'Birthday',
  interests: ['surfing', 'cooking'],
  labels: ['Backend'],
  organisation: 'an organisation',
  how_we_met: 'At the park',
  birthday: new Date(new Date().getTime() + 24 * 60 * 60 * 1000 * 30),
  encounters: [] as any,
  first_met: null as any,
  gender: "male",
  image: null as any,
  location: null as any,
  social_media: null as any
}


const companyData: CompanyModel = {
  name: "A Company",
  location: "Somewhere",
  description: "Important stuff",
  date_founded: new Date('2000-01-20'),
  time_updated: new Date(Date.now()),
  image: null as any,
  persons: [] as any,
}

describe('POST persons/', () => {
  it ('Can be created and stored in the user when all information is provided', async () => {
    // Create a new user
    await supertest(app).post('/api/users')
      .set('Accept', 'application/json')
      .set('Authorization', token)
      .send(user1Data);

    // Create a new person and store it in the user
    const { body: createdPerson } = await supertest(app).post('/api/persons')
      .set('Accept', 'application/json')
      .send(person1Data)
      .set("Authorization", token)
      .expect(httpStatus.CREATED);

    // Ensure user contains reference to the new person
    const { body: user } = await supertest(app).get("/api/users")
      .set("Accept", "application/json")
      .set("Authorization", token)
      .expect(httpStatus.OK);

    expect(user.persons).toEqual([createdPerson._id]);
  });

  it ('Can be created containing an id from an existing company', async () => {
    // Create a new user
    await supertest(app).post('/api/users')
      .set('Accept', 'application/json')
      .set('Authorization', token)
      .send(user1Data);

    const { body: company } = await supertest(app).post('/api/companies')
    .set('Accept', 'application/json')
    .set('Authorization', token)
    .send(companyData)
    .expect(httpStatus.CREATED);

    person1Data.companies.push(company._id);

    // Create a new person who is already employed to the company
    const { body: createdPerson } = await supertest(app).post('/api/persons')
      .set('Accept', 'application/json')
      .send(person1Data)
      .set("Authorization", token)
      .expect(httpStatus.CREATED);

    // Ensure user contains reference to the new person
    const { body: user } = await supertest(app).get("/api/users")
      .set("Accept", "application/json")
      .set("Authorization", token)
      .expect(httpStatus.OK);

    expect(user.persons).toEqual([createdPerson._id]);
    expect(createdPerson.companies[0]).toEqual(company._id);

    person1Data.companies = [];
  });

  it ('Can be created if "time_updated" is not provided', async() => {
    // Create a new user
    await supertest(app).post('/api/users')
      .set('Accept', 'application/json')
      .set('Authorization', token)
      .send(user1Data);

    // Create a new person and store it in the user
    const { body: createdPerson } = await supertest(app).post('/api/persons')
      .set('Accept', 'application/json')
      .send(person6Data)
      .set("Authorization", token)
      .expect(httpStatus.CREATED);

    // Ensure user contains reference to the new person
    const { body: user } = await supertest(app).get("/api/users")
      .set("Accept", "application/json")
      .set("Authorization", token)
      .expect(httpStatus.OK);

    expect(user.persons).toEqual([createdPerson._id]);
  });

  it ('Cannot be created if a first name is not provided', async ()=> {
    // Create a new user
    await supertest(app).post('/api/users')
      .set('Accept', 'application/json')
      .set('Authorization', token)
      .send(user1Data);

    // Create a new person without a first name and try to store it in the user
    await supertest(app).post('/api/persons')
      .set('Accept', 'application/json')
      .send(person5Data)
      .set("Authorization", token)
      .expect(httpStatus.BAD_REQUEST);
  });

  it ('Returns "Unauthorized" if the user does not have a valid auth_id', async () => {
    await supertest(app).get(`/api/persons/FAKE_PERSON_ID`)
      .set('Accept','application/json')
      .set("Authorization", "FAKE_AUTH_TOKEN")
      .expect(httpStatus.UNAUTHORIZED);
  });
});

describe('PUT persons/', () => {
  it ('Can be updated correctly', async () => {
    // Create a new user
    await supertest(app).post('/api/users')
      .set('Accept', 'application/json')
      .set('Authorization', token)
      .send(user1Data);

    // Create a new person and store it in the user
    const { body : newPerson } = await supertest(app).post('/api/persons')
      .set('Accept', 'application/json')
      .send(person1Data)
      .set("Authorization", token)
      .expect(httpStatus.CREATED);

    // Change the person's data
    const changedLocation = 'Someplace else';
    person1Data.location = changedLocation;

    // Update the person and check it was successful
    await supertest(app).put(`/api/persons/${newPerson._id}`)
      .set('Accept', 'application/json')
      .send(person1Data)
      .set("Authorization", token)
      .expect(httpStatus.NO_CONTENT);
    
    // Retrieve person from database, and check that the updated person contains the changed location
    const { body: updatedPerson } = await supertest(app).get(`/api/persons/${newPerson._id}`)
      .set('Accept','application/json')
      .set("Authorization", token)
      .expect(httpStatus.OK);

    expect(updatedPerson.location).toEqual(changedLocation);
  });
});

describe('GET persons/', () => {
  it ('Only returns people associated with a user', async () => {
    const person1ID = (await new Person(person1Data).save()).id;
    const person2ID = (await new Person(person2Data).save()).id;
    const person3ID = (await new Person(person3Data).save()).id;

    user1Data.persons = [person1ID, person2ID];
    user1Data.auth_id = await testUtils.getAuthIdFromToken(token);
    const user = await new User(user1Data).save();

    const { body: retrievedPersons } = await supertest(app)
      .get('/api/persons')
      .set('Accept', 'application/json')
      .set('Authorization', token)
      .expect(httpStatus.OK)

    expect(retrievedPersons).toHaveLength(2);
    expect(retrievedPersons[0]._id).toEqual(person1ID);
    expect(retrievedPersons[1]._id).toEqual(person2ID);
  });

  it ('Correctly filters persons by the "term" query param', async () => {
    person1Data.first_name = "Bing"
    const person1ID = (await new Person(person1Data).save()).id;
    person2Data.first_name = "Billy"
    const person2ID = (await new Person(person2Data).save()).id;
    person3Data.first_name = "John"
    const person3ID = (await new Person(person3Data).save()).id;

    user1Data.persons = [person1ID, person2ID, person3ID];
    user1Data.auth_id = await testUtils.getAuthIdFromToken(token);
    await new User(user1Data).save();

    const { body: retrievedPersons } = await supertest(app)
      .get('/api/persons')
      .set('Accept', 'application/json')
      .set('Authorization', token)
      .query({ term: 'bi' })
      .expect(httpStatus.OK)

    expect(retrievedPersons).toHaveLength(2);
    expect(retrievedPersons[0].first_name).toBe("Bing");
    expect(retrievedPersons[1].first_name).toBe("Billy");
  });

  it ('Returns all persons if the "term" query param is empty', async () => {
    const person1ID = (await new Person(person1Data).save()).id;
    const person2ID = (await new Person(person2Data).save()).id;
    const person3ID = (await new Person(person3Data).save()).id;

    user1Data.persons = [person1ID, person2ID, person3ID];
    user1Data.auth_id = await testUtils.getAuthIdFromToken(token);
    await new User(user1Data).save();

    const { body: retrievedPersons } = await supertest(app)
      .get('/api/persons')
      .set('Accept', 'application/json')
      .set('Authorization', token)
      .query({ term: "" })
      .expect(httpStatus.OK)

    expect(retrievedPersons).toHaveLength(3);
  });

  it ('Does not return duplicates if all persons match the "term" query', async () => {
    person1Data.first_name = "A test name";
    const person1ID = (await new Person(person1Data).save()).id;
    const person2ID = (await new Person(person1Data).save()).id;
    const person3ID = (await new Person(person1Data).save()).id;
    const person4ID = (await new Person(person1Data).save()).id;
    const person5ID = (await new Person(person1Data).save()).id;

    user1Data.persons = [person1ID, person2ID, person3ID, person4ID, person5ID];
    user1Data.auth_id = await testUtils.getAuthIdFromToken(token);
    await new User(user1Data).save();

    const { body: retrievedPersons } = await supertest(app)
      .get('/api/persons')
      .set('Accept', 'application/json')
      .set('Authorization', token)
      .query({ term: "A test name" })
      .expect(httpStatus.OK)

    // Loop through each person id in user1, and check if each person is only found once in retrievedPersons
    user1Data.persons.forEach(personID => {
      expect(retrievedPersons.filter(person => person._id === personID)).toHaveLength(1);
    })
  });

  it ('Returns "OK" with an empty array if the user has no persons', async () => {
    await new Person(person1Data);
    await new Person(person2Data).save();
    await new Person(person3Data).save();

    user1Data.persons = [];
    user1Data.auth_id = await testUtils.getAuthIdFromToken(token);
    await new User(user1Data).save();

    const { body: retrievedPersons } = await supertest(app)
      .get('/api/persons')
      .set('Accept', 'application/json')
      .set('Authorization', token)
      .expect(httpStatus.OK)

    expect(retrievedPersons).toHaveLength(0);
  });

  it ('Returns "OK" with an empty array if no persons match the "term" query param', async () => {
    const person1ID = (await new Person(person1Data).save()).id;
    const person2ID = (await new Person(person2Data).save()).id;
    const person3ID = (await new Person(person3Data).save()).id;

    user1Data.persons = [person1ID, person2ID, person3ID];
    user1Data.auth_id = await testUtils.getAuthIdFromToken(token);
    await new User(user1Data).save();

    const { body: retrievedPersons } = await supertest(app)
      .get('/api/persons')
      .set('Accept', 'application/json')
      .set('Authorization', token)
      .query({ term: "a query that no persons will match" })
      .expect(httpStatus.OK)

    expect(retrievedPersons).toHaveLength(0);
  });

  it ('Returns "Unauthorized" if the user does not have a valid auth_id', async () => {
    await supertest(app).get(`/api/persons/FAKE_PERSON_ID`)
      .set('Accept','application/json')
      .set("Authorization", "FAKE_AUTH_TOKEN")
      .expect(httpStatus.UNAUTHORIZED);
  });
});

describe('GET persons/:id', () => {
  it ('Can be retrieved by id', async () => {
    // Create a new user
    await supertest(app).post('/api/users')
      .set('Accept', 'application/json')
      .set('Authorization', token)
      .send(user1Data);

    // Create a new person and store it in the user
    const { body: createdPerson } = await supertest(app).post('/api/persons')
      .set('Accept', 'application/json')
      .send(person1Data)
      .set("Authorization", token)
      .expect(httpStatus.CREATED);

    // Attempt to retrieve it
    const { body: retrievedPerson } = await supertest(app).get(`/api/persons/${createdPerson._id}`)
      .set('Accept','application/json')
      .set("Authorization", token)
      .expect(httpStatus.OK);

    expect(retrievedPerson._id).toEqual(createdPerson._id);
  });

  it ('Is not retrieved if the user does not contain it', async () => {
    // Create a new user
    const { body: user } = await supertest(app).post('/api/users')
      .set('Accept', 'application/json')
      .set('Authorization', token)
      .send(user1Data);

    // Create three persons and store only the first two in the user
    const { body : person1 } = await supertest(app).post('/api/persons')
      .set('Accept', 'application/json')
      .send(person1Data)
      .set("Authorization", token)
      .expect(httpStatus.CREATED);

    const { body : person2 } = await supertest(app).post('/api/persons')
      .set('Accept', 'application/json')
      .send(person2Data)
      .set("Authorization", token)
      .expect(httpStatus.CREATED);  

    const person3 = await personService.createPerson(person3Data);

    // Ensure only person1 and person2 can be retrieved
    await supertest(app).get(`/api/persons/${person1._id}`)
      .set('Accept','application/json')
      .set("Authorization", token)
      .expect(httpStatus.OK);

    await supertest(app).get(`/api/persons/${person2._id}`)
      .set('Accept','application/json')
      .set("Authorization", token)
      .expect(httpStatus.OK);

    await supertest(app).get(`/api/persons/${person3._id}`)
      .set('Accept','application/json')
      .set("Authorization", token)
      .expect(httpStatus.NOT_FOUND);
  });

  it ('Returns "Unauthorized" if the user does not have a valid auth_id', async () => {
      await supertest(app).get(`/api/persons/FAKE_PERSON_ID`)
        .set('Accept','application/json')
        .set("Authorization", "FAKE_AUTH_TOKEN")
        .expect(httpStatus.UNAUTHORIZED);
  });

  it ('Contains embedded encounters', async () => {
    await supertest(app).post('/api/users')
      .set('Accept', 'application/json')
      .set('Authorization', token)
      .send(user1Data);

  // Create a new person and store it in the user
    const { body: createdPerson } = await supertest(app).post('/api/persons')
      .set('Accept', 'application/json')
      .send(person1Data)
      .set("Authorization", token)
      .expect(httpStatus.CREATED);

      const { body: createdPerson2 } = await supertest(app).post('/api/persons')
      .set('Accept', 'application/json')
      .send(person2Data)
      .set("Authorization", token)
      .expect(httpStatus.CREATED);  

    encounter1Data.persons = [createdPerson._id, createdPerson2._id];

    await supertest(app).post('/api/encounters')
      .set('Accept', 'application/json')
      .send(encounter1Data)
      .set("Authorization", token)
      .expect(httpStatus.CREATED);

    const { body: retrievedPerson } =  await supertest(app).get(`/api/persons/${createdPerson._id}`)
      .set('Accept','application/json')
      .set("Authorization", token)
      .expect(httpStatus.OK);

    expect(retrievedPerson.encounters[0].title).toEqual(encounter1Data.title)
  })
});

describe('GET persons/companies/:id', () => {
  it ('Returns "Unauthorized" if the user does not have a valid auth_id', async () => {

    await supertest(app).get(`/api/persons/companies/FAKE_COMPANY_ID`)
      .set('Accept', 'application/json')
      .set('Authorization', 'FAKE_AUTH_ID')
      .expect(httpStatus.UNAUTHORIZED);
    
  });

  it ('Returns "Not Found" if company not in user', async () => {
    // Create a new user
    await supertest(app).post('/api/users')
      .set('Accept', 'application/json')
      .set('Authorization', token)
      .send(user1Data);

    const person = await personService.createPerson(person1Data);
    companyData.persons = [person._id];
    const company = await companyService.createCompany(companyData);

    await supertest(app).get(`/api/persons/companies/${company._id}`)
      .set('Accept', 'application/json')
      .set('Authorization', token)
      .expect(httpStatus.NOT_FOUND);
    
    companyData.persons = [];
  });

  it ('Can be retrieved by id', async () => {
    // Create a new user
    await supertest(app).post('/api/users')
      .set('Accept', 'application/json')
      .set('Authorization', token)
      .send(user1Data);

    // Create new people 
    const { body: personOne } = await supertest(app).post('/api/persons')
      .set('Accept', 'application/json')
      .send(person1Data)
      .set("Authorization", token)
      .expect(httpStatus.CREATED);
    const { body: personTwo } = await supertest(app).post('/api/persons')
      .set('Accept', 'application/json')
      .send(person1Data)
      .set("Authorization", token)
      .expect(httpStatus.CREATED);

    companyData.persons = [personOne._id, personTwo._id];
    // Create a new company
    const { body: company } = await supertest(app).post('/api/companies')
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .send(companyData)
            .expect(httpStatus.CREATED);
    
    const { body: persons } = await supertest(app).get(`/api/persons/companies/${company._id}`)
    .set('Accept', 'application/json')
    .set('Authorization', token)

    expect(persons.length).toEqual(2)
    expect(persons[0]).toHaveProperty('_id', personOne._id.toString());
    expect(persons[1]).toHaveProperty('_id', personTwo._id.toString());
    
    companyData.persons = [];
  });

});

describe('GET /persons', () => {

  async function populateDbWithUsersPersons() {
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
  
    const storedPersonIds = [person1._id, person2._id, person3._id, person4._id, person5._id, person6._id, person7._id, person8._id, person9._id, person10._id];
  
    return storedPersonIds;
  }

  it('Response paginated and returns correct number of entries', async () => {
    await populateDbWithUsersPersons();

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
    const storedPersonIds = await populateDbWithUsersPersons();

    const { body: persons } = await supertest(app).get('/api/persons')
      .set('Accept', 'application/json')
      .set('Authorization', token)
      .query({
        limit: 2,
        page: 4
      });

    expect(persons[0]).toHaveProperty('_id', storedPersonIds[6]._id.toString());
    expect(persons[1]).toHaveProperty('_id', storedPersonIds[7]._id.toString());
  });

  it('Response not paginated when limit is not given', async () => {
    await populateDbWithUsersPersons();

    const { body: persons } = await supertest(app).get('/api/persons')
      .set('Accept', 'application/json')
      .set('Authorization', token)
      .query({
        page: 4
      });

    expect(persons.length).toEqual(10);
  });

  it('Response not paginated when page is not given', async () => {
    await populateDbWithUsersPersons();

    const { body: persons } = await supertest(app).get('/api/persons')
      .set('Accept', 'application/json')
      .set('Authorization', token)
      .query({
        limit: 4,
      });

    expect(persons.length).toEqual(10);
  });

  it('Response not paginated when limit is not a number', async () => {
    await populateDbWithUsersPersons();

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
    await populateDbWithUsersPersons();

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
    await populateDbWithUsersPersons();

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
    await populateDbWithUsersPersons();

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
    await populateDbWithUsersPersons();

    const { body: persons } = await supertest(app).get('/api/persons')
      .set('Accept', 'application/json')
      .set('Authorization', token)
      .query({
        page: 2,
        limit: 7
      });

    expect(persons.length).toEqual(3);
  })  
});
// Delete Person 200

describe('DELETE /person/:id', () => {

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
      
      expect(await Person.findById({_id: personOneId})).toEqual(null);
      expect(await Person.findById({_id: personTwoId})).toEqual(null);
  })

// Delete Person 404

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


// Delete Person 409
  it('Sends CONFLICT if Person ID is not in Collection: ', async () => {
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
          .expect(httpStatus.CONFLICT);

      // Check that invalid ID is deleted from User
      const newUser = await User.findOne({auth_id: user.auth_id});
      expect(newUser?.persons).not.toContain(invalidPersonId);
  })
})

describe('GET /birthdays', () => {

  async function populateDbWithUsersPersons() {
    const person1 = new Person(person7Data);
    const person2 = new Person(person8Data);
    const person3 = new Person(person9Data);    
    
    await person1.save();
    await person2.save();
    await person3.save();
    
    userData.auth_id = await testUtils.getAuthIdFromToken(token);
    const user = new User(userData);
    user.persons.push(person1._id, person2._id, person3._id);
    await user.save();
  
    const storedPersonIds = [person1._id, person2._id, person3._id];
  
    return storedPersonIds;
  }

  it('Returns correct number of entries', async () => {
    await populateDbWithUsersPersons();
    const { body: people }  = await supertest(app).get('/api/birthdays')
      .set('Accept', 'application/json')
      .set('Authorization', token);

    expect(people.length).toEqual(2);
  });

  it('Returns the correct page of entries', async () => {
    const storedPersonIds = await populateDbWithUsersPersons();

    const { body: people }   = await supertest(app).get('/api/birthdays')
      .set('Accept', 'application/json')
      .set('Authorization', token);

    expect(people[0]).toHaveProperty('_id', storedPersonIds[1]._id.toString());
    expect(people[1]).toHaveProperty('_id', storedPersonIds[2]._id.toString());
  });

  it('Empty array is returned when no-one has a birthdays in a given data-range', async () => {
    const { body: people } = await supertest(app).get('/api/birthdays')
      .set('Accept', 'application/json')
      .set('Authorization', token);

    expect(people).toEqual({});
  });
});

describe('GET /label', () => {

  async function populateDbWithUsersPersons() {
    const person1 = new Person(person7Data);
    const person2 = new Person(person8Data);
    const person3 = new Person(person9Data);    
    
    await person1.save();
    await person2.save();
    await person3.save();
    
    userData.auth_id = await testUtils.getAuthIdFromToken(token);
    const user = new User(userData);
    user.persons.push(person1._id, person2._id, person3._id);
    await user.save();
  
    const storedPersonIds = [person1._id, person2._id, person3._id];
  
    return storedPersonIds;
  }

  it('Returns correct number of entries', async () => {
    await populateDbWithUsersPersons();
    const { body: people }  = await supertest(app).get('/api/persons/label?label=Devop')
      .set('Accept', 'application/json')
      .set('Authorization', token);

    expect(people.length).toEqual(1);
  });

  it('Empty array is returned when there is none with the label', async () => {
    const { body: people } = await supertest(app).get('/api/persons/label?label=frontend')
      .set('Accept', 'application/json')
      .set('Authorization', token);

    expect(people).toEqual({});
  });
});