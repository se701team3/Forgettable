import {createContext} from 'react';

export const AuthContext = createContext({
  isLoggedIn: false,
  isLoggingIn: false,
  login: () => {},
  logout: () => {},
  user: {},
});
