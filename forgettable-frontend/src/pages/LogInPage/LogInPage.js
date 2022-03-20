import React, {useContext} from 'react';
import classes from './LogInPage.module.css';
import logo from '../../assets/logos/logo-black.svg';
import googleLogo from '../../assets/icons/google-login.svg';
import {AuthContext} from '../../context/AuthContext';

/*
 * Page component for the log in page. Uses the AuthContext to
 * handle all logging in functionalities.
 *
 * Author: Mercury Lin (lin8231)
 */
const LogInPage = (props) => {
  const authContext = useContext(AuthContext);

  return (
    <div className={classes.LogInPage}>
      <div className={classes.ContentContainer}>
        <div className={classes.ContentWrapper}>
          <p className={classes.WelcomeBackText}>
            Welcome Back!
          </p>
          <button
            className={classes.SignInButton} onClick={authContext.login}>
            <img src={googleLogo} alt="google logo" />
            <p>Sign in with Google</p>
          </button>
          <p className={classes.CreateAccountText}>
            Please sign in using your Google account, if you do not have an
            account, create one <a
              href="https://accounts.google.com/SignUp?hl=en"
            >here
            </a>
          </p>
        </div>
        <img
          className={classes.Logo}
          src={logo}
          alt="logo_black"/>
      </div>
    </div>
  );
};

export default LogInPage;
