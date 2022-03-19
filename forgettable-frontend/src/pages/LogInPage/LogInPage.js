import React from 'react';
import classes from './LogInPage.module.css';
import logo from '../../assets/logos/logo-black.svg';
import googleLogo from '../../assets/icons/google-login.svg';

const LogInPage = (props) => {
  return (

    <div className={classes.LogInPage}>
      <div className={classes.ContentContainer}>

        <div className={classes.ContentWrapper}>
          <p className={classes.WelcomeBackText}>
            Welcome Back!
          </p>


          <div
            className={classes.SignInButton} onClick={() => {}}>
            <img src={googleLogo} alt="google logo" />
            <p>Sign in with Google</p>
          </div>


          <p className={classes.CreateAccountText}>
            Please sign in using your Google account, if you do not have an
            account, create one <a href="https://accounts.google.com/SignUp?hl=en">here</a>
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
