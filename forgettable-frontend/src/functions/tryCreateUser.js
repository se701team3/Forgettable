export const tryCreateUser = async (userObj) => {
  try {
    const result = await createUser(userObj);

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
