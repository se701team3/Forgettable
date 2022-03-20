import React from 'react';
import classes from './SettingsPage.module.css';
import {signOut} from 'firebase/auth';
import DarkMode from './DarkMode';
import {authentication} from '../../services/auth';
import CustomButton from '../../components/CustomButton/CustomButton';

function SettingsPage({setIsLoggedIn}) {
  const userName = JSON.parse(localStorage.getItem('user')).userName;

  const signOutHandler = ()=>{
    signOut(authentication).then(() => {
      // Sign-out successful.
    }).catch((error) => {
      // An error happened.
      console.log(error);
    });
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    setIsLoggedIn(false);
  };

  return (
    <div className={classes.container}>
      <div className={classes.title}>Settings:</div>
      <div className={classes.account}>Account:</div>
      <div className={classes.border}></div>
      <div className={classes.name}>Name:</div>
      <div className={classes.content}>{userName ? userName : 'Username'}</div>
      <div className={classes.border2}></div>
      <CustomButton className={classes.button} onClick={signOutHandler} btnText="Log out"/>
      <div className={classes.appearence}>Appearence:</div>
      <div className={classes.border}></div>
      <toolbar className={classes.toolbar}>
        <div className={classes.darkMode}>Dark mode</div>
        <DarkMode />
      </toolbar>
    </div>
  );
}

export default SettingsPage;
