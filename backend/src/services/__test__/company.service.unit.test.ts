import databaseOperations from '../../utils/test/db-handler';

import companyService from '../company.service';
import Company, { CompanyModel } from '../../models/company.model';
import Person, {PersonModel} from '../../models/person.model';
import {Importance} from "../../enums/importance";

beforeAll(async () => {databaseOperations.connectDatabase()});
afterEach(async () => databaseOperations.clearDatabase());
afterAll(async () => databaseOperations.closeDatabase());

const personOne: PersonModel = {
    first_name: 'Des',
    last_name: 'Tiny',
    birthday: new Date('0000-00-00'),
    gender: "Not human",
    location: "Everywhere",
    importance_level: Importance.Very_Important,
    first_met: new Date('2012-12-21'),
    how_we_met: "Life",
    interests: ['things'],
    labels: ['Devop'],
    organisation: "World",
    social_media: null as any,
    image: null as any,
    encounters: [] as any,
    companies: [] as any,
    time_updated: new Date('2022-03-28'),
  }

  const companyOne: CompanyModel = {
    name: "The Organisation",
    location: "Underground",
    description: "The Organisation sees everything",
    date_founded: new Date('1990-01-20'),
    time_updated: new Date(Date.now()),
    image: Buffer.from([0x62, 0x75, 0x66, 0x66, 0x65, 0x72]),
    persons: ["656e636f756e746572314964", "656e636f756e746572317893"] as any,
  }

  const companyTwo: CompanyModel = {
    name: "The League",
    location: "Unknown",
    description: "Mystery",
    date_founded: null as any,
    time_updated: new Date(Date.now()),
    image: Buffer.from([0x62, 0x75, 0x66, 0x66, 0x65, 0x72]),
    persons: ["656e636f756e746572314964", "656e636f756e746572317893"] as any,
  }

  const companyThree: CompanyModel = {
    name: "INGSOC",
    location: null as any,
    description: "Big Brother is watching you",
    date_founded: new Date('1984-01-01'),
    time_updated: new Date(Date.now()),
    image: Buffer.from([0x62, 0x75, 0x66, 0x66, 0x65, 0x72]),
    persons: ["656e636f756e746572314964", "656e636f756e746572317893"] as any,
  }

  const companyFour: CompanyModel = {
    name: "Band of Assassins that Go Around Killing People",
    location: "Mars",
    description: null as any,
    date_founded: new Date('1980-10-20'),
    time_updated: new Date(Date.now()),
    image: Buffer.from([0x62, 0x75, 0x66, 0x66, 0x65, 0x72]),
    persons: ["656e636f756e746572314964", "656e636f756e746572317893"] as any,
  }

  const companyFive: CompanyModel = {
    name: "",
    location: "Clouds",
    description: "Unnamed company",
    date_founded: new Date('1030-8-20'),
    time_updated: new Date(Date.now()),
    image: Buffer.from([0x62, 0x75, 0x66, 0x66, 0x65, 0x72]),
    persons: ["656e636f756e746572314964", "656e636f756e746572317893"] as any,
  }

  const companySix: CompanyModel = {
    name: "Random Company",
    location: "To be confirmed",
    description: "Not much is known yet",
    date_founded: new Date('2022-02-03'),
    time_updated: new Date(Date.now()),
    image: Buffer.from([0x62, 0x75, 0x66, 0x66, 0x65, 0x72]),
    persons: null as any,
  }

  const companySeven: CompanyModel = {
    name: "Seven Seven Seven",
    location: "Sevens",
    description: "Seven",
    date_founded: new Date('777-07-07'),
    time_updated: new Date(Date.now()),
    image: null as any,
    persons: [] as any,
  }

  const companyEight: CompanyModel = {
    name: "The Organisation",
    location: "Underground",
    description: "The Organisation sees everything",
    date_founded: new Date('1990-01-20'),
    time_updated: new Date(Date.now()),
    image: Buffer.from([0x62, 0x75, 0x66, 0x66, 0x65, 0x72]),
    persons: ["656e636f756e746572314964"] as any,
  }

  const companyNine: CompanyModel = {
    name: "The Organisation",
    location: "Underground",
    description: "The Organisation sees everything",
    date_founded: new Date('1990-01-20'),
    time_updated: new Date(Date.now()),
    image: Buffer.from([0x62, 0x75, 0x66, 0x66, 0x65, 0x72]),
    persons: ["656e636f756e746572314964", "656e636f756e746572317893"] as any,
  }

  describe('Company creation service', () => {

    it('Successfully stores company if all required fields are given',  async () => {
        await companyService.createCompany(companyOne);
    })

    it('Successfully stores company if date_founded field is missing', async () => {
        await companyService.createCompany(companyTwo);
    })

    it('Successfully stores company if location field is missing', async () => {
        await companyService.createCompany(companyThree);
    })

    it('Successfully stores company if description field is missing', async () => {
      await companyService.createCompany(companyFour)

    })

    it('Successfully stores company with null persons field', async () => {
      await companyService.createCompany(companySix)

    })

    it('Successfully stores company with null image field', async () => {
      await companyService.createCompany(companySeven)
    })

    it('All company info are stored correctly', async () => {
        const company1 = await companyService.createCompany(companyOne);
        const company2 = await companyService.createCompany(companyTwo);
        const company3 = await companyService.createCompany(companyThree);
        const company4 = await companyService.createCompany(companyFour);
        const company6 = await companyService.createCompany(companySix);
        const company7 = await companyService.createCompany(companySeven);

        const storedCompany1 = await Company.findOne({_id: company1._id}).exec();
        const storedCompany2 = await Company.findOne({_id: company2._id}).exec();
        const storedCompany3 = await Company.findOne({_id: company3._id}).exec();
        const storedCompany4 = await Company.findOne({_id: company4._id}).exec();
        const storedCompany6 = await Company.findOne({_id: company6._id}).exec();
        const storedCompany7 = await Company.findOne({_id: company7._id}).exec();

        expect(company1.toJSON()).toEqual(storedCompany1?.toJSON());
        expect(company2.toJSON()).toEqual(storedCompany2?.toJSON());
        expect(company3.toJSON()).toEqual(storedCompany3?.toJSON());
        expect(company4.toJSON()).toEqual(storedCompany4?.toJSON());
        expect(company6.toJSON()).toEqual(storedCompany6?.toJSON());
        expect(company7.toJSON()).toEqual(storedCompany7?.toJSON());
    })

    it('Failed to store company without name', async () => {
        await expect(companyService.createCompany(companyFive)).rejects.toThrow('Company validation failed: name: Path `name` is required.');
    })

})


describe('Getting Company', () => {
    it ('Can retrieve an id that exists', async () => {
      const createdCompany = await companyService.createCompany(companyOne);
      const retrievedCompany = await companyService.getCompany(createdCompany._id.toString());

      expect(retrievedCompany?._id).toEqual(createdCompany._id);
    });

    it ('Returns null if an id does not exist', async () => {
      const retrievedPerson = await companyService.getCompany('some_fake_id');
      expect(retrievedPerson).toBeNull();
    });
})
  
describe('Delete Company Service', () => {
    it('Successfully deletes Company with valid ID',  async () => {
        const CompanyOne = new Company(companyEight);
        const CompanyOneId = (await CompanyOne.save())._id;

        expect(await companyService.deleteCompany(String(CompanyOneId))).toBe(true);
    })


    it('Returns false with deletion of Company with non-valid ID', async () => {
        expect(await companyService.deleteCompany("123123123123")).toBe(false);
    })
})

describe('Delete Company Persons Service', () => {
    it('Successfully deletes person from a single person Company', async () => {
        const CompanyOne = new Company(companyEight);
        const CompanyOneId = (await CompanyOne.save())._id;

        const result = await companyService.deleteCompanyPerson("656e636f756e746572314964");
        expect(await result["array"][0]?._id).toEqual(CompanyOneId);
        expect(await result["bool"]).toBe(true);
    })

    it('Successfully deletes person from a multiple person Company', async () => {
        const CompanyOne = new Company(companyNine);
 
        const result = await companyService.deleteCompanyPerson("656e636f756e746572314964");
        expect(await result["array"]).toEqual([]);
        expect(await result["bool"]).toBe(true);
    })
})

describe('Get Companies Service', () => {
    it ('Can retrieve all Companies that belong to the user', async () => {
      const Company1ID = (await new Company(companyOne).save()).id;
      const Company2ID = (await new Company(companyTwo).save()).id;

      const retrievedCompanies = await companyService.getAllCompanies({}, [Company1ID, Company2ID]);
  
      expect(retrievedCompanies).toHaveLength(2);
      expect(retrievedCompanies[0].name).toBe("The Organisation");
      expect(retrievedCompanies[1].name).toBe("The League");
    });

    it ('Returns an empty array if the user does not have any Companies', async () => {
      const retrievedCompanies = await companyService.getAllCompanies({}, []);
    
      expect(retrievedCompanies).toHaveLength(0);
      expect(retrievedCompanies).toStrictEqual([]);
    });

    it ('Correctly filters the list of Companies by the query param', async () => {
      const Company1ID = (await new Company(companyOne).save()).id;
      const Company2ID = (await new Company(companyTwo).save()).id;
      const Company3ID = (await new Company(companyThree).save()).id;
    
      const retrievedCompanies = await companyService.getAllCompanies({term: "The"}, [Company1ID, Company2ID, Company3ID]);
      
      expect(retrievedCompanies).toHaveLength(3);
      expect(retrievedCompanies[0].name).toBe("The Organisation");
      expect(retrievedCompanies[1].name).toBe("The League");
      expect(retrievedCompanies[2].description).toBe("Big Brother is watching you");
    });

    it ('Returns an empty array if no Companys match the query param', async () => {
      const Company1ID = (await new Company(companyOne).save()).id;
      const Company2ID = (await new Company(companyTwo).save()).id;
      const Company3ID = (await new Company(companyThree).save()).id;
      
      const retrievedCompanies = await companyService.getAllCompanies({term: "no result search"}, [Company1ID, Company2ID, Company3ID]);
        
      expect(retrievedCompanies).toHaveLength(0);
      expect(retrievedCompanies).toStrictEqual([]);
    });
  })