import {Avatar, AvatarGroup, StyledEngineProvider} from '@mui/material';
import React from 'react';
import classes from './PersonCard.module.css';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import './PersonCard.css';


const PersonCard = (props) => {
  const socialMediaAvatarStyle = {
    width: '20px',
    height: '20px',
  };

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <StyledEngineProvider injectFirst>
      <div className={classes.PersonCard}>
        <div className={classes.ContentContainer}>
          <Avatar
            // this style is written inline because MUI does not support className
            alt="John Doe"
            style={{
              height: '90px',
              width: '90px',
              marginRight: '28px',
              backgroundColor:
            getComputedStyle(document.body).getPropertyValue('--prmry'),
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
                onClick={handleClick}
              >
                <MoreHorizIcon />
              </IconButton>
              <Menu
                id="long-menu"
                MenuListProps={{
                  'aria-labelledby': 'long-button',
                  'disablePadding': true,
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                PaperProps={{
                // this style is written inline because MUI does not support className
                  style: {
                    maxHeight: 35 * 4.5,
                    width: '130px',
                    boxShadow: 'none',
                    outline: '1px solid black',
                  },
                }}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'center',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <MenuItem
                  divider={true}
                >Item1</MenuItem>
                <MenuItem
                  divider={true}
                >Item2</MenuItem>
              </Menu>
            </div>
            <div className={classes.SupplementaryInformationContainer}>
              <p className={classes.Encounters}>
                  Encounters: 3 times
              </p>
              <p className={classes.LastMet}>
                Date last met: 06/06/2020
              </p>
              <div className={classes.SocialMediaContainer}>
                <AvatarGroup max={2}
                  spacing={2}
                >
                  <Avatar sx={socialMediaAvatarStyle}/>
                  <Avatar sx={socialMediaAvatarStyle}/>
                  <Avatar sx={socialMediaAvatarStyle}/>
                </AvatarGroup>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StyledEngineProvider>
  );
};

export default PersonCard;
