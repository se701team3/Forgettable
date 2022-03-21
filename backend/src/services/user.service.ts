import User, { UserModel } from '../models/user.model';

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

export const addEncounterToUser = async (authId, encounterId) => {
  const result = await User.updateOne({ auth_id: authId }, { $push: { encounters: encounterId } });

  return result.modifiedCount === 1;
};

export const getUserByAuthId = async (uid) => {
  const user = await User.findOne({ auth_id: uid });
  return user;
};

export const deleteUserPerson = async (personID: String) => {
  const result = await User.updateMany({ }, { $pullAll: { persons: [{ _id: personID }] } });

  if (result.modifiedCount == 1) {
    return true;
  } else {
    return false;
  }
};

export const deleteUserEncounter = async (encounterID: String) => {
  const result = await User.updateMany({ }, { $pullAll: { encounters: [{ _id: encounterID }] } });

  if (result.modifiedCount == 1) {
    return true;
  } else {
    return false;
  }
};

export const addPersonId = async (uid, pid) => {
  const updatedUser = await User.findOneAndUpdate(
    { auth_id: uid },
    { $push: { persons: pid } },
    { returnOriginal: false },
  );
  return updatedUser;
};

const userService = {
  createUser,
  getUserByAuthId,
  addPersonId,
  deleteUserPerson,
  deleteUserEncounter,
  addEncounterToUser,
};

export default userService;
