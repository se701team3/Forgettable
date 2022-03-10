import {Avatar} from '@mui/material';
import React from 'react';
import classes from './PersonCard.module.css';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

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
            <IconButton
              className={classes.IconButton}
              aria-label="more"
              id="long-button"
              aria-controls={open ? 'long-menu' : undefined}
              aria-expanded={open ? 'true' : undefined}
              aria-haspopup="true"
            //   onClick={handleClick}
            >
              <MoreHorizIcon />
            </IconButton>
          </div>
          <div className={classes.SupplementaryInformationContainer}>
            <p className={classes.Encounters}>
                  Encounters: 3 times
            </p>
            <p className={classes.LastMet}>
                Date last met: 06/06/2020
            </p>
            <div className={classes.SocialMediaContainer}>x</div>
          </div>
        </div>
      </div>
    </div>

  );
};

export default PersonCard;
