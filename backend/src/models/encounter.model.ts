import { Schema, model } from 'mongoose';

interface EncounterModel {
  date: Date,
  location: string,
  description: string,
  persons: [Schema.Types.ObjectId]
}

const schema = new Schema<EncounterModel>({
  date: { type: Date, default: Date.now },
  location: { type: String, required: false },
  description: { type: String, required: true },
  persons: { type: [Schema.Types.ObjectId], required: true },
});

export default model<EncounterModel>('Encounter', schema);
