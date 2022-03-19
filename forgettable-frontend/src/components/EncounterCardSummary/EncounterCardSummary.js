import * as React from 'react';
import Card from '@mui/material/Card';
import {Avatar} from '@mui/material';
import classes from './EncounterCardSummary.module.css';
import {getLongDateStringWithSlashes} from '../../functions/dateFormatter';
import UnknownDetail from '../UnknownDetail/UnknownDetail';
import PropTypes from 'prop-types';

const EncounterCardSummary = (props) => {
  return (
    <div className={classes.Container}>
      <Card
        className={classes.Card}
        sx={{
          maxWidth: 220,
          maxHeight: 240,
          bgcolor: 'var(--lcard)',
          borderRadius: 6,
          boxShadow: 0}}
      >
        <div className={classes.Header}>
          <Avatar
            alt={props.firstName}
            src={props.img}
            sx={{width: 70, height: 70}}
          />
          <div className={classes.NameDesc}>
            <div>{props.firstName}</div>
            <div className={classes.Description}>{props.description }</div>
          </div>
        </div>
        <div className={classes.Date}>
          <div>Date you met:&nbsp;</div>
          {props.dateMet ?
           getLongDateStringWithSlashes(props.dateMet) :
           <UnknownDetail/>}
        </div>
        <div className={classes.DescriptionText}>
          {description}
        </div>
      </Card>
    </div>
  );
};

EncounterCardSummary.propTypes = {
  id: PropTypes.string,
  firstName: PropTypes.string.isRequired,
  img: PropTypes.string,
  dateMet: PropTypes.instanceOf(Date),
  description: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default EncounterCardSummary;
