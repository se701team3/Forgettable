import React from 'react';
import {Avatar} from '@mui/material';
import classes from './EncounterCardSummary.module.css';
import {getLongDateStringWithSlashes} from '../../functions/dateFormatter';
import UnknownDetail from '../UnknownDetail/UnknownDetail';
import PropTypes from 'prop-types';

const EncounterCardSummary = (props) => {
  return (
    <div className={classes.EncounterCardSummary}>
      <div className={classes.ContentContainer}>
        <div className={classes.HeaderContainer}>
          <Avatar
            alt={props.firstName}
            src={props.img}
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
            <h3>{props.firstName}</h3>
            <p >{props.description }</p>
          </div>
        </div>
        <p className={classes.Date}>
        Date you met:
          {props.dateMet ?
           getLongDateStringWithSlashes(props.dateMet) :
           <UnknownDetail/>}
        </p>
        <div className={classes.DescriptionText}>
          {classes.description}
        </div>
      </div>
    </div>
  );
};

EncounterCardSummary.propTypes = {
  id: PropTypes.string,
  firstName: PropTypes.string.isRequired,
  img: PropTypes.string,
  dateMet: PropTypes.instanceOf(Date),
  description: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default EncounterCardSummary;
