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

describe('Goal creation service', () => {

    it('Successfully stores encounter if all required fields are given',  async () => {
        await goalService.createGoal(goal1Data);
    })

    it('Successfully stores user if duration field is missing', async () => {
        await goalService.createGoal(goal2Data);
    })

    it('All user info are stored correctly', async () => {
        const goal1 = await goalService.createGoal(goal1Data);

        const storedGoal1 = await Goal.findOne({_id: goal1._id}).exec();

        expect(goal1.toJSON()).toEqual(storedGoal1?.toJSON());
    })

    it('Failed to store user without date_start', async () => {
        await expect(goalService.createGoal(goal3Data)).rejects.toThrow('Goal validation failed: date_start: Path `date_start` is required.');
    })

    it('Failed to create new user without date_end', async () => {
        await expect(goalService.createGoal(goal4Data)).rejects.toThrow('Goal validation failed: date_end: Path `date_end` is required.');

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


    it('Returns false with deletion of encounter with non-valid ID', async () => {
        expect(await goalService.deleteGoal("123123123123")).toBe(false);
    })
})

describe('Get Goal Service', () => {
    it ('Can retrieve goal that belong to the user', async () => {
        const goal6Id = (await new Goal(goal6Data).save()).id;

        const retrievedGoal = await goalService.getGoal(goal6Id);

        expect(retrievedGoal).toHaveLength(1);
    });

    it ('Returns an empty array if the user does not have a goal', async () => {
        const retrievedGoal = await goalService.getGoal({});

        expect(retrievedGoal).toHaveLength(0);
        expect(retrievedGoal).toStrictEqual([]);
    });
})
