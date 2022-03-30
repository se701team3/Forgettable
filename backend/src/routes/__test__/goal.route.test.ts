import databaseOperations from '../../utils/test/db-handler';
import User, { UserModel } from '../../models/user.model';
import Goal, { GoalModel } from '../../models/goal.model';
import app from '../../server';
import httpStatus from "http-status";
import testUtils from '../../utils/test/test-utils';
import 'dotenv/config';

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

const goal1Data: GoalModel = {
    date_start: new Date("2022-03-29"),
    date_end: new Date("2022-04-12"),
    duration: "14",
    encounter_goal: 7,
    progress: 1,
    recurring: true

};

const goal2Data: GoalModel = {
    date_start: new Date("2022-03-29"),
    date_end: new Date("2022-04-12"),
    duration: "7",
    encounter_goal: 7,
    progress: 1,
    recurring: true
}

const goal3Data: GoalModel = {
    date_start: null as any,
    date_end: new Date("2022-04-12"),
    duration: null as any,
    encounter_goal: 7,
    progress: 1,
    recurring: true
}

const goal4Data: GoalModel = {
    date_start: new Date("2022-03-29"),
    date_end: null as any,
    duration: "14",
    encounter_goal: null as any,
    progress: 1,
    recurring: true
}

const goal5Data: GoalModel = {
    date_start: new Date("2022-03-29"),
    date_end: new Date("2022-04-12"),
    duration: "14",
    encounter_goal: 7,
    progress: 1,
    recurring: null as any
}

const goal6Data: GoalModel = {
    date_start: new Date("2022-03-29"),
    date_end: new Date("2022-04-12"),
    duration: "14",
    encounter_goal: 7,
    progress: null as any,
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

        user1Data.goals = [];
    })

    it('Failed to create an goal with empty duration field', async () => {
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

    it('Failed to create an goal with empty encounter_goal field', async () => {
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

        expect(storedGoal.date_start === goal1Data.date_start);
        expect(storedGoal.date_end === goal1Data.date_end);
        expect(storedGoal.duration).toEqual(goal1Data.duration);
        expect(storedGoal.recurring).toEqual(goal1Data.recurring);

    })

    it('Failed to create without an auth token', async () => {
        await supertest(app).post('/api/users')
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .send(user1Data);

        await supertest(app).post('/api/goal')
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
            .send(goal3Data)
            .expect(httpStatus.BAD_REQUEST);

        await supertest(app).get(`/api/goal/${goal._id}`)
            .set('Authorization', token)
            .expect(httpStatus.NO_CONTENT);

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

        expect(goal._body.date_start === goal1Data.date_start)
        expect(goal._body.date_end === goal1Data.date_end)
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

        // update a goal with 'goal3Data'
        await supertest(app)
            .put(`/api/goal/${newGoalId}`)
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .send(goal3Data)
            .expect(httpStatus.NO_CONTENT) // since it's no content, need to get this goal to check updated fields

        // retrieve the updated goal and compare
        const updatedGoal = await supertest(app)
            .get(`/api/goal/${newGoalId}`)
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .send(goal3Data)
            .expect(httpStatus.OK)

        expect(updatedGoal._body.date_start === goal3Data.date_start)
        expect(updatedGoal._body.date_end === goal3Data.date_end)
        expect(updatedGoal._body.duration).toBe(goal3Data.duration)
        expect(updatedGoal._body.recurring).toBe(goal3Data.recurring)
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
        // update an goal of id that does not exist
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

// Delete Goal Endpoint tests

// Delete Goal 200
describe('DELETE /goal/:id', () => {
    it('Successfully deletes single goal: ', async () => {
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

// Delete Goal 404

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

    it('Sends back a CONFLICT when deleting Goal with duplicate goal IDs in User: ', async () => {
        // Get Authentication ID for User
        const auth_id = await testUtils.getAuthIdFromToken(token);

        // Create Goal
        const goal1 = new Goal(goal1Data);
        const goal1Id = (await goal1.save())._id;

        // Create User
        const user = new User(user1Data);

        // Add Goal ID to Users x 2
        user.goals.push(goal1Id);
        user.goals.push(goal1Id);
        user.auth_id = auth_id;
        await user.save();

        await supertest(app).delete(`/api/goal/${goal1Id}`)
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .send(goal1)
            .expect(httpStatus.OK);

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
 * Creates user, then a goal
 * Something like: user -> goal
 * returns id of the goal
 * @param token
 * @return id of created goal
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


