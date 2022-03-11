import {Avatar} from '@mui/material';
import React from 'react';
import classes from './PersonCardSummary.module.css';
import {getFirstMetTimeString} from '../../functions/dateFormatter';

/*
 * Component for displaying information of a person in a list.
 * This is the full version of the person card.
 *
 * Author: Mercury Lin (lin8231)
 */
const PersonCardSummary = (props) => {
  const firstName = props.name.split(' ')[0];
  return (
    <div
      className={classes.PersonCardSummary}
      onClick={props.onClick}
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
                    .getPropertyValue('--text-xxlarge')
            ,
          }}
          src={props.img}
        />
        <div className={classes.TextInfoContainer}>
          <h3>
            {firstName}
          </h3>
          <p>
              First met {getFirstMetTimeString(props.firstMet)}
          </p>
        </div>
      </div>
    </div>


  );
};


export default PersonCardSummary;
