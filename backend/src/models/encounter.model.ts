import mongoose, { Schema, model } from 'mongoose';
const mongooseAlgolia = require('mongoose-algolia');

export interface EncounterModel {
  title: string,
  date: Date,
  time_updated: Date,
  location: string,
  description: string,
  persons: mongoose.Types.ObjectId[]
}

const schema = new Schema<EncounterModel>({
  title: { type: String, required: true},
  date: { type: Date, required: false },
  time_updated: { type: Date, default: new Date(Date.now()), required: true },
  location: { type: String, required: false },
  description: { type: String, required: true },
  persons: { type: [mongoose.Types.ObjectId], required: true },
});

schema.plugin(mongooseAlgolia, {
  appId: process.env.ALGOLIA_APP_ID,
  apiKey: process.env.ALGOLIA_SECRET_KEY,
  indexName: 'encounters',
  selector: 'title date time_updated location description persons',
  debug: true,
});

const encounterModel = model<EncounterModel>('Encounter', schema);

(encounterModel as any).SyncToAlgolia();

(encounterModel as any).SetAlgoliaSettings({
  searchableAttributes: [
    'title',
    'location',
    'description',
  ],
});

export default encounterModel;
