import React from 'react';
import classes from './SettingsPage.module.css';
import {getAuth, signOut} from 'firebase/auth';
import DarkMode from './DarkMode';

function SettingsPage() {
  const user = localStorage.getItem('userName');

  const signOutHandler = ()=>{
    const auth = getAuth();
    signOut(auth).then(() => {
      // Sign-out successful.
    }).catch((error) => {
      // An error happened.
    });
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
