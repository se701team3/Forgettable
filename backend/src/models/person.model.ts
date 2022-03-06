import { Schema, model } from 'mongoose';

export interface PersonModel {
  first_name: string,
  last_name: string,
  birthday: Date,
  interests: string[],
  organisation: string,
  time_added: Date,
  how_we_met: string,
  encounters: [Schema.Types.ObjectId]
}

const schema = new Schema<PersonModel>({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  birthday: { type: Date, required: false },
  interests: { type: [String], required: false },
  organisation: { type: String, required: false },
  time_added: { type: Date, required: true },
  how_we_met: { type: String, required: false },
  encounters: { type: [Schema.Types.ObjectId], required: false }
});

export default model<PersonModel>('Person', schema);
