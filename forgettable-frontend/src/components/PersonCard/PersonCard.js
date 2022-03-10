import {Avatar} from '@mui/material';
import React from 'react';
import classes from './PersonCard.module.css';

const PersonCard = (props) => {
  return (

    <div className={classes.PersonCard}>
      <div className={classes.AvatarContainer}>
      </div>
      <div className={classes.InformationContainer}>
      </div>
    </div>

  );
};

export default PersonCard;
