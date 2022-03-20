import React, {useState, useEffect} from 'react';
import './index.css';
import {
  BrowserRouter, useNavigate,
} from 'react-router-dom';
import NavBar from './components/NavBar/NavBar';
import PageRouter from './hoc/PageRouter/PageRouter';
import {AuthContext} from './context/AuthContext';
import auth from './services/auth';
import firebase from 'firebase/compat/app';
import {tryCreateUser} from './functions/tryCreateUser';
import {useLocation} from 'react-router-dom';

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [user, setUserInfo] = useState({});

  useEffect(() => {
    const currentLocation = location.pathname;
    const status = auth.loadLoginStatus();

    if (status) setIsLoggingIn(true);
    firebase.auth().onAuthStateChanged((u) => {
      if (u) {
        setLoggedIn(true);
        setUserInfo(u);
      } else {
        setLoggedIn(false);
      }
      setIsLoggingIn(false);

      navigate(currentLocation);
    });
  }, []);

  const login = () => {
    const currentLocation = location.pathname;
    setIsLoggingIn(true);

    auth.signIn(async (ok, user) => {
      if (ok) {
        await tryCreateUser(user);

        setUserInfo(user);
        setIsLoggingIn(false);
        setLoggedIn(true);

        auth.persistLoginStatus(user);
      } else {
        setIsLoggingIn(false);
        console.log('Error logging in');
      }

      navigate(currentLocation);
    });
  };

  const logout = () => {
    auth.signOut().then(() => {
      setLoggedIn(false);
      setIsLoggingIn(false);
      setUserInfo({});
      auth.clearPersistedLoginStatus();
    });
  };

  return (
    <AuthContext.Provider
      value={{isLoggedIn, isLoggingIn, user, login, logout}}
    >
      {isLoggedIn && <NavBar />}
      <PageRouter/>
    </AuthContext.Provider>
  );
}

export default App;
