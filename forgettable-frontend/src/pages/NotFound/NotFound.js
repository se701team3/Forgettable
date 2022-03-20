import React from 'react';
import classes from './NotFound.module.css';
import LightLogo from '../../assets/logos/logo-black.svg';
import DarkLogo from '../../assets/logos/logo-white.svg';
import IconButton from '../../components/IconButton/IconButton';
import {useNavigate} from 'react-router-dom';
/*
 * This is the 404 Not Found page. All invalid URLs will
 * redirect to here.
 *
 * Author: Mercury Lin (lin8231)
 */
const NotFound = (props) => {
  const navigate = useNavigate();

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
        <IconButton
          btnText="Go back to homepage"
          height="60px"
          onClick={() => navigate('/')}
        />
      </div>
      <img
        src={theme == 'dark' ? DarkLogo : LightLogo}
        alt="Forgettable Logo"
        className={classes.Logo}
      />
    </div>
  );
};

export default NotFound;
