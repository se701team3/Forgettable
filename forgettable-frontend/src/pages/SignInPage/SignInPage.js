import React from 'react';
import classes from './SignInPage.module.css';
import googleLogin from '../../assets/icons/google-login.svg';
import logoBlack from '../../assets/logos/logo-black.svg';
import {authentication} from '../../firebase.js';
import {signInWithPopup, GoogleAuthProvider} from 'firebase/auth';


export default function SignInPage({setIsLoggedIn}) {
  const signInHandler = () => {
    const googleProvider = new GoogleAuthProvider();
    signInWithPopup(authentication, googleProvider).then((result)=>{
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      localStorage.setItem('token', user.stsTokenManager.accessToken);
      localStorage.setItem('user', user);
      setIsLoggedIn(true);
    }).catch((error) => {
      // Handle Errors here.
      // const errorCode = error.code;
      // const errorMessage = error.message;
      // The email of the user's account used.
      // const email = error.email;
      // The AuthCredential type that was used.
      // const credential = GoogleAuthProvider.credentialFromError(error);
      setIsLoggedIn(false);
    });
  };

  return (
    <div className={classes.Background}>
      <div className={classes.InnerBox}>
        <p className={classes.WelcomeBackText}>
          Welcome Back!
        </p>

        {/* Sign in Button */}
        <div className={classes.SignInButton} onClick={signInHandler}>
          <img src={googleLogin} alt="googleLogin" className={classes.GoogleLoginImage}/>
          <p className={classes.SignInText}>
            Sign in with Google
          </p>
        </div>

        {/* Create google account */}
        <p className={classes.CreateAccountText}>
          Please sign in using your Google account, if you do not have an
          account, create one <a href="https://accounts.google.com/SignUp?hl=en">here</a>
        </p>

        <img
          className={classes.Logo}
          src={logoBlack}
          alt="logo_black"/>
      </div>
    </div>
  );
}
