import User, {UserModel} from '../models/user.model';

export const createUser = async (userDetails: UserModel) => {
    if (await User.findOne({ auth_id: userDetails.auth_id }).exec()) {
      const e = new Error('User already exists');
      e.name = 'Conflict';
      throw e;
    }

    //No checks for first name/last name as it is changed to full name

    const user = new User(userDetails);
    
    await user.save();
    return user;
};

const userService = {
    createUser
  }

export default userService;