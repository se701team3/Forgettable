import {initializeApp} from 'firebase/app';
import {getAuth} from 'firebase/auth';
import {firebaseConfig} from './firebase-config';

const app = initializeApp(firebaseConfig);

export const authentication = getAuth(app);
