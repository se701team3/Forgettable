import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import firebaseConfig from '../firebase-config';
import 'regenerator-runtime/runtime';

firebase.initializeApp(firebaseConfig);
firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE);

// const postIdTokenToAuth = (idToken) => {
//   return fetch('/authentication', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: idToken,
//   });
// };

const googleProvider = new firebase.auth.GoogleAuthProvider();
const signIn = (callback) => {
  firebase
      .auth()
      .signInWithPopup(googleProvider)
      .then((result) => {
        const user = result.user;
        user.getIdToken().then((idToken) => {
          postIdTokenToAuth(idToken)
              .then((response) => response.json())
              .then((data) => {
                callback(true, {
                  email: user.email,
                  displayName: user.displayName,
                  id: data.id,
                });
                console.log('user id: ' + data.id);
              });
        });
      })
      .catch((error) => {
        console.log('ERROR! ', error);
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
