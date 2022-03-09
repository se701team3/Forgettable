import { Schema, model } from 'mongoose';

interface UserModel {
    auth_id: string,
    first_name: string,
    last_name: string,
    persons: [Schema.Types.ObjectId]
    encounters: [Schema.Types.ObjectId]
}

const schema = new Schema<UserModel>({
    auth_id: { type: String, required: true },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    persons: { type: [Schema.Types.ObjectId] },
    encounters: { type: [Schema.Types.ObjectId] }
});

export default model<UserModel>('User', schema);
