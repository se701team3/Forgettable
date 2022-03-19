import {Avatar} from '@mui/material';
import React from 'react';
import classes from './PersonCardSummary.module.css';
import {getFirstMetTimeString} from '../../functions/dateFormatter';
import PropTypes from 'prop-types';
import {getImageSrcFromBuffer} from '../../functions/getImageSrcFromBuffer';

/*
 * Component for displaying information of a person in a list.
 * This is the small version of the person card.
 *
 * Author: Mercury Lin (lin8231)
 */
const PersonCardSummary = (props) => {
  const firstName = props.name.split(' ')[0];
  return (
    <div
      className={classes.PersonCardSummary}
      onClick={props.onClick}
      data-testid="container-card"
    >
      <div className={classes.ContentContainer}>
        <Avatar
          alt={firstName}
          // this style is written inline because MUI does not support className
          style={{
            height: '70px',
            width: '70px',
            marginRight: '14px',
            backgroundColor:
                getComputedStyle(document.body).getPropertyValue('--prmry'),
            fontSize:
                getComputedStyle(document.body)
                    .getPropertyValue('--text-xxlarge'),
          }}
          src={props.img ? getImageSrcFromBuffer(props.img) : props.img}
        />
        <div className={classes.TextInfoContainer}>
          <h3 data-testid="name-element">
            {firstName}
          </h3>
          <p data-testid="first-met-element">
              First met {getFirstMetTimeString(props.firstMet)}
          </p>
        </div>
      </div>
    </div>
  );
};

PersonCardSummary.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
  img: PropTypes.string,
  firstMet: PropTypes.instanceOf(Date),
  onClick: PropTypes.func.isRequired,
};

export default PersonCardSummary;
