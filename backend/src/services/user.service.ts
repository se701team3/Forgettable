import User, {UserModel} from '../models/user.model';

export const createUser = async (userDetails: UserModel) => {
    const user = new User(userDetails);
    await user.save();
    return user;
};

const userService = {
    createUser
  }

export default userService;