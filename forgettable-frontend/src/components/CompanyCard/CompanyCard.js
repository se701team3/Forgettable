import {Avatar, AvatarGroup, StyledEngineProvider, SvgIcon} from '@mui/material';
import React, {useState, useEffect} from 'react';
import classes from './CompanyCard.module.css';
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
 * Component for displaying information of a company in a list.
 * This is the full version of the company card.
 *
 * Author: Andy Kweon (skwe902)
 */
const CompanyCard = (props) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (event) => {
    event.stopPropagation();
    setAnchorEl(null);
  };

  const menuItems = [
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
                  {props.description}
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
                  Location: {props.location}
              </p>
              <p className={classes.LastMet}
                data-testid="last-met-element"
              >
                Date Founded: {
                props.dateFounded ?
                <span>{getLongDateStringWithSlashes(props.dateFounded)}</span> :
                 <UnknownDetail/>}
              </p>
            </div>
          </div>
        </div>
      </div>
    </StyledEngineProvider>
  );
};

CompanyCard.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
  image: PropTypes.string,
  location: PropTypes.string,
  dateFounded: PropTypes.instanceOf(Date),
  description: PropTypes.string,
};


export default CompanyCard;
