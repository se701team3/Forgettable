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

export const addPersonId = async(uid, pid) => {
  const updatedUser = await User.findOneAndUpdate(
    { auth_id: uid }, 
    { $push: { persons: pid }},
    { returnOriginal: false })
  return updatedUser;
}

const userService = {
  createUser,
  getUserByAuthId,
  addPersonId
};

export default userService;
