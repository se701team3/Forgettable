import databaseOperations from '../../utils/test/db-handler';

import goalService from '../goal.service';
import Goal, { GoalModel } from '../../models/goal.model';
import {Importance} from "../../enums/importance";

beforeAll(async () => {databaseOperations.connectDatabase()});
afterEach(async () => databaseOperations.clearDatabase());
afterAll(async () => databaseOperations.closeDatabase());

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
    progress: null as any,
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
    progress: 1,
    recurring: false
}

describe('Goal creation service', () => {

    it('Successfully stores goal if all required fields are given',  async () => {
        await goalService.createGoal(goal1Data);
    })

    it('All user info are stored correctly', async () => {
        const goal1 = await goalService.createGoal(goal1Data);

        const storedGoal1 = await Goal.findOne({_id: goal1._id}).exec();

        expect(goal1.toJSON()).toEqual(storedGoal1?.toJSON());
    })

    it('Failed to store user without duration', async () => {
        await expect(goalService.createGoal(goal3Data)).rejects.toThrow('Goal validation failed: duration: Path `duration` is required.');
    })

    it('Failed to create new user without encounter_goal', async () => {
        await expect(goalService.createGoal(goal4Data)).rejects.toThrow('Goal validation failed: encounter_goal: Path `encounter_goal` is required.');

    })

    it('Failed to create new user without recurring', async () => {
        await expect(goalService.createGoal(goal5Data)).rejects.toThrow('Goal validation failed: recurring: Path `recurring` is required.');

    })
})


describe('Getting goal', () => {
    it ('Can retrieve an id that exists', async () => {
        const createdGoal = await goalService.createGoal(goal1Data);
        const retrievedGoal = await goalService.getGoal(createdGoal._id.toString());

        expect(retrievedGoal?._id).toEqual(createdGoal._id);
    });
})

describe('Delete Goal Service', () => {
    it('Successfully deletes goal with valid ID',  async () => {
        const goal1 = new Goal(goal1Data);
        const goal1Id = (await goal1.save())._id;

        expect(await goalService.deleteGoal(String(goal1Id))).toBe(true);
    })


    it('Returns false with deletion of goal with non-valid ID', async () => {
        expect(await goalService.deleteGoal("123123123123")).toBe(false);
    })
})
