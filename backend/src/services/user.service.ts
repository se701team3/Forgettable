import User, { UserModel } from "../models/user.model";

export const createUser = async (userDetails: UserModel) => {
  
  if (await User.findOne({ auth_id: userDetails.auth_id }).exec()) {
    const e = new Error('User already exists');
    e.name = 'Conflict';
    throw e;
  }

  const user = new User(userDetails);
  
  await user.save();
  return user;
};

export const getUserByAuthId = async (uid) => {
  const user = await User.findOne({ auth_id: uid });
  return user;
};

export const deleteUserEncounter = async (encounterId : string) => {
  await User.updateMany({}, { $pullAll: {encounters: [{ _id: encounterId}]} });
};

const userService = {
  createUser,
  getUserByAuthId,
  deleteUserEncounter,
};

export default userService;
