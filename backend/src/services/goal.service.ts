import Goal, { GoalModel } from '../models/goal.model';

const createGoal = async (goalDetails: GoalModel) => {
  const goal = new Goal(goalDetails);

  // Uses the duration string and the current date to compute the start/end date of the goal
  goal.date_start = new Date(Date.now());
  goal.date_end = new Date();
  goal.date_end.setDate(goal.date_start.getDate() + parseInt(goal.duration));
  goal.encounter_goal = goalDetails.encounter_goal;

  await goal.save();

  if (goal.duration === null || goal.encounter_goal === null || goal.encounter_goal === 0 || goal.recurring === null) {
    await Goal.deleteOne({ _id: goal._id }).exec();
    const e = new Error('Goal fields can\'t be empty');
    e.name = 'ValidationError';
    throw e;
  }

  return goal;
};

const getGoal = async (goalId) => Goal.findOne({ _id: goalId });

const updateGoal = async (objectID: string, goalDetails: GoalModel) => {
  console.log(objectID);
  const updatedGoal = await Goal
    .findByIdAndUpdate(objectID, goalDetails, { new: true });

  return updatedGoal;
};

const deleteGoal = async (goalId: String) => {
  const result = await Goal.deleteOne({ _id: goalId }).exec();

  // Check that Goal has been deleted
  if (result.deletedCount == 1) {
    return true;
  }
  return false;
};

const goalService = {
  createGoal,
  getGoal,
  updateGoal,
  deleteGoal,
};

export default goalService;
