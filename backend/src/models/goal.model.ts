import mongoose, { Schema, model } from 'mongoose';

export interface GoalModel{
    date_start: Date,
    date_end: Date,
    duration: string,
    encounter_goal: number,
    progress: number,
    recurring: boolean
}

const schema = new Schema<GoalModel>({
  date_start: { type: Date },
  date_end: { type: Date },
  duration: { type: String, required: true },
  encounter_goal: { type: Number, required: true },
  progress: { type: Number },
  recurring: { type: Boolean, required: true },
});

export default model<GoalModel>('Goal', schema);
