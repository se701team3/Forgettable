import React, {useState, useEffect} from 'react';
import './index.css';
import {BrowserRouter, useNavigate} from 'react-router-dom';
import NavBar from './components/NavBar/NavBar';
import PageRouter from './hoc/PageRouter/PageRouter';
import {AuthContext} from './context/AuthContext';
import auth from './services/auth';
import firebase from 'firebase/compat/app';
import {tryCreateUser} from './functions/tryCreateUser';
import {useLocation} from 'react-router-dom';
import {ToastContainer} from 'react-toastify';
import {LoadScript} from '@react-google-maps/api';
import {libraries} from './google-api-config';
function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [user, setUserInfo] = useState({});

  const path = location.pathname;

  useEffect(() => {
    navigate(path);
  }, []);

  useEffect(() => {
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
    });

    const theme = localStorage.getItem('theme');
    if (theme == 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }, []);

  const login = () => {
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
      {isLoggedIn && !isLoggingIn && <NavBar />}
      <LoadScript
        googleMapsApiKey={process.env.REACT_APP_MAPS_API_KEY}
        libraries={libraries}
      >
        <PageRouter />
      </LoadScript>
      <ToastContainer />
    </AuthContext.Provider>
  );
}

export default App;
