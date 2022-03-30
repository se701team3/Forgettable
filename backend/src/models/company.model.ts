import mongoose, { Schema, model } from 'mongoose';

export interface CompanyModel {
  name: string,
  location: string,
  description: string,
  date_founded: Date,
  time_updated: Date,
  persons: mongoose.Types.ObjectId[],
}

const schema = new Schema<CompanyModel>({
  name: { type: String, required: true },
  location: { type: String, required: false },
  description: { type: String, required: false },
  date_founded: { type: Date, required: false },
  time_updated: { type: Date, default: new Date(Date.now()), required: true },
  persons: { type: [mongoose.Types.ObjectId], required: true }
});

export default model<CompanyModel>('Company', schema);
