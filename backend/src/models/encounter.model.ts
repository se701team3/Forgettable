import mongoose, { Schema, model } from 'mongoose';

export interface EncounterModel {
  title: string,
  date: Date,
  time_updated: Date,
  location: string,
  latLong: number[],
  description: string,
  persons: mongoose.Types.ObjectId[]
}

const schema = new Schema<EncounterModel>({
  title: { type: String, required: true },
  date: { type: Date, required: false },
  time_updated: {
    type: Date, default: new Date(Date.now()), expires: 31536000, required: true, // Added a one year expiry time to Encounter entries
  },
  location: { type: String, required: false },
  latLong: { type: [Number], required: false },
  description: { type: String, required: true },
  persons: { type: [mongoose.Types.ObjectId], required: true },
});

export default model<EncounterModel>('Encounter', schema);
