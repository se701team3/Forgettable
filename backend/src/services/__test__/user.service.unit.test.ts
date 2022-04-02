import databaseOperations from '../../utils/test/db-handler';

import { addEncounterToUser, createUser, deleteUserPerson, deleteUserEncounter, deleteUserCompany } from '../user.service';
import User, { UserModel } from '../../models/user.model';

beforeAll(async () => {databaseOperations.connectDatabase()});
afterEach(async () => databaseOperations.clearDatabase());
afterAll(async () => databaseOperations.closeDatabase());

const user1Data:UserModel = {
    auth_id: "0000",
    first_name: 'Bing',
    last_name: 'Bong',
    encounters: [] as any,
    persons: [] as any,
    goals: [] as any,
    companies: [] as any
}

const user2Data:UserModel = {
    auth_id: "0002",
    first_name: null as any,
    last_name: 'Mong',
    encounters: [] as any,
    persons: [] as any,
    goals: [] as any,
    companies: [] as any
}

const user3Data:UserModel = {
    auth_id: "0003",
    first_name: 'Tingy',
    last_name: null as any,
    encounters: [] as any,
    persons: [] as any,
    goals: [] as any,
    companies: [] as any
}

const user4Data:UserModel = {
    auth_id: "0004",
    first_name: 'Tingy',
    last_name: 'Tangy',
    persons: null as any,
    encounters: [] as any,
    goals: [] as any,
    companies: [] as any
}

const user5Data:UserModel = {
    auth_id: "0005",
    first_name: 'Tingy',
    last_name: 'Tangy',
    persons: [] as any,
    encounters: null as any,
    goals: [] as any,
    companies: [] as any
}

const user6Data:UserModel = {
    auth_id: "0000",
    first_name: 'Sting',
    last_name: 'Ray',
    encounters: null as any,
    persons: [] as any,
    goals: [] as any,
    companies: [] as any
}

const user7Data:UserModel = {
    auth_id: "0000",
    first_name: 'Sting',
    last_name: 'Ray',
    encounters: ["62330cf64ec3986f4d1ab01a"] as any,
    persons: ["656e636f756e746572314964", "656e636f756e746572317893"] as any,
    goals: [] as any,
    companies: ["6242407cc5e9863fb6f8ea00"] as any
}

describe('User creation service', () => {

    it('Successfully stores user if all required fields are given',  async () => {
        await createUser(user1Data);
    })

    it('Successfully stores user if persons field is missing', async () => {
        await createUser(user4Data);
    })

    it('Successfully stores user if encounters field is missing', async () => {
        await createUser(user5Data);
    })

    it('All user info are stored correctly', async () => {
        const createdUser1 = await createUser(user1Data);
        const createdUser2 = await createUser(user4Data);
        const createdUser3 = await createUser(user5Data);
        
        const storedUser1 = await User.findOne({auth_id: createdUser1.auth_id}).exec();
        const storedUser2 = await User.findOne({auth_id: createdUser2.auth_id}).exec();
        const storedUser3 = await User.findOne({auth_id: createdUser3.auth_id}).exec();

        expect(createdUser1.toJSON()).toEqual(storedUser1?.toJSON());
        expect(createdUser2.toJSON()).toEqual(storedUser2?.toJSON());
        expect(createdUser3.toJSON()).toEqual(storedUser3?.toJSON());

    })

    it('Failed to store user without first name', async () => {
        await expect(createUser(user2Data)).rejects.toThrow('User validation failed: first_name: Path `first_name` is required.');
    })

    it('Failed to create new user without last name', async () => {
        await expect(createUser(user3Data)).rejects.toThrow('User validation failed: last_name: Path `last_name` is required.');

    })

    it('Users with same id cannot be stored more than once', async () => {        
        await createUser(user1Data);

        await expect(createUser(user1Data)).rejects.toThrow('User already exists');
    })

    it('Storing users with same id and different info fails and does not update in database', async () => {
        const createdUser = await createUser(user1Data);

        await expect(createUser(user6Data)).rejects.toThrow('User already exists');


        const storedUser = await User.findOne({auth_id: createdUser.auth_id}).exec();
        expect(storedUser?.toJSON).toEqual(createdUser.toJSON);
    })

    it('User not stored in database when request is unsuccessful', async () => {
        try {
            await createUser(user2Data);
            fail();
        } catch (err) {

            const foundUser = await User.findOne({auth_id: user2Data.auth_id}).exec();
            expect(foundUser).toBeFalsy();
        };
    })
})

describe('Add encounter to user', () => {
    it ('Successfully add an encounter to a User', async () => {
        await createUser(user1Data);

        const encounterId = "656e636f756e746572314964";
        expect(await addEncounterToUser(user1Data.auth_id, encounterId)).toEqual(true);
    })

    it ('Encounter id stored correctly', async () => {
        await createUser(user1Data);

        let encounterId = "656e636f756e746572314964";
        await addEncounterToUser(user1Data.auth_id, encounterId);

        const storedUser = await User.findOne({ auth_id: user1Data.auth_id }).exec();
        expect(storedUser?.encounters.includes(encounterId as any)).toEqual(true);
    })

    it ('Fails to add encounter to not existing user', async () => {
        const encounterId = "656e636f756e746572314964";
        expect(await addEncounterToUser(user1Data.auth_id, encounterId)).toEqual(false);
    })
})

// Delete User Person Service

describe('Delete User Person Service', () => {

    it('Successfully deletes person if person ID exists',  async () => {

        // Create User
        const user = new User(user7Data);

        const result = await deleteUserPerson("656e636f756e746572314964");
        expect(result);
    })

    it('Returns FALSE if person ID does not exist in user',  async () => {

        // Create User
        const user = new User(user7Data);

        const result = await deleteUserPerson("0000636f756e746572310000");
        expect(!result);
    })
});

// Delete User Encounter Service

describe('Delete User Encounter Service', () => {

    it('Successfully deletes encounter if encounter ID exists',  async () => {

        // Create User
        const user = new User(user7Data);

        const result = await deleteUserEncounter("62330cf64ec3986f4d1ab01a");
        expect(result);
    })

    it('Returns FALSE if encounter ID does not exist in user',  async () => {

        // Create User
        const user = new User(user7Data);

        const result = await deleteUserEncounter("0000636f756e746572310000");
        expect(!result);
    })
});

// Delete User Company Service

describe('Delete User Company Service', () => {

    it('Successfully deletes company if company ID exists',  async () => {

        // Create User
        const user = new User(user7Data);

        const result = await deleteUserCompany("6242407cc5e9863fb6f8ea00");
        expect(result);
    })

    it('Returns FALSE if company ID does not exist in user',  async () => {

        // Create User
        const user = new User(user7Data);

        const result = await deleteUserCompany("0000636f756e746572310000");
        expect(!result);
    })
});
