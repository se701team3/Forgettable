import React from 'react';
import {Avatar} from '@mui/material';
import classes from './UpcomingBirthdaySummary.module.css';
import {getBirthdayDate} from '../../functions/dateFormatter';
import UnknownDetail from '../UnknownDetail/UnknownDetail';
import PropTypes from 'prop-types';
import {getImageSrcFromBuffer} from '../../functions/getImageSrcFromBuffer';

/*
 * Component for displaying information for upcoming birthdays.
 * Based off of EncounterCardSummary and PersonCardSummary components
 * orginally authored by Mercury Lin (lin8231)
 *
 * Author: Aaron Song (ason720)
 */
const UpcomingBirthdaySummary = (props) => {
  return (
    <div
      className={classes.UpcomingBirthdaySummary}
      onClick={props.onClick}
      data-testid="container-card"
    >
      <div className={classes.ContentContainer}>
        <div className={classes.HeaderContainer}>
          <Avatar
            alt={props.firstName}
            src={getImageSrcFromBuffer(props.img)}
            sx={{
              height: '70px',
              width: '70px',
              marginRight: '14px',
              backgroundColor:
                getComputedStyle(document.body).getPropertyValue('--prmry'),
              fontSize:
                getComputedStyle(document.body)
                    .getPropertyValue('--text-xxlarge'),
            }}
          />
          <div className={classes.IdentityInfoConatiner}>
            <h3 data-testid="name-element">{props.firstName}</h3>
          </div>
        </div>
        <div className={classes.DetailsContainer}>
          <p>
            {'Birthday: '}
            {props.birthday ?
              <span data-testid="birthdate-element">
                {getBirthdayDate(props.birthday)}
              </span> :
              <UnknownDetail />}
          </p>
        </div>
      </div>
    </div>
  );
};

UpcomingBirthdaySummary.propTypes = {
  id: PropTypes.string,
  firstName: PropTypes.string.isRequired,
  img: PropTypes.string,
  birthday: PropTypes.instanceOf(Date),
  onClick: PropTypes.func.isRequired,
};

export default UpcomingBirthdaySummary;
