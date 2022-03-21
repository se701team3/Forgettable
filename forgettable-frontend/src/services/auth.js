import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import firebaseConfig from '../firebase-config';
import 'regenerator-runtime/runtime';
import {getAuth, signInWithPopup} from 'firebase/auth';

/**
 * Contains logic for handling everything auth related. This includes
 * logging in, logging out, and persisting login status.
 * Stores the user's name, email and other meta info in localstorage.
 * JWT is NOT stored.
 *
 * Author: Mercury Lin (lin8231)
 */
const app = firebase.initializeApp(firebaseConfig);
export const authentication = getAuth(app);

const googleProvider = new firebase.auth.GoogleAuthProvider();
const signIn = (callback) => {
  signInWithPopup(authentication, googleProvider)
      .then((result) => {
        const user = result.user;

        if (user) {
          callback(true, {
            userName: user.displayName,
            userId: user.uid,
          });
        }
      })
      .catch((error) => {
        console.log('Uh oh, error loggin in :( ', error);
        callback(false);
      });
};

const signOut = () => {
  firebase.auth().signOut();
};


const persistLoginStatus = (user) => {
  // save user details to localstorage
  localStorage.setItem('user', JSON.stringify(user));
};

const loadLoginStatus = () => {
  // read user details from localstorage
  const user = JSON.parse(localStorage.getItem('user'));
  if (user) {
    return {
      isLoggedIn: true,
      userInfo: user,
    };
  } else {
    return {
      isLoggedIn: false,
    };
  }
};

const clearPersistedLoginStatus = () => {
  // clear user details from localstorage
  localStorage.removeItem('user');
};

export default {
  signIn: signIn,
  signOut: signOut,
  persistLoginStatus: persistLoginStatus,
  loadLoginStatus: loadLoginStatus,
  clearPersistedLoginStatus: clearPersistedLoginStatus,
};
