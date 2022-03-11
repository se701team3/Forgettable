/* eslint-disable max-len */
import * as React from 'react';
import Card from '@mui/material/Card';
import CustomButton from '../CustomButton/CustomButton';
import {AvatarGroup, Avatar} from '@mui/material';
import classes from './EncounterCard.module.css';

export default function EncounterCard(props) {
  const {title, details, date, location} = props;
  const isInitialEncounter = false;
  const person = 'Marley';
  const persons = [
    {name: 'sam', avatar: 'r'},
    {name: 'sam', avatar: 'r'},
    {name: 'sam', avatar: 'r'},
  ];

  const handleCardClick = () => {
    console.log('card click!');
  };

  const handleDelete = () => {
    console.log('delete');
  };

  return (
    <div className={classes.Container}>
      <Card className={isInitialEncounter ? classes.Card_special : classes.Card}>
        <div className={classes.Card_content}>
          <div onClick={handleCardClick}>
            <section className={classes.Header}>
              <div className={classes.Title}>
                {title}
              </div>
              <div className={classes.Profile_container}>
                {person}
              </div>
            </section>
            <section className={classes.Body}>
              {details}
            </section>
          </div>
          <section className={classes.Footer}>
            <div className={classes.Date}>
                Date we met: <div>{date}</div>
            </div>
            <div className={classes.Location}>
                Where we met: <div>{location}</div>
            </div>
            <CustomButton className={classes.Button} btnText={'Delete'} onClick={handleDelete}/>
          </section>
        </div>
      </Card>
    </div>
  );
}
