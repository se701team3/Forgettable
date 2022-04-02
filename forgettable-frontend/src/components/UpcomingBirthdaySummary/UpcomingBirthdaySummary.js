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
<<<<<<< HEAD
            alt={props.name}
=======
            alt={props.firstName}
>>>>>>> 032f914974408b1a7dd5cb7910b4e231deabc3c5
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
<<<<<<< HEAD
            <h3 data-testid="name-element">{props.name}</h3>
=======
            <h3 data-testid="name-element">{props.firstName}</h3>
>>>>>>> 032f914974408b1a7dd5cb7910b4e231deabc3c5
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
<<<<<<< HEAD
  name: PropTypes.string.isRequired,
=======
  firstName: PropTypes.string.isRequired,
>>>>>>> 032f914974408b1a7dd5cb7910b4e231deabc3c5
  img: PropTypes.string,
  birthday: PropTypes.instanceOf(Date),
  onClick: PropTypes.func.isRequired,
};

export default UpcomingBirthdaySummary;
