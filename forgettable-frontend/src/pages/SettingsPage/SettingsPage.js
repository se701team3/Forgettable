import React from 'react';
import classes from './SettingsPage.module.css';
import {signOut} from 'firebase/auth';
import DarkMode from './DarkMode';
import {authentication} from '../../services/auth';

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
      <div className={classes.ContentContainer}>
      </div>
    </div>
  );
}

export default SettingsPage;
