import { Schema, model } from 'mongoose';

interface UserModel {
    first_name: string,
    last_name: string,
    user_name: string,
    persons: [Schema.Types.ObjectId]
}

const schema = new Schema<UserModel>({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    user_name: { type: String, required: true },
    persons: { type: [Schema.Types.ObjectId] }
});

export default model<UserModel>('User', schema);
