import React, {useContext} from 'react';
import classes from './SettingsPage.module.css';
import DarkMode from './DarkMode';
import CustomButton from '../../components/CustomButton/CustomButton';
import {AuthContext} from '../../context/AuthContext';

function SettingsPage() {
  const authContext = useContext(AuthContext);

  return (
    <div className={classes.SettingsPage}>
      <h1>Settings</h1>
      <div className={classes.ContentContainer}>
        <h2>
          Account
        </h2>
        <div className={classes.DetailSet}>
          <h4>Name</h4>
          <p>{authContext.user.displayName}</p>
        </div>
        <div className={classes.DetailSet}>
          <h4>Email</h4>
          <p>{authContext.user.email}</p>
        </div>
        <CustomButton
          btnText="Log out"
          className={classes.Button}
          onClick={authContext.logout}
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
