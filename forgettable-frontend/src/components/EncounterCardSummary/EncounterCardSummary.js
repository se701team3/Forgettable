import React from 'react';
import {Avatar} from '@mui/material';
import classes from './EncounterCardSummary.module.css';
import {getLongDateStringWithSlashes} from '../../functions/dateFormatter';
import UnknownDetail from '../UnknownDetail/UnknownDetail';
import PropTypes from 'prop-types';
import {getImageSrcFromBuffer} from '../../functions/getImageSrcFromBuffer';

/*
 * Component for displaying information of an encounter in a list.
 * This is the small version of the encounter card.
 *
 * Author: Mercury Lin (lin8231)
 */
const EncounterCardSummary = (props) => {
  return (
    <div
      className={classes.EncounterCardSummary}
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
            <p data-testid="location-element">
              Met at: {props.location || 'some cool place'}
            </p>
          </div>
        </div>
        <div className={classes.DetailsContainer}>
          <p >
            {'Date you met: '}
            {props.dateMet ?
           <span data-testid="date-met-element">
             { getLongDateStringWithSlashes(props.dateMet)}
           </span> :
           <UnknownDetail/>}
          </p>
          <p
            className={classes.DescriptionText}
            data-testid="description-element">
            {props.description}
          </p>
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
  location: PropTypes.string,
};

export default EncounterCardSummary;
