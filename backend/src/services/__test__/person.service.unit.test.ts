import databaseOperations from '../../utils/test/db-handler';

import personService from '../person.service';
import Person, { PersonModel } from '../../models/person.model';
import deletePersons from '../person.service';
import {Importance} from "../../enums/importance";

beforeAll(async () => {databaseOperations.connectDatabase()});
afterEach(async () => databaseOperations.clearDatabase());
afterAll(async () => databaseOperations.closeDatabase());

const person1Data:PersonModel = {
    first_name: 'testlname',
    last_name: 'testllastName',
    interests: ['a', 'b'],
    labels: ['Devop'],
    organisation: 'testorg',
    time_updated: new Date('2022-01-01'),
    importance_level: Importance.Very_Important,
    how_we_met: 'testmet',
    birthday: new Date('2002-12-12'),
    encounters: [] as any,
    companies: [] as any,
    first_met: new Date('2022-01-01'),
    gender: "other",
    image: null as any,
    location: null as any,
    social_media: null as any
  };

  const person2Data:PersonModel = {
    first_name: 'test2name',
    last_name: 'test2lastName',
    interests: ['c', 'd'],
    labels: ['Devop'],
    organisation: 'anotherOrg',
    time_updated: new Date('2022-01-01'),
    importance_level: Importance.Should_Remember,
    how_we_met: 'Over there',
    birthday: new Date('2002-12-12'),
    encounters: [] as any,
    companies: [] as any,
    first_met: new Date('2022-01-01'),
    gender: "male",
    image: null as any,
    location: null as any,
    social_media: null as any
  };

  const person3Data:PersonModel = {
    first_name: 'test3name',
    last_name: 'test3lastName',
    interests: ['c', 'd'],
    labels: ['Devop'],
    organisation: 'anotherOrg',
    time_updated: new Date('2022-01-01'),
    importance_level: Importance.Casual_Contact,
    how_we_met: 'Over there',
    birthday: new Date('2002-12-12'),
    encounters: ["62330cf64ec3986f4d1ab01a"] as any,
    companies: ["6242407cc5e9863fb6f8ea00"] as any,
    first_met: new Date('2022-01-01'),
    gender: "male",
    image: null as any,
    location: null as any,
    social_media: null as any
  };

  const person4Data:PersonModel = {
    first_name: null as any,
    last_name: 'testllastName',
    interests: ['a', 'b'],
    labels: ['Devop'],
    organisation: 'testorg',
    time_updated: new Date('2022-01-01'),
    importance_level: Importance.Very_Important,
    how_we_met: 'testmet',
    birthday: new Date('2002-12-12'),
    encounters: [] as any,
    companies: [] as any,
    first_met: new Date('2022-01-01'),
    gender: "other",
    image: null as any,
    location: null as any,
    social_media: null as any
  };

  const person5Data:PersonModel = {
    first_name: 'testfirstname',
    last_name: 'testllastName',
    interests: ['a', 'b'],
    labels: ['Devop'],
    organisation: 'testorg',
    time_updated: null as any,
    importance_level: Importance.Casual_Contact,
    how_we_met: 'testmet',
    birthday: new Date('2002-12-12'),
    encounters: [] as any,
    companies: [] as any,
    first_met: new Date('2022-01-01'),
    gender: "other",
    image: null as any,
    location: null as any,
    social_media: null as any
  };

  describe('Creating persons', () => {
    it('Can create a person if all information is provided', async () => {
      const createdPerson = await personService.createPerson(person1Data);
      const storedPerson = await Person.findOne({ _id: createdPerson._id });

      expect(createdPerson.toJSON()).toEqual(storedPerson?.toJSON())
    });

    it ('Cannot create a person if first name is missing', async () => {
      await expect(personService.createPerson(person4Data)).rejects.toThrow('Person validation failed: first_name: Path `first_name` is required.');
    });

    it ('Cannot create a person if time_updated is missing', async () => {
      await expect(personService.createPerson(person5Data)).rejects.toThrow('Person validation failed: time_updated: Path `time_updated` is required.');
    });
  });

  describe('Getting persons', () => {
    it ('Can retrieve an id that exists', async () => {
      const createdPerson = await personService.createPerson(person1Data);
      const retrievedPerson = await personService.getPersonWithId(createdPerson._id.toString());
  
      expect(retrievedPerson?._id).toEqual(createdPerson._id);
    });
  
    it ('Returns null if an id does not exist', async () => {
      const retrievedPerson = await personService.getPersonWithId('some_fake_id');
      expect(retrievedPerson).toBeNull();
    });
  })

  describe('Add encounter to person', () => {
    it ('Successfully add an encounter to a Person', async () => {
        const person1 = await personService.createPerson(person1Data);
        const person2 = await personService.createPerson(person2Data);

        const personIds = [person1._id, person2._id];

        const encounterId = "656e636f756e746572314964";
        expect(await personService.addEncounterToPersons(personIds, encounterId)).toEqual(true);
    })

    it ('Encounter id stored correctly', async () => {
        const person1 = await personService.createPerson(person1Data);
        const person2 = await personService.createPerson(person2Data);

        const personIds = [person1._id, person2._id];

        let encounterId = "656e636f756e746572314964";
        await personService.addEncounterToPersons(personIds, encounterId);

        const storedPerson1 = await Person.findOne({ _id: person1._id }).exec();
        const storedPerson2 = await Person.findOne({ _id: person2._id }).exec();

        expect(storedPerson1?.encounters.includes(encounterId as any)).toEqual(true);
        expect(storedPerson2?.encounters.includes(encounterId as any)).toEqual(true);
    })

    it ('Fails to add encounter to not existing Person', async () => {
        const person1 = await personService.createPerson(person1Data);
        const person2 = await personService.createPerson(person2Data);

        const personIds = [person1._id, person2._id];

        await Person.deleteOne({ _id: person2._id }).exec();

        const encounterId = "656e636f756e746572314964";
        expect(await personService.addEncounterToPersons(personIds, encounterId)).toEqual(false);
    })
})

describe('Add company to person', () => {
  it ('Successfully add an company to a Person', async () => {
      const person1 = await personService.createPerson(person1Data);
      const person2 = await personService.createPerson(person2Data);

      const personIds = [person1._id, person2._id];

      const companyId = "6242407cc5e9863fb6f8ea00";
      expect(await personService.addCompanyToPersons(personIds, companyId)).toEqual(true);
  })

  it ('Company id stored correctly', async () => {
      const person1 = await personService.createPerson(person1Data);
      const person2 = await personService.createPerson(person2Data);

      const personIds = [person1._id, person2._id];

      let companyId = "6242407cc5e9863fb6f8ea00";
      await personService.addEncounterToPersons(personIds, companyId);

      const storedPerson1 = await Person.findOne({ _id: person1._id }).exec();
      const storedPerson2 = await Person.findOne({ _id: person2._id }).exec();

      expect(storedPerson1?.encounters.includes(companyId as any)).toEqual(true);
      expect(storedPerson2?.encounters.includes(companyId as any)).toEqual(true);
  })

  it ('Fails to add company to not existing Person', async () => {
      const person1 = await personService.createPerson(person1Data);
      const person2 = await personService.createPerson(person2Data);

      const personIds = [person1._id, person2._id];

      await Person.deleteOne({ _id: person2._id }).exec();

      const companyId = "6242407cc5e9863fb6f8ea00";
      expect(await personService.addEncounterToPersons(personIds, companyId)).toEqual(false);
  })
})

// Delete Person service

describe('Delete Person Service', () => {
  it ('Successfully deletes person', async () => {
     // Create Person
     const personOne = new Person(person3Data);
     const personOneId = (await personOne.save())._id;

    const result = await personService.deletePersons(personOneId.toString());
    expect(result);
  })

  it ('Returns false if person ID does not exist', async () => {
   const result = await personService.deletePersons("62330cf64ec3986f4d1ab01a");
   expect(!result);
 })
})

// Delete Person Encounter

describe('Delete Person Encounter Service', () => {
  it ('Successfully deletes person encounter', async () => {
     // Create Person
     const personOne = new Person(person3Data);

    const result = await personService.deletePersonEncounters("62330cf64ec3986f4d1ab01a");
    expect(result);
  })

  it ('Returns false if encounter ID does not exist', async () => {
    // Create Person
    const personOne = new Person(person3Data);

   const result = await personService.deletePersonEncounters("00000cf64ec3986f4d1a0000");
   expect(!result);
 })
})

// Delete Person Company

describe('Delete Person Company Service', () => {
  it ('Successfully deletes person company', async () => {
     // Create Person
     const personOne = new Person(person3Data);

    const result = await personService.deletePersonCompanies("6242407cc5e9863fb6f8ea00");
    expect(result);
  })

  it ('Returns false if encounter ID does not exist', async () => {
    // Create Person
    const personOne = new Person(person3Data);

   const result = await personService.deletePersonCompanies("00000cf64ec3986f4d1a0000");
   expect(!result);
 })
})