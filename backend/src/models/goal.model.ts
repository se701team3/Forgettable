import mongoose, { Schema, model } from 'mongoose';

export interface GoalModel{
    date_start: Date,
    date_end: Date,
    duration: string,
    recurring: boolean
}

const schema = new Schema<GoalModel>({
  date_start: { type: Date, required: true },
  date_end: { type: Date, required: true },
  duration: { type: String },
  recurring: { type: Boolean, required: true },
});

export default model<GoalModel>('Goal', schema);
