import React from 'react';
import classes from './SettingsPage.module.css';
import {signOut} from 'firebase/auth';
import DarkMode from './DarkMode';
import {authentication} from '../../services/auth';
import CustomButton from '../../components/CustomButton/CustomButton';

function SettingsPage({setIsLoggedIn}) {
  const user = localStorage.getItem('userName');

  const signOutHandler = ()=>{
    signOut(authentication).catch((error) => {
      console.log('Error signing out', error);
    });
    localStorage.removeItem('userName');
    setIsLoggedIn(false);
  };

  return (
    <div className={classes.SettingsPage}>
      <h1>Settings</h1>
      <div className={classes.ContentContainer}>
        <h2>
          Account
        </h2>
        <div className={classes.DetailSet}>
          <h4>Name</h4>
          <p>nmae</p>
        </div>
        <div className={classes.DetailSet}>
          <h4>Email</h4>
          <p>dsafsafsaS</p>
        </div>
        <CustomButton
          btnText="Log out"
          className={classes.Button}
          onClick={signOutHandler}
        />
        <h2>
          Appearance
        </h2>
        <div className={classes.DarkModeContainer}>
          <p>Dark mode</p>
          <div className={classes.TogglerContainer}>
            <DarkMode/>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
