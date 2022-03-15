/* eslint-disable max-len */
import * as React from 'react';
import Card from '@mui/material/Card';
import CustomButton from '../CustomButton/CustomButton';
import {AvatarGroup, Avatar} from '@mui/material';
import classes from './EncounterCard.module.css';
import {stringAvatar} from '../../functions/helper';
import classnames from 'classnames';
import './EncounterCard.css';
import PropTypes from 'prop-types';
import {getDateString} from '../../functions/dateFormatter';
import CustomAvatar from '../CustomAvatar/CustomAvatar';

const DELETE = 'Delete';
const DATE_WE_MET = 'Date we met: ';
const WHERE_WE_MET = 'Where we met: ';

/*
 * Component for displaying information of encounter details.
 * This is the full version of the encounter card.
 *
 * Author: Raina Song (rainasong)
 */
const EncounterCard = (props) => {
  const {isInitialEncounter, title, persons, description, date, location, onClick, onDelete, className} = props;

  return (
    <div className={isInitialEncounter ? classes.Card_special : classes.Card}>
      <div className={classnames(classes.Card_content, className)}>
        <div onClick={onClick}>
          {isInitialEncounter && <section className={classes.Initial_label_container}>
            <div className={classes.Initial_label}>First Encounter!</div>
          </section>}
          <section className={classes.Header}>
            <div className={classes.Title}>
              {title}
            </div>
            <div className={classes.Profile_container}>
              <CustomAvatar persons={persons}/>
            </div>
          </section>
          <section className={classes.Body}>
            {description}
          </section>
        </div>
        <section className={classes.Footer}>
          <div className={classes.Date}>
            {DATE_WE_MET}<div>{getDateString(date)}</div>
          </div>
          <div className={classes.Location}>
            {WHERE_WE_MET}<div>{location}</div>
          </div>
          <CustomButton btnText={DELETE} onClick={onDelete}/>
        </section>
      </div>
    </div>
  );
};

EncounterCard.propTypes = {
  id: PropTypes.string,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  persons: PropTypes.arrayOf(PropTypes.shape({
    first_name: PropTypes.string.isRequired,
    last_name: PropTypes.string.isRequired,
    img: PropTypes.string,
  })),
  date: PropTypes.instanceOf(Date),
  location: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  isInitialEncounter: PropTypes.bool.isRequired,
  className: PropTypes.string,
};

export default EncounterCard;
