/* eslint-disable max-len */
import * as React from 'react';
import Card from '@mui/material/Card';
import CustomButton from '../CustomButton/CustomButton';
import {AvatarGroup, Avatar} from '@mui/material';
import classes from './EncounterCard.module.css';
import stringAvatar from '../../functions/helper';

const DELETE = 'Delete';
const DATE_WE_MET = 'Date we met: ';
const WHERE_WE_MET = 'Where we met: ';

export default function EncounterCard(props) {
  const {isInitialEncounter, title, persons, details, date, location, onClick, onDelete} = props;
  const isMultiplePerson = persons.length > 1;

  return (
    <Card className={isInitialEncounter ? classes.Card_special : classes.Card}>
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
              <AvatarGroup max={4} className={isMultiplePerson ? classes.Avatar_multiple : classes.Avatar_inline}>
                {persons.map((person, index) => {
                  return (
                    <div key={index}>
                      <Avatar key={index} className={classes.Avatar} {...stringAvatar(`${person.first_name} ${person.last_name}`)} />
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
            {details}
          </section>
        </div>
        <section className={classes.Footer}>
          <div className={classes.Date}>
            {DATE_WE_MET}<div>{date}</div>
          </div>
          <div className={classes.Location}>
            {WHERE_WE_MET}<div>{location}</div>
          </div>
          <CustomButton className={classes.Button} btnText={DELETE} onClick={onDelete}/>
        </section>
      </div>
    </Card>
  );
}
