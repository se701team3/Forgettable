/**
 * Model defines a datatype's schema (kinda like class)
 */
import mongoose, { Schema, model } from 'mongoose';
import { Importance } from '../enums/importance';

export interface PersonModel {
  first_name: string,
  last_name: string,
  birthday: Date,
  gender: string,
  location: string,
  importance_level: Importance,
  first_met: Date,
  how_we_met: string,
  interests: string[],
  labels: string[],
  organisation: string,
  social_media: Map<string, string>,
  image: Buffer,
  encounters: mongoose.Types.ObjectId[],
  companies: mongoose.Types.ObjectId[],
  time_updated: Date,
}

const schema = new Schema<PersonModel>({
  first_name: { type: String, required: true },
  last_name: { type: String, required: false },
  birthday: { type: Date, required: false },
  gender: { type: String, required: false },
  location: { type: String, required: false },
  importance_level: { type: Number, required: false },
  first_met: { type: Date, required: false },
  how_we_met: { type: String, required: false },
  interests: { type: [String], required: false },
  labels: { type: [String], required: false },
  organisation: { type: String, required: false },
  social_media: { type: Map, of: String, required: false },
  image: { type: Buffer, required: false },
  encounters: { type: [mongoose.Types.ObjectId], required: false },
  companies: { type: [mongoose.Types.ObjectId], required: false },
  time_updated: { type: Date, default: new Date(Date.now()), required: true },
});

export default model<PersonModel>('Person', schema);
