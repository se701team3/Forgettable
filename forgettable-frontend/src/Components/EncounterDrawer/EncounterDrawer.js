import React from 'react';
import classes from './EncounterDrawer.module.css';
import {Avatar, Drawer} from '@mui/material';
import PropTypes from 'prop-types';
import {
  getDateLastMetString,
  getFirstMetTimeString,
} from '../../functions/dateFormatter';
import {capitalise} from '../../functions/stringFormatter';
import convertSocialMediaNamesToIcons,
{convertSocialMediaToIcon} from '../../functions/socialMediaIconConverter';
import {IconButton} from '@mui/material';
import {getBirthdayString} from '../../functions/dateFormatter';
import CustomAvatarCollection from '../CustomAvatarCollection/CustomAvatarCollection';

const EncounterDrawer = (props) => {
  const unknownDetail = <span className={classes.UnknownText}>Unknown</span>;

  return (
    <Drawer
      sx={{
        'width': '460px',
        'flexShrink': 0,
        '& .MuiDrawer-paper': {
          width: '460px',
          boxSizing: 'border-box',
        },
      }}
      variant="persistent"
      anchor="right"
      open={props.open}
      data-testid="drawer-element"
    >
      <div className={classes.EncounterDrawer}>
        <div className={classes.ContentContainer}>
          <h1 className={classes.EncounterTitle} data-testid={'title-element'}>
            {props.encounterTitle}
          </h1>
          <div className={classes.SubtitleContainer}>
            <h3 className={classes.EncounterSubtitle}>You encountered: </h3>
            <CustomAvatarCollection persons={props.persons}/>
          </div>
          <div
            className={classes.EncounterProperty}
            data-testid="date-met-element"
          >
            {'Date we met: '}
            {props.dateMet ?
            getDateLastMetString(props.dateMet) :
            unknownDetail}
          </div>
          <div
            className={classes.EncounterProperty}
            data-testid="location-element"
          >
            {'Location: '}
            {props.location ? props.location : unknownDetail}
          </div>
          <h2>Details:</h2>
          <p className={classes.EncounterDetails} data-testid="details-element">
            {props.encounterDetail}
          </p>
        </div>
      </div>
    </Drawer>
  );
};

EncounterDrawer.propTypes = {
  open: PropTypes.bool.isRequired,
  id: PropTypes.string,
  encounterTitle: PropTypes.string.isRequired,
  persons: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    first_name: PropTypes.string.isRequired,
    last_name: PropTypes.string.isRequired,
    img: PropTypes.string,
  })).isRequired,
  dateMet: PropTypes.instanceOf(Date),
  location: PropTypes.string,
  encounterDetail: PropTypes.string.isRequired,
};

export default EncounterDrawer;
