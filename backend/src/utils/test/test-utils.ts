import axios from 'axios';
import FirebaseAdmin from '../../firebase-configs/firebase-config';

const generateTestAuthToken = async () => {
  // Retrieve token for authentication
  const email = process.env.FIREBASE_TEST_AUTH_EMAIL;
  const password = process.env.FIREBASE_TEST_AUTH_PASS;
  const key = process.env.FIREBASE_TEST_AUTH_KEY;

  let body = {
    email,
    password,
    returnSecureToken: true,
  };

  const response = await axios.post(`https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=${key}`, body);
  return response.data.idToken;
};

const getAuthIdFromToken = async (idToken: string) => {
  let auth_id = '';
  await FirebaseAdmin.auth()
    .verifyIdToken(idToken)
    .then((decodedToken) => {
      auth_id = decodedToken?.['user_id'];
    });
  return auth_id;
};

const testUtils = {
  generateTestAuthToken,
  getAuthIdFromToken,
};

export default testUtils;
