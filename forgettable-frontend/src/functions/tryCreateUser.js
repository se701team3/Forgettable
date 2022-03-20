import {createUser} from '../services';

export const tryCreateUser = async (userObj) => {
  try {
    const result = await createUser({
      first_name: userObj.userName.split(' ')[0],
      last_name: userObj.userName.split(' ')[1] || '',
    });

    if (result) {
      console.log('Successfully made user');
    }
  } catch (err) {
    if (err.status === 409) {
      console.log('User already exists');
    } else {
      console.log(err);
      return;
    }
  }
};
