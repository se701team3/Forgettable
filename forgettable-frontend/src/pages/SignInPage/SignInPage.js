import React from 'react';
import classes from './SignInPage.module.css';
import googleLogin from '../../assets/icons/google-login.svg';
import logoBlack from '../../assets/logos/logo-black.svg';
import {authentication} from '../../firebase.js';
import {signInWithPopup, GoogleAuthProvider} from 'firebase/auth';
import {createUser} from '../../services';


export default function SignInPage({setIsLoggedIn}) {
  async function dealWithUser(user) {
    // post to the backend
    const userObj = {
      first_name: user.displayName,
      last_name: user.displayName,
    };

    try {
      console.log('making user');
      await createUser(userObj);
      console.log('successfully made user');
    } catch (err) {
      if (err.status === 409) {
        /* @TODO: This is thrown when a user already exists with this access token,
         This is expected behaviour. But this error is currently being caught at a higher
         level so not making it here. We need to not catch it at the higher level. */
      } else {
        console.log(err);
      }
    }
  }

  const signInHandler = () => {
    const googleProvider = new GoogleAuthProvider();
    signInWithPopup(authentication, googleProvider).then((result)=>{
      // const credential = GoogleAuthProvider.credentialFromResult(result);
      // const token = credential.accessToken;

      const user = result.user;
      localStorage.setItem('token', user.accessToken);
      localStorage.setItem('userName', user.displayName);

      dealWithUser(user);

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

        <div>
          <p className={classes.WelcomeBackText}>
            Welcome Back!
          </p>
        </div>


        {/*   /!* Sign in Button *!/ */}
        <div className={classes.SignInButton} onClick={signInHandler}>
          <img src={googleLogin} alt="googleLogin" className={classes.GoogleLoginImage}/>
          <p className={classes.SignInText}>
            Sign in with Google
          </p>
        </div>

        {/*   /!* Create google account *!/ */}
        <div>
          <p className={classes.CreateAccountText}>
            Please sign in using your Google account, if you do not have an
            account, create one <a href="https://accounts.google.com/SignUp?hl=en">here</a>
          </p>
        </div>

        <div>
          <img
            className={classes.Logo}
            src={logoBlack}
            alt="logo_black"/>
        </div>
      </div>
    </div>
  );
}
