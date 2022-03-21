import {Avatar, AvatarGroup, StyledEngineProvider, SvgIcon} from '@mui/material';
import React from 'react';
import classes from './PersonCard.module.css';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import {convertSocialMediaToIcon} from '../../functions/socialMediaIconConverter';
import PropTypes from 'prop-types';
import {getFirstMetTimeString, getLongDateStringWithSlashes} from '../../functions/dateFormatter';
import UnknownDetail from '../UnknownDetail/UnknownDetail';
import {getImageSrcFromBuffer} from '../../functions/getImageSrcFromBuffer';

/*
 * Component for displaying information of a person in a list.
 * This is the full version of the person card.
 *
 * Author: Mercury Lin (lin8231)
 */
const PersonCard = (props) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (event) => {
    event.stopPropagation();
    setAnchorEl(null);
  };

  const socialMediaIcons = props.socialMedias &&
    props.socialMedias.map((socialMedia, index) => {
      return (
        <Avatar
          key={`${socialMedia.name}-${index}`}
          src={convertSocialMediaToIcon(socialMedia.name)}
          alt={socialMedia.name}
        >
        </Avatar>
      );
    });

  const menuItems = [
    {
      label: 'Edit',
      action: props.onEdit,
    },
    {
      label: 'Delete',
      action: props.onDelete,
    },
  ];

  return (
    <StyledEngineProvider injectFirst>
      <div className={classes.PersonCard} onClick={props.onClick}>
        <div className={classes.ContentContainer}>
          <Avatar
            alt={props.name}
            // this style is written inline because MUI does not support className
            style={{
              height: '90px',
              width: '90px',
              marginRight: '28px',
              backgroundColor:
                getComputedStyle(document.body).getPropertyValue('--prmry'),
              fontSize:
                getComputedStyle(document.body).getPropertyValue('--text-xxlarge')
              ,
            }}
            src={getImageSrcFromBuffer(props.image)}
          />
          <div className={classes.InformationContainer}>
            <div className={classes.MainInformationContainer}>
              <div className={classes.IdentityInformation}>
                <h2 data-testid="name-element">{props.name}</h2>
                <p data-testid="first-met-element">
                  {'First met ' + getFirstMetTimeString(props.firstMet)}
                </p>
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
                {menuItems.map((menuItem) => {
                  return (
                    <MenuItem
                      divider={true}
                      key={menuItem.label}
                      onClick={menuItem.action}
                    >
                      {menuItem.label}
                    </MenuItem>
                  );
                },
                )}
              </Menu>
            </div>
            <div className={classes.SupplementaryInformationContainer}>
              <p className={classes.Encounters}
                data-testid="encounters-element"
              >
                  Encounters: {props.numEncounters || '0'} times
              </p>
              <p className={classes.LastMet}
                data-testid="last-met-element"
              >
                Date last met: {
                props.lastMet ?
                <span>{getLongDateStringWithSlashes(props.lastMet)}</span> :
                 <UnknownDetail/>}
              </p>
              <div className={classes.SocialMediaContainer}>
                <AvatarGroup max={2}
                  spacing={2}
                  aria-label="social-media-icons"
                  data-testid="social-media-icons-element"
                  sx={{
                    '& .MuiAvatar-root': {
                      width: 20,
                      height: 20,
                      fontSize: 15},
                  }}
                >
                  { socialMediaIcons }
                </AvatarGroup>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StyledEngineProvider>
  );
};

PersonCard.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
  image: PropTypes.string,
  socialMedias: PropTypes.arrayOf(PropTypes.string),
  numEncounters: PropTypes.number,
  lastMet: PropTypes.instanceOf(Date),
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  firstMet: PropTypes.instanceOf(Date),
};


export default PersonCard;
