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
        <Avatar
        // this style is written inline because MUI does not support className
          alt="John Doe"
          style={{
            height: '90px',
            width: '90px',
            marginRight: '28px',
            backgroundColor: getComputedStyle(document.body).getPropertyValue('--prmry'),
            fontSize: '30px',
          }}
          src="placeholder"
        />
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
            <div className={classes.SocialMediaContainer}></div>
          </div>
        </div>
      </div>
    </div>

  );
};

export default PersonCard;
