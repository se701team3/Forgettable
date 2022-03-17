/**
 * Model defines a datatype's schema (kinda like class)
 */
import mongoose, { Schema, model } from 'mongoose';
import * as algoliasearch from 'mongoose-algolia'
const mongooseAlgolia = require('mongoose-algolia');

export interface PersonModel {
  first_name: string,
  last_name: string,
  birthday: Date,
  gender: string,
  location: string,
  first_met: Date,
  how_we_met: string,
  interests: string[],
  organisation: string,
  social_media: Map<string, string>,
  image: Buffer,
  encounters: mongoose.Types.ObjectId[],
  time_updated: Date,
}

const schema = new Schema<PersonModel>({
  first_name: { type: String, required: true },
  last_name: { type: String, required: false },
  birthday: { type: Date, required: false },
  gender: { type: String, required: false },
  location: { type: String, required: false },
  first_met: { type: Date, required: false },
  how_we_met: { type: String, required: false },
  interests: { type: [String], required: false },
  organisation: { type: String, required: false },
  social_media: { type: Map, of: String, required: false },
  image: { type: Buffer, required: false },
  encounters: { type: [mongoose.Types.ObjectId], required: false },
  time_updated: { type: Date, default: new Date(Date.now()), required: true },
});

schema.plugin(mongooseAlgolia, {
  appId: process.env.ALGOLIA_APP_ID,
  apiKey: process.env.ALGOLIA_SECRET_KEY,
  indexName: 'persons',
  selector: 'first_name last_name birthday gender location first_met how_we_met interests organisation social_media image encounters time_updated',
  debug: true,
});

const personModel = model<PersonModel>('Person', schema);
(personModel as any).SyncToAlgolia();

(personModel as any).SetAlgoliaSettings({
  searchableAttributes: [
    'first_name',
    'last_name',
    'gender',
    'location',
    'how_we_met',
    'interests',
    'organisation',
    'social_media',
  ],
});

export default personModel;
