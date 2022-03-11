import {Avatar} from '@mui/material';
import React from 'react';
import classes from './PersonCardSummary.module.css';

const PersonCardSummary = (props) => {
  return (

    <div className={classes.PersonCardSummary}>
      <div className={classes.ContentContainer}>
        <Avatar
          alt={'Person Name'}
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
            {props.name || 'Person'}
          </h3>
          <p>
              allalaal ajfksl iwfqoj askl fwqai o
          </p>
        </div>
      </div>
    </div>


  );
};

export default PersonCardSummary;
