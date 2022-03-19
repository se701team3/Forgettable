
import axios from 'axios';
import {getAuth, onAuthStateChanged} from 'firebase/auth';
import firebase from 'firebase/compat/app';
import {authentication} from '../auth';
const SERVER_URL = 'http://localhost:3001/api/';


const waitForAuthInit = async () => {
  let unsubscribe = await new Promise((resolve) => {
    unsubscribe = firebase.auth().onAuthStateChanged((_) => resolve());
  });
  (unsubscribe)();
};

export const getHeaders = async () => {
  // const token = localStorage.getItem('token');
  // const user = getAuth().User;
  // console.log('GET AUTH', 'USER', user);

  // const user2 = firebase.User;
  // console.log('FiREBASE', 'USER', user2);

  // const user3 = firebase.auth().currentUser;
  // console.log('FIREBASE', 'AUTH USER', user3);


  // const auth = getAuth();
  // onAuthStateChanged(auth, (user) => {
  //   if (user) {
  //   // User is signed in, see docs for a list of available properties
  //   // https://firebase.google.com/docs/reference/js/firebase.User
  //     const uid = user.uid;
  //   // ...
  //   } else {
  //   // User is signed out
  //   // ...
  //   }
  // });

  console.log(authentication);
  console.log(authentication.currentUser);
  console.log(authentication.currentUser?.getIdToken());
  console.log(authentication.currentUser?.accessToken);

  const something = await waitForAuthInit;
  console.log('WAIT FOR AUTH INIT', something);

  const token = await authentication.currentUser.getIdToken();


  // console.log('test>>>>>>>>>>>>>>>>>>>>>>', test);


  // const token = await user.getIdToken();
  // const token = await getAuth().currentUser.getIdToken();

  console.log('TOKENNNN', token);

  if (!token) return null;
  const headers = {Authorization: `${token}`};

  return headers;
};

const tokenExpired = (message) => {
  if (message === 'JWT has expired') {
    localStorage.removeItem('token');
    window.location.reload();
  }
};

export const getData = async (url, data) => {
  const response = await axios.get(
      `${SERVER_URL}${url}`,
      {
        headers: await getHeaders(),
        ...(data && {params: data}),
      },
  ).catch((error) => {
    if (!error?.response) {
      throw new Error(
          'The server seems to be down :(  Try again later.',
      );
    }
    tokenExpired(error.response.data.message);
    throw new Error(`${error.response.data.message}`);
  });

  return response.data;
};


export const postData = async (url, data) => {
  const response = await axios.post(
      `${SERVER_URL}${url}`,
      data,
      {
        headers: getHeaders(),
      },
  )
      .catch((error) => {
        if (!error?.response) {
          throw new Error(
              'The server seems to be down :(  Try again later.',
          );
        }
        tokenExpired(error.response.data.message);
        throw new Error(`${error.response.data.message}`);
      });
  return response.data;
};

export const putData = async (url, data) => {
  const response = await axios.put(
      `${SERVER_URL}${url}`,
      data,
      {
        headers: getHeaders(),
      },
  )
      .catch((error) => {
        if (!error?.response) {
          throw new Error(
              'The server seems to be down :(  Try again later.',
          );
        }
        tokenExpired(error.response.data.message);
        throw new Error(`${error.response.data.message}`);
      });
  return response.data;
};

export const deleteData = async (url, data) => {
  const response = await axios.delete(
      `${SERVER_URL}${url}`,
      {
        headers: getHeaders(),
        ...(data && {params: data}),
      },
  ).catch((error) => {
    if (!error?.response) {
      throw new Error(
          'The server seems to be down :(  Try again later.',
      );
    }
    tokenExpired(error.response.data.message);
    throw new Error(`${error.response.data.message}`);
  });

  return response.data;
};
