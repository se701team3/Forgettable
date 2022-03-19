import React from 'react';
import classes from './SettingsPage.module.css';
import {signOut} from 'firebase/auth';
import DarkMode from './DarkMode';
import {authentication} from '../../firebase.js';

function SettingsPage({setIsLoggedIn}) {
  const user = localStorage.getItem('userName');

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
    <div className='SettingsPage'>
      <div className={classes.title}>Settings:</div>
      <div className={classes.account}>Account:</div>
      <div className={classes.border}></div>
      <div className={classes.name}>Name</div>
      <div className={classes.content}>{user ? user : 'user name'}</div>
      {/* <div className={classes.email}>Email</div>
      <div className={classes.content}>username@gmail.com</div> */}
      <div className={classes.border2}></div>
      <button className={classes.button} onClick={signOutHandler}>Log out</button>
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
