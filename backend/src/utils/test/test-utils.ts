import axios from 'axios';

const generateTestAuthToken = async () => {
    
    //Retrieve token for authentication
    const email = process.env.FIREBASE_TEST_AUTH_EMAIL;
    const password = process.env.FIREBASE_TEST_AUTH_PASS;
    const key = process.env.FIREBASE_TEST_AUTH_KEY;

    let body = {
        "email": email,
        "password": password,
        "returnSecureToken": true
    }

    const response = await axios.post(`https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=${key}`, body);
    return response.data.idToken;
};

const testUtils = {
    generateTestAuthToken,
};

export default testUtils;
