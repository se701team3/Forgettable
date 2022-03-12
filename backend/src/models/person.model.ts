/**
 * Model defines a datatype's schema (kinda like class)
 */
import mongoose, { Schema, model } from 'mongoose';

export interface PersonModel {
  full_name: string,
  birthday: Date,
  gender: string,
  location: string,
  date_met: Date,
  how_we_met: string,
  interests: string[],
  organisation: string,
  social_media: Map<string, string>,
  image: string,
  encounters: mongoose.Types.ObjectId[],
}

const schema = new Schema<PersonModel>({
  full_name: { type: String, required: true },
  birthday: { type: Date, required: false },
  gender: { type: String, required: false },
  location: { type: String, required: false },
  date_met: { type: Date, required: false },
  how_we_met: { type: String, required: false },
  interests: { type: [String], required: false },
  organisation: { type: String, required: false },
  social_media: { type: Map, of: String, required: false },
  image: { type: String, required: false },
  encounters: { type: [mongoose.Types.ObjectId], required: false },
});

export default model<PersonModel>('Person', schema);
