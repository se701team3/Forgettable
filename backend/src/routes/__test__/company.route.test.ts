import databaseOperations from '../../utils/test/db-handler';
import User, { UserModel } from '../../models/user.model';
import Person, { PersonModel } from '../../models/person.model';
import Company, { CompanyModel } from '../../models/company.model';
import app from '../../server';
import httpStatus from "http-status";
import testUtils from '../../utils/test/test-utils';
import 'dotenv/config';
import companieservice from '../../services/company.service';
import personService from 'src/services/person.service';
import { UserRecord } from 'firebase-admin/lib/auth/user-record';
import {Importance} from "../../enums/importance";

const supertest = require('supertest');

let token;

beforeAll(async () => {

    token = await testUtils.generateTestAuthToken();

    await databaseOperations.connectDatabase();
});
afterEach(async () => databaseOperations.clearDatabase());
afterAll(async () => await databaseOperations.closeDatabase());

const user1Data = {
    auth_id: null as any,
    first_name: 'Bing',
    last_name: 'Bong',
    encounters: [] as any,
    persons: [] as any,
    companies: [] as any
}

const user2Data: UserModel = {
    auth_id: null as any,
    first_name: 'Adam',
    last_name: 'Weng',
    encounters: [] as any,
    goals: [] as any,
    persons: [] as any,
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

const companyData: CompanyModel = {
    name: "A Company",
    location: "Somewhere",
    description: "Important stuff",
    date_founded: new Date('2000-01-20'),
    time_updated: new Date(Date.now()),
    image: null as any,
    persons: [] as any,
  }

const company1Data: CompanyModel = {
    name: "The Organisation",
    location: "Underground",
    description: "The Organisation sees everything",
    date_founded: new Date('1990-01-20'),
    time_updated: new Date(Date.now()),
    image: Buffer.from([0x62, 0x75, 0x66, 0x66, 0x65, 0x72]),
    persons: [] as any,
  }

  const company2Data: CompanyModel = {
    name: "The League",
    location: "Unknown",
    description: "Mystery",
    date_founded: null as any,
    time_updated: new Date(Date.now()),
    image: Buffer.from([0x62, 0x75, 0x66, 0x66, 0x65, 0x72]),
    persons: [] as any,
  }

  const company3Data = {
    name: "INGSOC",
    description: "Big Brother is watching you",
    date_founded: new Date('1984-01-01'),
    time_updated: new Date(Date.now()),
    image: Buffer.from([0x62, 0x75, 0x66, 0x66, 0x65, 0x72]),
    persons: [] as any,
  }

  const company4Data = {
    name: "Band of Assassins that Go Around Killing People",
    location: "Mars",
    date_founded: new Date('1980-10-20'),
    time_updated: new Date(Date.now()),
    image: Buffer.from([0x62, 0x75, 0x66, 0x66, 0x65, 0x72]),
    persons: [] as any,
  }

  const company5Data: CompanyModel = {
    name: "",
    location: "Clouds",
    description: "Unnamed company",
    date_founded: new Date('1030-8-20'),
    time_updated: new Date(Date.now()),
    image: Buffer.from([0x62, 0x75, 0x66, 0x66, 0x65, 0x72]),
    persons: [] as any,
  }

  const company6Data = {
    name: "Random Company",
    location: "To be confirmed",
    description: "Not much is known yet",
    date_founded: new Date('2022-02-03'),
    time_updated: new Date(Date.now()),
    persons: [] as any,
  }

  const company7Data = {
    name: "Seven Seven Seven",
    location: "Sevens",
    description: "Seven",
    date_founded: new Date('777-07-07'),
    time_updated: new Date(Date.now()),
    image: Buffer.from([0x62, 0x75, 0x66, 0x66, 0x65, 0x72]),
    persons: null as any,
  }

describe('POST /companies', () => {
    it('Successfully creates a company with all info given', async () => {
        await supertest(app).post('/api/users')
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .send(user1Data);

        const { body: person } = await supertest(app).post('/api/persons')
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .send(person1Data)

        company1Data.persons.push(person._id);

        await supertest(app).post('/api/companies')
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .send(company1Data)
            .expect(httpStatus.CREATED);

        //Re-initializes variables so that other tests are not affected
        company1Data.persons = [];
    })


    it('Successfully creating a company without date_founded field', async () => {
        await supertest(app).post('/api/users')
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .send(user1Data);

        const { body: person } = await supertest(app).post('/api/persons')
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .send(person1Data)

        company2Data.persons.push(person._id);

        const { body: newcompany } = await supertest(app).post('/api/companies')
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .send(company2Data)
            .expect(httpStatus.CREATED);

        expect(newcompany.date).not.toEqual('');

        company2Data.persons = [];
    })

    it('Successfully creating a company without a location field', async () => {
        await supertest(app).post('/api/users')
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .send(user1Data);

        const { body: person } = await supertest(app).post('/api/persons')
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .send(person1Data)

        company3Data.persons.push(person._id);

        const { body: newcompany } = await supertest(app).post('/api/companies')
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .send(company3Data)
            .expect(httpStatus.CREATED);

        expect(newcompany.location).toEqual(undefined);

        company3Data.persons = [];
    })

    it('Successfully creating a company without a description field', async () => {
        await supertest(app).post('/api/users')
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .send(user1Data);

        const { body: person } = await supertest(app).post('/api/persons')
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .send(person1Data)

        company4Data.persons.push(person._id);

        const { body: newcompany } = await supertest(app).post('/api/companies')
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .send(company4Data)
            .expect(httpStatus.CREATED);

        expect(newcompany.description).toEqual(undefined);

        company4Data.persons = [];
    })

    it('Successfully creating a company without an image field', async () => {
        await supertest(app).post('/api/users')
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .send(user1Data);

        const { body: person } = await supertest(app).post('/api/persons')
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .send(person1Data)

        company6Data.persons.push(person._id);

        const { body: newcompany } = await supertest(app).post('/api/companies')
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .send(company6Data)
            .expect(httpStatus.CREATED);

        expect(newcompany.image).toEqual(undefined);

        company6Data.persons = [];
    })

    it('Successfully creating a company with empty persons field', async () => {
        await supertest(app).post('/api/users')
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .send(user1Data);

        const { body: newcompany } = await supertest(app).post('/api/companies')
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .send(company6Data)
            .expect(httpStatus.CREATED);

        expect(newcompany.persons).toEqual([])
    })

    it('Successfully creating a company with a null persons field', async () => {
        await supertest(app).post('/api/users')
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .send(user1Data);

        const { body: newcompany } = await supertest(app).post('/api/companies')
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .send(company7Data)
            .expect(httpStatus.CREATED);

        expect(newcompany.persons).toEqual(null)
    })

    it('Successful company creation return correct company data', async () => {
        await supertest(app).post('/api/users')
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .send(user1Data);

        const { body: person } = await supertest(app).post('/api/persons')
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .send(person1Data)
            .expect(httpStatus.CREATED);

        company1Data.persons.push(person._id);

        const { body: storedcompany } = await supertest(app).post('/api/companies')
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .send(company1Data);

        expect(storedcompany.name).toEqual(company1Data.name);
        expect(storedcompany.description).toEqual(company1Data.description);
        expect(new Date(storedcompany.date_founded)).toEqual(company1Data.date_founded);
        expect(storedcompany.location).toEqual(company1Data.location);
        company1Data.persons.map((person) => {
            expect(storedcompany.persons).toContain(person);
        })

        company1Data.persons = [];
    })

    it('Failed to create an company without a name', async () => {
        await supertest(app).post('/api/users')
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .send(user1Data);

        const { body: person } = await supertest(app).post('/api/persons')
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .send(person1Data);

        company5Data.persons.push(person._id);

        await supertest(app).post('/api/companies')
            .set('Authorization', token)
            .set('Accept', 'application/json')
            .send(company5Data)
            .expect(httpStatus.BAD_REQUEST);

        company5Data.persons = [];
    })

    it('Failed to create without an auth token', async () => {
        await supertest(app).post('/api/users')
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .send(user1Data);

        const { body: person } = await supertest(app).post('/api/persons')
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .send(person1Data);

        company1Data.persons.push(person._id);

        await supertest(app).post('/api/companies')
            .set('Accept', 'application/json')
            .send(company1Data)
            .expect(httpStatus.UNAUTHORIZED);

        company1Data.persons = [];
    })

    it('Company not stored in database when request is unsuccessful', async () => {
        await supertest(app).post('/api/users')
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .send(user1Data);

        const { body: person } = await supertest(app).post('/api/persons')
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .send(person1Data)

        company5Data.persons.push(person._id);

        const { body: company } = await supertest(app).post('/api/companies')
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .send(company5Data);

        await supertest(app).get(`/api/companies/${company._id}`)
            .set('Authorization', token)
            .expect(httpStatus.NOT_FOUND)

        const { body: storedPerson } = await supertest(app).get(`/api/persons/${person._id}`)
            .set('Authorization', token)
            .expect(httpStatus.OK);
        expect(storedPerson.companies).not.toContain(company._id);

        const { body: storedUser } = await supertest(app).get('/api/users')
            .set('Authorization', token)
            .expect(httpStatus.OK);
        expect(storedUser).not.toContain(company._id);

        company5Data.persons = [];
    })
})

describe('GET /companies/:id', () => {
    it ('Successfully retrieves a company with a given json', async () => {
        const newcompanyId = await createUserPersonCompany(token);

        // retrieve the specified company
        const company = await supertest(app)
            .get(`/api/companies/${newcompanyId}`)
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .expect(httpStatus.OK)

        expect(company._body.description).toBe(companyData.description)
        expect(company._body.location).toEqual(companyData.location)

    });
  
    it('Fails when called with invalid company object ID', async () => {
        await createUserPersonCompany(token)
        // update an company of id that does not exist
        await supertest(app)
            .get(`/api/companies/${123}`)
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .expect(httpStatus.NOT_FOUND)
    });

    it('Fails when company object ID that does not exist', async () => {
        // update an company of id that does not exist
        await supertest(app)
            .get(`/api/companies/622b36166bb3a4e3a1ef62f1`)
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .expect(httpStatus.NOT_FOUND)
    });
    it('Fails when user does not exist for given token', async ()=>{
        await supertest(app)
            .get(`/api/companies/1234567890`)
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .expect(httpStatus.NOT_FOUND)
    })
    it('Fails when user is not authenticated', async ()=>{
        await supertest(app)
            .get(`/api/companies/1234567890`)
            .set('Accept', 'application/json')
            .expect(httpStatus.UNAUTHORIZED)
    })
});

describe('PUT /companies/:id ', () => {
    it('Successfully updates a company with a given json', async () => {
        const newcompanyId = await createUserPersonCompany(token);

        // update a company with 'company2Data'
        await supertest(app)
            .put(`/api/companies/${newcompanyId}`)
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .send(company2Data)
            .expect(httpStatus.NO_CONTENT) // since it's no content, need to get this company to check updated fields

        // retrieve the updated company and compare
        const updatedcompany = await supertest(app)
            .get(`/api/companies/${newcompanyId}`)
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .send(company2Data)
            .expect(httpStatus.OK)

        expect(updatedcompany._body.description).toBe(company2Data.description)
        expect(updatedcompany._body.location).toEqual(company2Data.location)
    });

    it('Successfully add people to a company', async () => {
        await supertest(app).post('/api/users')
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .send(user1Data);

        const { body: newcompany } = await supertest(app).post('/api/companies')
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .send(company1Data)
            .expect(httpStatus.CREATED);

        // create people to add
        const person = await supertest(app)
        .post('/api/persons')
        .set('Accept', 'application/json')
        .set('Authorization', token)
        .send(person1Data)

        const secondPerson = await supertest(app)
        .post('/api/persons')
        .set('Accept', 'application/json')
        .set('Authorization', token)
        .send(person2Data)

        company1Data.persons = [person._body._id, secondPerson._body._id];

        await supertest(app)
            .put(`/api/companies/${newcompany._id}`)
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .send(company1Data)
            .expect(httpStatus.NO_CONTENT) // since it's no content, need to get this company to check updated fields

        // retrieve the updated company and compare
        const { body: updatedcompany } = await supertest(app)
            .get(`/api/companies/${newcompany._id}`)
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .send(company1Data)
            .expect(httpStatus.OK)

        expect(updatedcompany.persons.length).toBe(2)
        expect(updatedcompany.persons[0]._id).toEqual(company1Data.persons[0])
        expect(updatedcompany.persons[1]._id).toEqual(company1Data.persons[1])
        company1Data.persons = [];
    });

    it('Fails when called with invalid company object ID', async () => {
        await createUserPersonCompany(token)
        // update an company of id that does not exist
        await supertest(app)
            .put(`/api/companies/${123}`)
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .send(companyData)
            .expect(httpStatus.NOT_FOUND)
    });

    it('Fails when company object ID that does not exist', async () => {
        // update an company of id that does not exist
        await supertest(app)
            .put(`/api/companies/622b36166bb3a4e3a1ef62f1`)
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .send(companyData)
            .expect(httpStatus.NOT_FOUND)
    });
    it('Fails when user does not exist for given token', async ()=>{
        await supertest(app)
            .put(`/api/companies/1234567890`)
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .expect(httpStatus.NOT_FOUND)
    })
    it('Fails when user is not authenticated', async ()=>{
        await supertest(app)
            .put(`/api/companies/1234567890`)
            .set('Accept', 'application/json')
            .expect(httpStatus.UNAUTHORIZED)
    })
});

describe('GET /companies pagination', () => {

    async function populateDbWithUserscompanies() {
        const company1 = new Company(company1Data);
        const company2 = new Company(company2Data);
        const company3 = new Company(company4Data);
        const company4 = new Company(company3Data);
        const company5 = new Company(company1Data);
        const company6 = new Company(company2Data);
        const company7 = new Company(company2Data);
        const company8 = new Company(company3Data);
        const company9 = new Company(company4Data);
        const company10 = new Company(company1Data);
    
        await company1.save();
        await company2.save();
        await company3.save();
        await company4.save();
        await company5.save();
        await company6.save();
        await company7.save();
        await company8.save();
        await company9.save();
        await company10.save();
    
        user2Data.auth_id = await testUtils.getAuthIdFromToken(token);
        const user = new User(user2Data);
        user.companies.push(company1._id, company2._id, company3._id, company4._id, company5._id, company6._id, company7._id, company8._id, company9._id, company10._id);
        await user.save();
    
        const storedcompanyIds = [company1._id, company2._id, company3._id, company4._id, company5._id, company6._id, company7._id, company8._id, company9._id, company10._id];
    
        return storedcompanyIds;
    }

    it('Response paginated and returns correct number of entries', async () => {
        await populateDbWithUserscompanies();

        const { body: companies } = await supertest(app).get('/api/companies')
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .query({
                limit: 3,
                page: 1
            });

        expect(companies.length).toEqual(3);
    });

    it('Response paginated and returns the correct page of entries', async () => {
        const storedcompanyIds = await populateDbWithUserscompanies();

        const { body: companies } = await supertest(app).get('/api/companies')
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .query({
                limit: 3,
                page: 2
            });

        expect(companies[0]).toHaveProperty('_id', storedcompanyIds[3]._id.toString());
        expect(companies[1]).toHaveProperty('_id', storedcompanyIds[4]._id.toString());
        expect(companies[2]).toHaveProperty('_id', storedcompanyIds[5]._id.toString());

    });

    it('Response not paginated when limit is not given', async () => {
        await populateDbWithUserscompanies();

        const { body: companies } = await supertest(app).get('/api/companies')
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .query({
                page: 4
            });

        expect(companies.length).toEqual(10);
    });

    it('Response not paginated when page is not given', async () => {
        await populateDbWithUserscompanies();

        const { body: companies } = await supertest(app).get('/api/companies')
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .query({
                limit: 5,
            });

        expect(companies.length).toEqual(10);
    });

    it('Response not paginated when limit is not a number', async () => {
        await populateDbWithUserscompanies();

        const { body: companies } = await supertest(app).get('/api/companies')
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .query({
                limit: "four",
                page: 2
            });

        expect(companies.length).toEqual(10);
    });

    it('Response not paginated when page is not a number', async () => {
        await populateDbWithUserscompanies();

        const { body: companies } = await supertest(app).get('/api/companies')
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .query({
                limit: 5,
                page: "page"
            });

        expect(companies.length).toEqual(10);
    });

    it('Empty array is returned when page=0', async () => {
        await populateDbWithUserscompanies();

        const { body: companies } = await supertest(app).get('/api/companies')
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .query({
                limit: 4,
                page: 0
            });

        expect(companies.length).toEqual(0);
    });

    it('Empty array is returned when page<0', async () => {
        await populateDbWithUserscompanies();

        const { body: companies } = await supertest(app).get('/api/companies')
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .query({
                limit: 2,
                page: -5
            });

        expect(companies.length).toEqual(0);
    });

    it('Empty array is returned when page requested is out of bound', async () => {
        await populateDbWithUserscompanies();

        const { body: companies } = await supertest(app).get('/api/companies')
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .query({
                limit: 7,
                page: 3
            });

        expect(companies.length).toEqual(0);
    });

    it('Number of response returned is less than limit if (page * limit) < total entries', async () => {
        await populateDbWithUserscompanies();

        const { body: companies } = await supertest(app).get('/api/companies')
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .query({
                limit: 8,
                page: 2
            });

        expect(companies.length).toEqual(2);
    })
})
describe('GET companies/', () => {
    it ('Only return companies associated with the user', async () => {
      const company1ID = (await new Company(company1Data).save()).id;
      const company2ID = (await new Company(company2Data).save()).id;
      await new Company(company4Data).save();
  
      user1Data.companies = [company1ID, company2ID];
      user1Data.auth_id = await testUtils.getAuthIdFromToken(token);
      await new User(user1Data).save();
  
      const { body: retrievedcompanies } = await supertest(app)
        .get('/api/companies')
        .set('Accept', 'application/json')
        .set('Authorization', token)
        .expect(httpStatus.OK)
  
      expect(retrievedcompanies).toHaveLength(2);
      expect(retrievedcompanies[0]._id).toEqual(company1ID);
      expect(retrievedcompanies[1]._id).toEqual(company2ID);
    });

    it ('Return all companies if the "term" query param is empty', async () => {
        const company1ID = (await new Company(company1Data).save()).id;
        const company2ID = (await new Company(company2Data).save()).id;
        const company4ID = (await new Company(company4Data).save()).id;
    
        user1Data.companies = [company1ID, company2ID, company4ID];
        user1Data.auth_id = await testUtils.getAuthIdFromToken(token);
        await new User(user1Data).save();
    
        const { body: retrievedcompanies } = await supertest(app)
          .get('/api/companies')
          .set('Accept', 'application/json')
          .set('Authorization', token)
          .query({ term: "" })
          .expect(httpStatus.OK)
    
        expect(retrievedcompanies).toHaveLength(3);
    });

    it ('Return "200 OK" with an empty array if the user has no companies', async () => {
        await new Company(company1Data).save();
        await new Company(company2Data).save();
        await new Company(company4Data).save();
    
        user1Data.companies = [];
        user1Data.auth_id = await testUtils.getAuthIdFromToken(token);
        await new User(user1Data).save();
    
        const { body: retrievedcompanies } = await supertest(app)
          .get('/api/companies')
          .set('Accept', 'application/json')
          .set('Authorization', token)
          .expect(httpStatus.OK)
    
        expect(retrievedcompanies).toHaveLength(0);
      });

    it ('Return "200 OK" with an empty array if no companies match the query param "term"', async () => {
        const company1ID = (await new Company(company1Data).save()).id;
        const company2ID = (await new Company(company2Data).save()).id;
        const company4ID = (await new Company(company4Data).save()).id;
    
        user1Data.companies = [company1ID, company2ID, company4ID];
        user1Data.auth_id = await testUtils.getAuthIdFromToken(token);
        await new User(user1Data).save();
    
        const { body: retrievedcompanies } = await supertest(app)
          .get('/api/companies')
          .set('Accept', 'application/json')
          .set('Authorization', token)
          .query({ term: "a query that no companies will match" })
          .expect(httpStatus.OK)
    
        expect(retrievedcompanies).toHaveLength(0);
      });
  
    it ('Correctly filters companies by the "term" query param', async () => {
      company1Data.name = "Movie - Spider-Man: No Way Home"
      const company1ID = (await new Company(company1Data).save()).id;
      company2Data.name = "MOVIE - Free Guy"
      const company2ID = (await new Company(company2Data).save()).id;
      company4Data.name = "Sports - Badminton"
      const company4ID = (await new Company(company4Data).save()).id;
  
      user1Data.companies = [company1ID, company2ID, company4ID];
      user1Data.auth_id = await testUtils.getAuthIdFromToken(token);
      await new User(user1Data).save();
  
      const { body: retrievedcompanies } = await supertest(app)
        .get('/api/companies')
        .set('Accept', 'application/json')
        .set('Authorization', token)
        .query({ term: 'Movie' })
        .expect(httpStatus.OK)
  
      expect(retrievedcompanies).toHaveLength(2);
      expect(retrievedcompanies[0].name).toBe("Movie - Spider-Man: No Way Home");
      expect(retrievedcompanies[1].name).toBe("MOVIE - Free Guy");
    });
  
    it ('Does not return duplicates if multiple fields in an company match the "term" query', async () => {
      company1Data.name = "Test";
      company1Data.location = "Test";
      company1Data.description = "Test";
      const company1ID = (await new Company(company1Data).save()).id;
      company2Data.name = "Test";
      const company2ID = (await new Company(company2Data).save()).id;
  
      user1Data.companies = [company1ID, company2ID];
      user1Data.auth_id = await testUtils.getAuthIdFromToken(token);
      await new User(user1Data).save();
  
      const { body: retrievedcompanies } = await supertest(app)
        .get('/api/companies')
        .set('Accept', 'application/json')
        .set('Authorization', token)
        .query({ term: "Test" })
        .expect(httpStatus.OK)
  
      expect(retrievedcompanies).toHaveLength(2);
      expect(retrievedcompanies[0].name).toBe("Test");
      expect(retrievedcompanies[0].location).toBe("Test");
      expect(retrievedcompanies[0].description).toBe("Test");
      expect(retrievedcompanies[1].name).toBe("Test");
    });

    it ('Correct data is embedded in the "persons" field for each company returned', async () => {
      const person1ID = (await new Person(person1Data).save()).id;
      const person2ID = (await new Person(person2Data).save()).id;
      company1Data.persons = [person1ID, person2ID];
      const company1ID = (await new Company(company1Data).save()).id;
      company2Data.persons = [person1ID];
      const company2ID = (await new Company(company2Data).save()).id;

      user1Data.companies = [company1ID, company2ID];
      user1Data.auth_id = await testUtils.getAuthIdFromToken(token);
      await new User(user1Data).save();

      const { body: retrievedcompanies } = await supertest(app)
        .get('/api/companies')
        .set('Accept', 'application/json')
        .set('Authorization', token)
        .expect(httpStatus.OK)

      expect(retrievedcompanies).toHaveLength(2);
      expect(retrievedcompanies[0].persons[0].first_name).toBe("Ping");
      expect(retrievedcompanies[0].persons[1].first_name).toBe("Adam");
      expect(retrievedcompanies[1].persons[0].first_name).toBe("Ping");
    });
  
    it ('Return "401 Unauthorized" if the user does not have a valid auth_id', async () => {
      await supertest(app)
        .get('/api/companies')
        .set('Accept', 'application/json')
        .set("Authorization", "FAKE_AUTH_TOKEN")
        .expect(httpStatus.UNAUTHORIZED);
    });
  });

// Delete companies Endpoint tests

// Delete company 200
describe('DELETE /company/:id', () => {
    it('Successfully deletes single company with single person: ', async () => {
        // Get Authentication ID for User
        const auth_id = await testUtils.getAuthIdFromToken(token);

        // Create Person
        const personOne = new Person(person1Data);
        const personOneId = (await personOne.save())._id;

        // Create company
        const companyOne = new Company(company1Data);
        const companyOneId = (await companyOne.save())._id;

        // Create User
        const user = new User(user1Data);

        // Add company and Person ID to User companies
        user.persons.push(personOneId);
        user.companies.push(companyOneId);
        user.auth_id = auth_id;
        await user.save();

        // Add company ID and Person ID to each other
        personOne.companies.push(companyOneId);
        companyOne.persons.push(personOneId);
        await personOne.save();
        await companyOne.save();

        await supertest(app).delete(`/api/companies/${companyOneId}`)
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .expect(httpStatus.OK);
        
        // Check that company has been removed
        const newUser = await User.findOne({auth_id: user.auth_id});
        expect(newUser?.persons).not.toContain(personOneId);
        expect(newUser?.companies).not.toContain(companyOneId);

        const newPerson = await Person.findOne({_id: personOne._id});
        expect(newPerson?.companies).not.toContain(companyOneId);

        expect(await Company.findById({_id: companyOneId})).toEqual(null);
    })

    it('Successfully deletes single company with multiple persons: ', async () => {
        // Get Authentication ID for User
        const auth_id = await testUtils.getAuthIdFromToken(token);

        // Create Person One
        const personOne = new Person(person1Data);
        const personOneId = (await personOne.save())._id;

        // Create Person Two
        const personTwo = new Person(person2Data);
        const personTwoId = (await personTwo.save())._id;

        // Create company
        const companyOne = new Company(company1Data);
        const companyOneId = (await companyOne.save())._id;

        // Create User
        const user = new User(user1Data);

        // Add company and Person ID to User companies
        user.persons.push(personOneId);
        user.persons.push(personTwoId);
        user.companies.push(companyOneId);
        user.auth_id = auth_id;
        await user.save();

        // Add company ID and Person ID to each other
        personOne.companies.push(companyOneId);
        personTwo.companies.push(companyOneId);
        companyOne.persons.push(personOneId);
        await personOne.save();
        await personTwo.save();
        await companyOne.save();

        // Call delete endpoints
        await supertest(app).delete(`/api/companies/${companyOneId}`)
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .expect(httpStatus.OK);
        
        // Check that company has been removed
        const newUser = await User.findOne({auth_id: user.auth_id});
        expect(newUser?.persons).not.toContain(personOneId);
        expect(newUser?.companies).not.toContain(companyOneId);

        const newPersonOne = await Person.findOne({_id: personOne._id});
        expect(newPersonOne?.companies).not.toContain(companyOneId);

        const newPersonTwo = await Person.findOne({_id: personTwo._id});
        expect(newPersonTwo?.companies).not.toContain(companyOneId);

        expect(await Company.findById({_id: companyOneId})).toEqual(null);
    })

    it('Successfully deletes multiple companies with single persons: ', async () => {
        // Get Authentication ID for User
        const auth_id = await testUtils.getAuthIdFromToken(token);

        // Create Person One
        const personOne = new Person(person1Data);
        const personOneId = (await personOne.save())._id;

        // Create companies
        const companyOne = new Company(company1Data);
        const companyOneId = (await companyOne.save())._id;

        const companyTwo = new Company(company2Data);
        const companyTwoId = (await companyTwo.save())._id;

        // Create User
        const user = new User(user1Data);

        // Add company and Person ID to User companies
        user.persons.push(personOneId);
        user.companies.push(companyOneId);
        user.companies.push(companyTwoId);
        user.auth_id = auth_id;
        await user.save();

        // Add company ID and Person ID to each other
        personOne.companies.push(companyOneId);
        personOne.companies.push(companyTwoId);
        companyOne.persons.push(personOneId);
        companyTwo.persons.push(personOneId);
        await personOne.save();
        await companyOne.save();
        await companyTwo.save();

        // Call delete endpoints
        await supertest(app).delete(`/api/companies/${companyOneId}`)
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .expect(httpStatus.OK);

        await supertest(app).delete(`/api/companies/${companyTwoId}`)
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .expect(httpStatus.OK);
        
        // Check that company has been removed
        const newUser = await User.findOne({auth_id: user.auth_id});
        expect(newUser?.persons).not.toContain(personOneId);
        expect(newUser?.companies).not.toContain(companyOneId);

        const newPersonOne = await Person.findOne({_id: personOne._id});
        expect(newPersonOne?.companies).not.toContain(companyOneId);
        expect(newPersonOne?.companies).not.toContain(companyTwoId);

        expect(await Company.findById({_id: companyOneId})).toEqual(null);
        expect(await Company.findById({_id: companyTwoId})).toEqual(null);
    }) 

// Delete company 404

    it('Sends back a NOT_FOUND when invalid company ID is requested: ', async () => {
        // Get Authentication ID for User
        const auth_id = await testUtils.getAuthIdFromToken(token);

        // Create companies
        const companyOne = new Company(company1Data);
        const invalidcompanyId = (await companyOne.save())._id;

        // Create User
        const user = new User(user1Data);
        user.auth_id = auth_id;
        await user.save();

        await supertest(app).delete(`/api/companies/${invalidcompanyId}`)
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .expect(httpStatus.NOT_FOUND);

        // Check that no companies are deleted from User
        const newUser = await User.findOne({auth_id: user.auth_id});
        expect(newUser?.companies).toHaveLength(user.companies.length);
        
    })

// Delete company 409

    it('Sends back a CONFLICT when deleting company with empty persons field: ', async () => {
        // Get Authentication Token
        const auth_id = await testUtils.getAuthIdFromToken(token);

        // Create company
        const companyOne = new Company(company1Data);
        const companyOneId = (await companyOne.save())._id;

        // Create User
        const user = new User(user1Data);

        // Add company ID to User companies
        user.companies.push(companyOneId);
        user.auth_id = auth_id;
        await user.save();

        await supertest(app).delete(`/api/companies/${companyOneId}`)
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .send(companyOne)
            .expect(httpStatus.CONFLICT);

        // company should still be deleted from the company collection
        expect(await Company.findById({_id: companyOneId})).toEqual(null);
    })

    it('Sends back a CONFLICT when deleting company with duplicate company IDs in User: ', async () => {
        // Get Authentication ID for User
        const auth_id = await testUtils.getAuthIdFromToken(token);

        // Create company
        const companyOne = new Company(company1Data);
        const companyOneId = (await companyOne.save())._id;

        // Create User
        const user = new User(user1Data);

        // Add company ID to Users x 2
        user.companies.push(companyOneId);
        user.companies.push(companyOneId);
        user.auth_id = auth_id;
        await user.save();

        await supertest(app).delete(`/api/companies/${companyOneId}`)
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .send(companyOne)
            .expect(httpStatus.CONFLICT);

        // company should still be deleted from User and Collection
        const newUser = await User.findOne({auth_id: user.auth_id});
        expect(newUser?.companies).not.toContain(companyOneId);

        expect(await Company.findById({_id: companyOneId})).toEqual(null);
    })
});

/*****************************************************************
 * Utility functions
 ****************************************************************/

/**
 * Creates user and creates person to that user, then an company with that person
 * Something like: user -> person -> company
 * returns id of the company
 * @param token
 * @return id of created company
 */
const createUserPersonCompany = async (token): Promise<any>=>{
    // create user
    await supertest(app)
        .post('/api/users')
        .set('Accept', 'application/json')
        .set('Authorization', token)
        .send(user1Data)
        .expect(httpStatus.CREATED)

    // create a person
    const createdPerson = await supertest(app)
        .post('/api/persons')
        .set('Accept', 'application/json')
        .set('Authorization', token)
        .send(person1Data)

    // create an company
    companyData.persons = [createdPerson._body._id]
    const newcompany = await supertest(app)
        .post('/api/companies')
        .set('Accept', 'application/json')
        .set('Authorization', token)
        .send(companyData)

    return newcompany._body._id
}


