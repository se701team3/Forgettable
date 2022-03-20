import {createContext} from 'react';

/**
 * AuthContext is the context that is used to provide the state of the
 * user's authentication status. It allows all of its descendent
 * components to access the states it defines.
 *
 * Author: Mercury Lin (lin8231)
 */
export const AuthContext = createContext({
  isLoggedIn: false,
  isLoggingIn: false,
  login: () => {},
  logout: () => {},
  user: {},
});
