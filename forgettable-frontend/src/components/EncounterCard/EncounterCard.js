/* eslint-disable max-len */
import * as React from 'react';
import Card from '@mui/material/Card';
import CustomButton from '../CustomButton/CustomButton';
import {AvatarGroup, Avatar} from '@mui/material';
import classes from './EncounterCard.module.css';
import {stringAvatar} from '../../functions/helper';
import './EncounterCard.css';
import PropTypes from 'prop-types';
import {getDateString} from '../../functions/dateFormatter';

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
  const {isInitialEncounter, title, persons, description, date, location, onClick, onDelete} = props;
  const isMultiplePerson = persons.length > 1;

  return (
    <div className={isInitialEncounter ? classes.Card_special : classes.Card}>
      <div className={classes.Card_content}>
        <div onClick={onClick}>
          {isInitialEncounter && <section className={classes.Initial_label_container}>
            <div className={classes.Initial_label}>First Encounter!</div>
          </section>}
          <section className={classes.Header}>
            <div className={classes.Title}>
              {title}
            </div>
            <div className={classes.Profile_container}>
              <AvatarGroup max={4}
                className={isMultiplePerson ? classes.Avatar_multiple : classes.Avatar_inline}
                data-testid="persons-avatar-group"
              >
                {persons.map((person, index) => {
                  return (
                    <div key={`${index}-container`}>
                      <Avatar key={index} alt={`${person.first_name} ${person.last_name}`} className={classes.Avatar} {...!person.img && stringAvatar(`${person.first_name} ${person.last_name}`)} src={person.img} />
                      {!isMultiplePerson && <div className={classes.Avatar_name}>
                        {person.first_name}
                      </div>}
                    </div>
                  );
                },
                )}
              </AvatarGroup>
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
};

export default EncounterCard;
