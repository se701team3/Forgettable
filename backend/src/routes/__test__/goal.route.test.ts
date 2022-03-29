import databaseOperations from '../../utils/test/db-handler';
import User, { UserModel } from '../../models/user.model';
import Person, { PersonModel } from '../../models/person.model';
import Encounter, { EncounterModel } from '../../models/encounter.model';
import Goal, { GoalModel } from '../../models/goal.model';
import app from '../../server';
import httpStatus from "http-status";
import testUtils from '../../utils/test/test-utils';
import 'dotenv/config';
import encounterService from '../../services/encounter.service';
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
    goals: [] as any
}

const user2Data: UserModel = {
    auth_id: null as any,
    first_name: 'Adam',
    last_name: 'Weng',
    encounters: [] as any,
    persons: [] as any,
    goals: [] as any
}

const goal1Data: GoalModel = {
    date_start: new Date("2022-03-29"),
    date_end: new Date("2022-04-12"),
    duration: "14",
    recurring: true

};

const goal2Data: GoalModel = {
    date_start: new Date("2022-03-29"),
    date_end: new Date("2022-04-12"),
    duration: null as any,
    recurring: true
}

const goal3Data: GoalModel = {
    date_start: null as any,
    date_end: new Date("2022-04-12"),
    duration: "14",
    recurring: true
}

const goal4Data: GoalModel = {
    date_start: new Date("2022-03-29"),
    date_end: null as any,
    duration: "14",
    recurring: true
}

const goal5Data: GoalModel = {
    date_start: new Date("2022-03-29"),
    date_end: new Date("2022-04-12"),
    duration: "14",
    recurring: null as any
}

const goal6Data: GoalModel = {
    date_start: new Date("2022-03-29"),
    date_end: new Date("2022-04-12"),
    duration: "14",
    recurring: false
}

describe('POST /goal', () => {
    it('Successfully creates a goal with all info given', async () => {
        await supertest(app).post('/api/users')
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .send(user1Data);

        await supertest(app).post('/api/goal')
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .send(goal1Data)
            .expect(httpStatus.CREATED);
    })

    it('Successfuly creating an goal without a duration field', async () => {
        await supertest(app).post('/api/users')
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .send(user1Data);


        const { body: newGoal } = await supertest(app).post('/api/goal')
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .send(goal2Data)
            .expect(httpStatus.CREATED);

        expect(newGoal.duration).toEqual(undefined);
    })

    it('Failed to create an goal with empty date_start field', async () => {
        await supertest(app).post('/api/users')
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .send(user1Data);

        await supertest(app).post('/api/goal')
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .send(goal3Data)
            .expect(httpStatus.BAD_REQUEST);
    })

    it('Failed to create an goal with empty date_end field', async () => {
        await supertest(app).post('/api/users')
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .send(user1Data);

        await supertest(app).post('/api/goal')
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .send(goal4Data)
            .expect(httpStatus.BAD_REQUEST);
    })

    it('Failed to create an goal with empty recurring field', async () => {
        await supertest(app).post('/api/users')
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .send(user1Data);

        await supertest(app).post('/api/goal')
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .send(goal5Data)
            .expect(httpStatus.BAD_REQUEST);
    })

    it('Successful goal creation return correct goal data', async () => {
        await supertest(app).post('/api/users')
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .send(user1Data);

        const { body: storedGoal } = await supertest(app).post('/api/goal')
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .send(goal1Data);

        expect(storedGoal.date_start).toEqual(goal1Data.date_start);
        expect(storedGoal.date_end).toEqual(goal1Data.date_end);
        expect(storedGoal.duration).toEqual(goal1Data.duration);
        expect(storedGoal.recurring).toEqual(goal1Data.recurring);

    })

    it('Failed to create without an auth token', async () => {
        await supertest(app).post('/api/users')
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .send(user1Data);

        await supertest(app).post('/api/encounters')
            .set('Accept', 'application/json')
            .send(goal1Data)
            .expect(httpStatus.UNAUTHORIZED);

    })

    it('Goal not stored in database when request is unsuccessful', async () => {
        await supertest(app).post('/api/users')
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .send(user1Data);

        const { body: goal } = await supertest(app).post('/api/goal')
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .send(goal3Data);

        await supertest(app).get(`/api/goal/${goal._id}`)
            .set('Authorization', token)
            .expect(httpStatus.NOT_FOUND)

        const { body: storedUser } = await supertest(app).get('/api/users')
            .set('Authorization', token)
            .expect(httpStatus.OK);
        expect(storedUser).not.toContain(goal._id);

    })
})

describe('GET /goal/:id', () => {
    it ('Successfully retrieves an goal with a given json', async () => {
        const newGoalId = await createUserGoal(token);

        // retrieve the specified goal
        const goal = await supertest(app)
            .get(`/api/goal/${newGoalId}`)
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .expect(httpStatus.OK)

        expect(goal._body.date_start).toBe(goal1Data.date_start)
        expect(goal._body.date_end).toBe(goal1Data.date_end)
        expect(goal._body.duration).toBe(goal1Data.duration)
        expect(goal._body.recurring).toBe(goal1Data.recurring)

    });

    it('Fails when called with invalid goal object ID', async () => {
        await createUserGoal(token)
        // update an gpa; of id that does not exist
        await supertest(app)
            .get(`/api/goal/${123}`)
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .expect(httpStatus.NOT_FOUND)
    });

    it('Fails when goal object ID that does not exist', async () => {
        // update an goal of id that does not exist
        await supertest(app)
            .get(`/api/goal/622b36166bb3a4e3a1ef62f1`)
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .expect(httpStatus.NOT_FOUND)
    });
    it('Fails when user does not exist for given token', async ()=>{
        await supertest(app)
            .get(`/api/goal/1234567890`)
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .expect(httpStatus.NOT_FOUND)
    })
    it('Fails when user is not authenticated', async ()=>{
        await supertest(app)
            .get(`/api/goal/1234567890`)
            .set('Accept', 'application/json')
            .expect(httpStatus.UNAUTHORIZED)
    })
});

describe('PUT /goal/:id ', () => {
    it('Successfully updates an goal with a given json', async () => {
        const newGoalId = await createUserGoal(token);

        // update a goal with 'goal2Data'
        await supertest(app)
            .put(`/api/goal/${newGoalId}`)
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .send(goal2Data)
            .expect(httpStatus.NO_CONTENT) // since it's no content, need to get this goal to check updated fields

        // retrieve the updated goal and compare
        const updatedGoal = await supertest(app)
            .get(`/api/goal/${newGoalId}`)
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .send(goal2Data)
            .expect(httpStatus.OK)

        expect(updatedGoal._body.date_start).toBe(goal2Data.date_start)
        expect(updatedGoal._body.date_end).toBe(goal2Data.date_end)
        expect(updatedGoal._body.duration).toBe(goal2Data.duration)
        expect(updatedGoal._body.recurring).toBe(goal2Data.recurring)
    });

    it('Fails when called with invalid goal object ID', async () => {
        await createUserGoal(token)
        // update a goal of id that does not exist
        await supertest(app)
            .put(`/api/goal/${123}`)
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .send(goal3Data)
            .expect(httpStatus.NOT_FOUND)
    });

    it('Fails when goal object ID that does not exist', async () => {
        // update an encounter of id that does not exist
        await supertest(app)
            .put(`/api/goal/622b36166bb3a4e3a1ef62f1`)
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .send(goal1Data)
            .expect(httpStatus.NOT_FOUND)
    });
    it('Fails when user does not exist for given token', async ()=>{
        await supertest(app)
            .put(`/api/goal/1234567890`)
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .expect(httpStatus.NOT_FOUND)
    })
    it('Fails when user is not authenticated', async ()=>{
        await supertest(app)
            .put(`/api/goal/1234567890`)
            .set('Accept', 'application/json')
            .expect(httpStatus.UNAUTHORIZED)
    })
});

describe('GET /goal pagination', () => {

    async function populateDbWithUsersGoal() {
        const goal1 = new Goal(goal1Data);

        await goal1.save();

        user2Data.auth_id = await testUtils.getAuthIdFromToken(token);
        const user = new User(user2Data);
        user.goals.push(goal1._id);
        await user.save();

        const storedGoalIds = [goal1._id];

        return storedGoalIds;
    }

    it('Response paginated and returns correct number of entries', async () => {
        await populateDbWithUsersGoal();

        const { body: goals } = await supertest(app).get('/api/goal')
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .query({
                limit: 1,
                page: 1
            });

        expect(goals.length).toEqual(1);
    });

    it('Response not paginated when limit is not given', async () => {
        await populateDbWithUsersGoal();

        const { body: goals } = await supertest(app).get('/api/goal')
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .query({
                page: 4
            });

        expect(goals.length).toEqual(1);
    });

    it('Response not paginated when limit is not a number', async () => {
        await populateDbWithUsersGoal();

        const { body: goals } = await supertest(app).get('/api/goal')
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .query({
                limit: "one",
                page: 2
            });

        expect(goals.length).toEqual(1);
    });

    it('Response not paginated when page is not a number', async () => {
        await populateDbWithUsersGoal();

        const { body: goals } = await supertest(app).get('/api/goal')
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .query({
                limit: 5,
                page: "page"
            });

        expect(goals.length).toEqual(1);
    });

    it('Empty array is returned when page=0', async () => {
        await populateDbWithUsersGoal();

        const { body: goals } = await supertest(app).get('/api/goal')
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .query({
                limit: 4,
                page: 0
            });

        expect(goals.length).toEqual(0);
    });

    it('Empty array is returned when page<0', async () => {
        await populateDbWithUsersGoal();

        const { body: goals } = await supertest(app).get('/api/goal')
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .query({
                limit: 2,
                page: -5
            });

        expect(goals.length).toEqual(0);
    });

    it('Empty array is returned when page requested is out of bound', async () => {
        await populateDbWithUsersGoal();

        const { body: goals } = await supertest(app).get('/api/goal')
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .query({
                limit: 7,
                page: 3
            });

        expect(goals.length).toEqual(0);
    });

    it('Number of response returned is less than limit if (page * limit) < total entries', async () => {
        await populateDbWithUsersGoal();

        const { body: goals } = await supertest(app).get('/api/goal')
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .query({
                limit: 8,
                page: 2
            });

        expect(goals.length).toEqual(2);
    })
})
describe('GET goal/', () => {
    it ('Only return goal associated with the user', async () => {
        const goal1ID = (await new Goal(goal1Data).save()).id;
        // await new Goal(goal6Data).save();

        user1Data.goals = goal1ID;
        user1Data.auth_id = await testUtils.getAuthIdFromToken(token);
        await new User(user1Data).save();

        const { body: retrievedGoal } = await supertest(app)
            .get('/api/goal')
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .expect(httpStatus.OK)

        expect(retrievedGoal).toHaveLength(1);
        expect(retrievedGoal._id).toEqual(goal1ID);
    });

    it ('Return "200 OK" with an empty array if the user has no goal', async () => {
        await new Goal(goal1Data).save();

        user1Data.goals = [];
        user1Data.auth_id = await testUtils.getAuthIdFromToken(token);
        await new User(user1Data).save();

        const { body: retrievedGoal } = await supertest(app)
            .get('/api/goal')
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .expect(httpStatus.OK)

        expect(retrievedGoal).toHaveLength(0);
    });

    it ('Return "200 OK" with an empty array if no goal match the query param "term"', async () => {
        const goal1ID = (await new Goal(goal1Data).save()).id;

        user1Data.goals = [goal1ID];
        user1Data.auth_id = await testUtils.getAuthIdFromToken(token);
        await new User(user1Data).save();

        const { body: retrievedGoal } = await supertest(app)
            .get('/api/goal')
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .query({ term: "a query that no goal will match" })
            .expect(httpStatus.OK)

        expect(retrievedGoal).toHaveLength(0);
    });

    it ('Return "401 Unauthorized" if the user does not have a valid auth_id', async () => {
        await supertest(app)
            .get('/api/goal')
            .set('Accept', 'application/json')
            .set("Authorization", "FAKE_AUTH_TOKEN")
            .expect(httpStatus.UNAUTHORIZED);
    });
});

// Delete Goal Endpoint tests

// Delete Encounter 200
describe('DELETE /goal/:id', () => {
    it('Successfully deletes single encounter with single person: ', async () => {
        // Get Authentication ID for User
        const auth_id = await testUtils.getAuthIdFromToken(token);

        // Create Goal
        const goal1 = new Goal(goal1Data);
        const goal1Id = (await goal1.save())._id;

        // Create User
        const user = new User(user1Data);

        // Add Goal ID to User goals
        user.goals.push(goal1Id);
        user.auth_id = auth_id;
        await user.save();

        await supertest(app).delete(`/api/goal/${goal1Id}`)
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .expect(httpStatus.OK);

        // Check that goal has been removed
        const newUser = await User.findOne({auth_id: user.auth_id});
        expect(newUser?.goals).not.toContain(goal1Id);

        expect(await Goal.findById({_id: goal1Id})).toEqual(null);
    })

// Delete Encounter 404

    it('Sends back a NOT_FOUND when invalid goal ID is requested: ', async () => {
        // Get Authentication ID for User
        const auth_id = await testUtils.getAuthIdFromToken(token);

        // Create Goal
        const goal1 = new Goal(goal1Data);
        const invalidGoalId = (await goal1.save())._id;

        // Create User
        const user = new User(user1Data);
        user.auth_id = auth_id;
        await user.save();

        await supertest(app).delete(`/api/goal/${invalidGoalId}`)
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .expect(httpStatus.NOT_FOUND);

        // Check that no goal is deleted from User
        const newUser = await User.findOne({auth_id: user.auth_id});
        expect(newUser?.goals).toHaveLength(user.goals.length);

    })

// Delete Encounter 409

    it('Sends back a CONFLICT when deleting Goal with empty date_start field: ', async () => {
        // Get Authentication Token
        const auth_id = await testUtils.getAuthIdFromToken(token);

        // Create Goal
        const goal3 = new Goal(goal3Data);
        const goal3Id = (await goal3.save())._id;

        // Create User
        const user = new User(user1Data);

        // Add Goal ID to User encounters
        user.goals.push(goal3Id);
        user.auth_id = auth_id;
        await user.save();

        await supertest(app).delete(`/api/goal/${goal3Id}`)
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .send(goal3)
            .expect(httpStatus.CONFLICT);

        // Goal should still be deleted from the Goal collection
        expect(await Goal.findById({_id: goal3Id})).toEqual(null);
    })

    it('Sends back a CONFLICT when deleting Goal with duplicate goal IDs in User: ', async () => {
        // Get Authentication ID for User
        const auth_id = await testUtils.getAuthIdFromToken(token);

        // Create Goal
        const goal1 = new Encounter(goal1Data);
        const goal1Id = (await goal1.save())._id;

        // Create User
        const user = new User(user1Data);

        // Add Goal ID to Users x 2
        user.encounters.push(goal1Id);
        user.encounters.push(goal1Id);
        user.auth_id = auth_id;
        await user.save();

        await supertest(app).delete(`/api/goal/${goal1Id}`)
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .send(goal1)
            .expect(httpStatus.CONFLICT);

        // Goal should still be deleted from User and Collection
        const newUser = await User.findOne({auth_id: user.auth_id});
        expect(newUser?.goals).not.toContain(goal1Id);

        expect(await Goal.findById({_id: goal1Id})).toEqual(null);
    })
});

/*****************************************************************
 * Utility functions
 ****************************************************************/

/**
 * Creates user and creates person to that user, then an encounter with that person
 * Something like: user -> person -> encounter
 * returns id of the encounter
 * @param token
 * @return id of created encounter
 */
const createUserGoal = async (token): Promise<any>=>{
    // create user
    await supertest(app)
        .post('/api/users')
        .set('Accept', 'application/json')
        .set('Authorization', token)
        .send(user1Data)
        .expect(httpStatus.CREATED)

    // create a goal
    const newGoal = await supertest(app)
        .post('/api/goal')
        .set('Accept', 'application/json')
        .set('Authorization', token)
        .send(goal1Data)

    return newGoal._body._id
}


