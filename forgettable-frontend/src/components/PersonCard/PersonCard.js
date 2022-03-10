import {Avatar} from '@mui/material';
import React from 'react';
import classes from './PersonCard.module.css';

const PersonCard = (props) => {
  return (

    <div className={classes.PersonCard}>
      <div className={classes.ContentContainer}>

        <Avatar className={classes.Avatar}>JD</Avatar>
        <div className={classes.InformationContainer}>

          <div className={classes.MainInformationContainer}>
            <div className={classes.IdentityInformation}>
              <h2>Marley George</h2>
              <p>Adipsicing sit lectus</p>
            </div>

          </div>
          <div className={classes.SupplementaryInformationContainer}>
            <div className={classes.Encounters}>
                  Encounters: 3 times
            </div>
            <div className={classes.LastMet}>
                Date last met: 06/06/2020
            </div>
            <div className={classes.SocialMediaContainer}>x</div>
          </div>
        </div>
      </div>
    </div>

  );
};

export default PersonCard;
