import React from 'react';
import classes from './LogInPage.module.css';
import logo from '../../assets/logos/logo-black.svg';

const LogInPage = (props) => {
  return (

    <div className={classes.LogInPage}>
      <div className={classes.ContentContainer}>

        <div>
          <p className={classes.WelcomeBackText}>
            Welcome Back!
          </p>
        </div>


        {/*   /!* Sign in Button *!/ */}
        {/* <div className={classes.SignInButton} onClick={signInHandler}>
          <img src={googleLogin} alt="googleLogin" className={classes.GoogleLoginImage}/>
          <p className={classes.SignInText}>
            Sign in with Google
          </p>
        </div> */}

        {/*   /!* Create google account *!/ */}
        {/* <div>
          <p className={classes.CreateAccountText}>
            Please sign in using your Google account, if you do not have an
            account, create one <a href="https://accounts.google.com/SignUp?hl=en">here</a>
          </p>
        </div> */}

        <div>
          <img
            className={classes.Logo}
            src={logo}
            alt="logo_black"/>
        </div>
      </div>
    </div>
  );
};

export default LogInPage;
