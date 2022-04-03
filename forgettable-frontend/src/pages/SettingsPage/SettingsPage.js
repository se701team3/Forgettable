/* eslint-disable max-len */
import React, {useContext, useState} from 'react';
import classes from './SettingsPage.module.css';
import DarkMode from './DarkMode';
import CustomButton from '../../components/CustomButton/CustomButton';
import {AuthContext} from '../../context/AuthContext';
import {pruneEncounters} from '../../services';
import styles from '../../components/InputField/InputField.module.css';
import {toastGenerator} from '../../functions/helper';

function SettingsPage() {
  // eslint-disable-next-line prefer-const
  // the en-CA locale uses yyyy-mm-dd formatting which is required for the max date
  const currentDateString = new Date().toLocaleDateString('en-CA');
  const [pruneDate, setPruneDate] = useState();

  // Handler for updating date state in prune settings
  const handleDateChange = (event) => {
    setPruneDate(event.target.value);
  };

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
          Manage Data
        </h2>
        <div>
          <div className={classes.DetailSet}> <h4>Prune data before this date:</h4></div>
          <input className={styles.inputFieldPrimary}
            type='date'
            max={currentDateString}
            name='prune_date'
            onChange={handleDateChange}
          />
          <CustomButton
            btnText="Confirm"
            className={classes.PruneButton}
            onClick={() => handlePruneButton(pruneDate)}
          />
        </div>
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

/**
 * Deals with sending the request to prune endpoint and popping up the response alert
 * @param {*} pruneDate Input date to prune from, taken from Date input
 */
const handlePruneButton = async (pruneDate) => {
  const result = await pruneEncounters(pruneDate);
  if (result) {
    toastGenerator('success', 'Encounters Pruned!', 2000);
    setTimeout(() => {
      navigate('/encounters', {state: {person: result}});
    }, 1000);
  } else {
    toastGenerator('error', 'Something went wrong... :(', 2000);
    setLoading(false);
  }
};

export default SettingsPage;
