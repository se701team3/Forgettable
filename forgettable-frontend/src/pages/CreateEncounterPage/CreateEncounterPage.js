/* eslint-disable max-len */
import React, {useEffect} from 'react';
import classes from './CreateEncounterPage.module.css';
import {Card} from '@mui/material';
import TextField from '@mui/material/TextField';
import CustomButton from '../../components/CustomButton/CustomButton';
import {Autocomplete} from '@mui/material';
import {createEncounter, getAllPersons} from '../../services';
import {Link} from 'react-router-dom';

export default function CreateEncountersPage() {
  const [optionsList, setOptionsList] = React.useState([]);
  const [encounter, setEncounter] = React.useState({
    title: '',
    date: null,
    location: null,
    description: '',
    persons: [],
  });
  const [isSubmittable, setIsSubmittable] = React.useState(false);
  const [showWarning, setShowWarning] = React.useState(false);

  async function getData() {
    let peopleResult = [];
    peopleResult = await getAllPersons();

    // format the people for the autocomplete list
    const options = [];
    peopleResult.forEach((person) => {
      options.push({label: person.first_name, id: person._id});
    });

    setOptionsList(options);
  }

  useEffect(() => {
    try {
      getData();
    } catch (err) {
      console.log(err);
    }
  }, []);

  const handlePersonChange=(event, value)=>{
    if (encounter.title != '' && value.length != 0) {
      setIsSubmittable(true);
      setShowWarning(false);
    }
    const personArr = [];
    value.forEach((person)=>{
      personArr.push(person.id);
    });
    setEncounter({...encounter, persons: personArr});
  };

  const handleDateChange=(event)=>{
    setEncounter({...encounter, date: event.target.value});
  };

  const handleTitleChange=(event)=>{
    if (event.target.value != '' && encounter.persons.length != 0) {
      setIsSubmittable(true);
      setShowWarning(false);
    }
    setEncounter({...encounter, title: event.target.value});
  };

  const handleLocationChange=(event)=>{
    setEncounter({...encounter, location: event.target.value});
  };
  const handleDescriptionChange=(event)=>{
    setEncounter({...encounter, description: event.target.value});
  };

  const handleSaveClick = (event) => {
    if (!encounter.title || encounter.persons.length === 0) {
      // tell user title is must be included and there must be people selected
    } else {
      setEncounter({...encounter, time_updated: Date()});
      saveEncounter(encounter);
    };
  };

  const handleShowWarning = (event) => {
    setShowWarning(true);
  };

  async function saveEncounter(encounterToPost) {
    try {
      await createEncounter(encounterToPost);
    } catch (err) {
      console.log('something went wrong when creating an encounter');
      console.log(err);
    }
  }

  return (
    <div className={classes.Card}>
      <Card sx={{borderRadius: 6, boxShadow: 0}}>
        <div className={classes.CardContent}>
          <div className={classes.Title}>Create Encounter</div>

          <div className={classes.SubTitle}>
            <div className={classes.InputBox}>
              <TextField
                size='small'
                id="fullWidth"
                sx={{width: 1/1}} /* setting width to 100% so it can be scaled in css */
                color='info'
                value={encounter.title}
                onChange={handleTitleChange}
                placeholder='Title of Encounter'
              />
            </div>
          </div>


          <div className={classes.TextField}>
            <div className={classes.Text}>You Encountered*:</div>
            <div className={classes.InputBox}>
              <Autocomplete
                multiple
                id="tags-outlined"
                size='small'
                options={optionsList}
                getOptionLabel={(option) => option.label}
                defaultValue={[]}
                filterSelectedOptions={true}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="People"
                  />
                )}
                onChange={handlePersonChange}
              />
            </div>
          </div>


          <div className={classes.TextField}>
            <div className={classes.Text}>Date we met:</div>
            <input className={classes.DateInput}
              type='date'
              name='date_met'
              value={encounter.date}
              onChange={handleDateChange}
            />
          </div>


          <div className={classes.TextField}>
            <div className={classes.Text}>Where we met:</div>
            <div className={classes.InputBox}>
              <TextField
                size='small'
                id="fullWidth"
                sx={{width: 1/1}}
                color='info'
                value={encounter.location}
                onChange={handleLocationChange}
              />
            </div>
          </div>

          <div>
            <div className={classes.Details}>Details:</div>
            <div className={classes.InputBox}>
              <TextField
                fullWidth
                id="fullWidth"
                multiline
                color='info'
                rows={7}
                value={encounter.description}
                onChange={handleDescriptionChange}
              />
            </div>
          </div>


          <div className={classes.Buttons}>
            <Link to="/encounters" style={{textDecoration: 'none'}}>
              <CustomButton btnText='Cancel' className='Button' onClick={()=>{}}/>
            </Link>
            {isSubmittable ?
            <Link to="/encounters" style={{textDecoration: 'none'}} onClick={handleSaveClick} enabled={isSubmittable}>
              <CustomButton btnText='Save' className='Button' onClick={()=>{}}/>
            </Link> :
            <CustomButton btnText='Save' className='Button' onClick={handleShowWarning}/>
            }
          </div>

          <div className={classes.WarningText}>
            {showWarning && 'Encounters must have a title and at least one person'}
          </div>


        </div>
      </Card>

    </div>
  );
}
