import databaseOperations from '../../utils/test/db-handler';

import personService from '../person.service';
import Person, { PersonModel } from '../../models/person.model';

beforeAll(async () => {databaseOperations.connectDatabase()});
afterEach(async () => databaseOperations.clearDatabase());
afterAll(async () => databaseOperations.closeDatabase());

const person1Data:PersonModel = {
    first_name: 'testlname',
    last_name: 'testllastName',
    interests: ['a', 'b'],
    organisation: 'testorg',
    time_updated: new Date('2022-01-01'),
    how_we_met: 'testmet',
    birthday: new Date('2002-12-12'),
    encounters: [] as any,
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
    organisation: 'anotherOrg',
    time_updated: new Date('2022-01-01'),
    how_we_met: 'Over there',
    birthday: new Date('2002-12-12'),
    encounters: [] as any,
    first_met: new Date('2022-01-01'),
    gender: "male",
    image: null as any,
    location: null as any,
    social_media: null as any
  };

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