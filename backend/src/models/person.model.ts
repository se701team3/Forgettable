/**
 * Model defines a datatype's schema (kinda like class)
 */
import mongoose, { Schema, model } from 'mongoose';

export interface PersonModel {
  full_name: string,
  birthday: Date,
  interests: string[],
  organisation: string,
  time_added: Date,
  how_we_met: string,
  encounters: mongoose.Types.ObjectId[]
}

const schema = new Schema<PersonModel>({
  full_name: { type: String, required: true },
  birthday: { type: Date, required: false },
  interests: { type: [String], required: false },
  organisation: { type: String, required: false },
  time_added: { type: Date, default: Date.now, required: true },
  how_we_met: { type: String, required: false },
  encounters: { type: [mongoose.Types.ObjectId], required: false },
});

export default model<PersonModel>('Person', schema);
