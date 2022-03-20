import React from 'react';
import classes from './NotFound.module.css';
import LightLogo from '../../assets/logos/logo-black.svg';
import DarkLogo from '../../assets/logos/logo-white.svg';
import IconButton from '../../components/IconButton/IconButton';
/*
 * This is the 404 Not Found page. All invalid URLs will
 * redirect to here.
 *
 * Author: Mercury Lin (lin8231)
 */
const NotFound = (props) => {
  const theme = localStorage.getItem('theme');

  return (
    <div className={classes.NotFound}>
      <div className={classes.ContentContainer}>
        <h1>
          {'Oops! We can\'t seem to find'}
          <br/>
          {'the page you\'re looking for :('}
        </h1>
        <p>Error 404 - Page Not Found</p>

        <IconButton btnText="Go back to Homepage" height="60px"/>
      </div>
      <img src={theme == 'dark' ? DarkLogo : LightLogo} alt="Forgettable Logo" className={classes.Logo}/>
    </div>
  );
};

export default NotFound;
