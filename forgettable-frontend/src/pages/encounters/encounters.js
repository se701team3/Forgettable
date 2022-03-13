import React from 'react';
import EncounterCard from '../../components/EncounterCard/EncounterCard';
import SearchBar from '../../components/SearchBar/SearchBar';
import classes from './encounters.module.css';
import AddIcon from '@mui/icons-material/Add';
import {Button} from '@mui/material';

export default function Encounters() {
  const persons = [
    {first_name: 'Kent', last_name: 'Dodds'},
    {first_name: 'Jed', last_name: 'Watson'},
    {first_name: 'Marley', last_name: 'George'},
    {first_name: 'Jack', last_name: 'Winston'},
    {first_name: 'John', last_name: 'Doe'},
  ];
  const title = 'Example Title';
  const description = 'Example Description';
  const location = 'Example Location';
  const isInitialEncounter = false;

  const onClick = () => {
    console.log('card click');
  };

  const onDelete = () => {
    console.log('delete');
  };

  return (
    <div className={classes.Container}>
      <section className={classes.Left}>
        <div className={classes.Header}>
          Encounters
        </div>
        <div className={classes.Utilities}>
          <SearchBar placeholder={'Search'}/>
        </div>
        <div className={classes.List}>
          <EncounterCard
            title={title}
            description={description}
            location={location}
            persons={persons}
            onClick={onClick}
            onDelete={onDelete}
            isInitialEncounter={isInitialEncounter}
          />
        </div>
      </section>
      <section className={classes.Right}>

      </section>
    </div>
  );
}
