/* eslint-disable max-len */
import React, {useEffect, useState} from 'react';
import classes from './CreateEncounterPage.module.css';
import {Card} from '@mui/material';
import TextField from '@mui/material/TextField';
import CustomButton from '../../components/CustomButton/CustomButton';
import {Autocomplete} from '@mui/material';
import {createEncounter, getAllPersons} from '../../services';
import {Link, useNavigate} from 'react-router-dom';
import {toastGenerator} from '../../functions/helper';
import {ToastContainer} from 'react-toastify';
import Loading from '../Loading/Loading';
import AutocompleteLocationInput from '../../components/AutocompleteLocationInput/AutocompleteLocationInput';

export default function CreateEncountersPage() {
  const navigate = useNavigate();

  // the en-CA locale uses yyyy-mm-dd formatting which is required for the max date
  const currentDateString = new Date().toLocaleDateString('en-CA');

  const [optionsList, setOptionsList] = React.useState([]);
  const [encounter, setEncounter] = React.useState({
    title: '',
    latLong: [],
    date: currentDateString,
    description: '',
    persons: [],
  });
  const [isSubmittable, setIsSubmittable] = React.useState(false);
  const [showWarning, setShowWarning] = React.useState(false);
  const [location, setLocation] = useState('');
  const [latLong, setLatLong] = useState([]);

  const [loading, setLoading] = useState(false);

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

  const handlePersonChange = (event, value) => {
    if (encounter.title != '' && value.length != 0) {
      setIsSubmittable(true);
      setShowWarning(false);
    }
    const personArr = [];
    value.forEach((person) => {
      personArr.push(person.id);
    });
    setEncounter({...encounter, persons: personArr});
  };

  const handleDateChange = (event) => {
    setEncounter({...encounter, date: event.target.value});
  };

  const handleLatLongChange = (latLong) => {
    setEncounter({...encounter, latLong});
  };

  const handleTitleChange = (event) => {
    if (event.target.value != '' && encounter.persons.length != 0) {
      setIsSubmittable(true);
      setShowWarning(false);
    }
    setEncounter({...encounter, title: event.target.value});
  };

  const handleDescriptionChange = (event) => {
    setEncounter({...encounter, description: event.target.value});
  };

  const handleSaveClick = async (event) => {
    const currentDate = new Date(currentDateString).getTime();
    const encounterDate = new Date(encounter.date).getTime();

    if (!encounter.title || encounter.persons.length === 0 || !encounter.description || encounterDate > currentDate) {
      setShowWarning(true);
    } else {
      setShowWarning(false);
      setEncounter({...encounter, time_updated: Date()});
      await saveEncounter({...encounter, location, latLong});
    }
  };

  const handleShowWarning = (event) => {
    setShowWarning(true);
  };

  async function saveEncounter(encounterToPost) {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 5000);
    const result = await createEncounter(encounterToPost);
    if (result) {
      toastGenerator('success', 'Encounter Created!', 2000);
      setTimeout(() => {
        navigate('/encounters', {state: {person: result}});
      }, 1000);
    } else {
      toastGenerator('error', 'Something went wrong... :(', 2000);
      setLoading(false);
    }
  }
  return loading ? (
    <Loading />
  ) : (
    <div className={classes.Card}>
      <Card sx={{borderRadius: 0, boxShadow: 0}}>
        <div className={classes.CardContent}>
          <div className={classes.Title}>Create Encounter</div>

          <div className={classes.SubTitle}>
            <div className={classes.InputBox}>
              <TextField
                size='small'
                id='fullWidth'
                sx={{
                  width: 1 / 1,
                }} /* setting width to 100% so it can be scaled in css */
                color='info'
                value={encounter.title}
                onChange={handleTitleChange}
                placeholder='Title of Encounter'
              />
            </div>
          </div>

          <div className={classes.TextField}>
            <div className={classes.Text}>You Encountered:</div>
            <div className={classes.InputBox}>
              <Autocomplete
                multiple
                id='tags-outlined'
                size='small'
                options={optionsList}
                getOptionLabel={(option) => option.label}
                defaultValue={[]}
                filterSelectedOptions={true}
                renderInput={(params) => (
                  <TextField {...params} placeholder='People' />
                )}
                onChange={handlePersonChange}
              />
            </div>
          </div>

          <div className={classes.TextField}>
            <div className={classes.Text}>Date we met:</div>
            <input
              className={classes.DateInput}
              type='date'
              max={currentDateString}
              name='date_met'
              value={encounter.date}
              onChange={handleDateChange}
            />
          </div>

          <div className={classes.TextField}>
            <div className={classes.Text}>Where we met:</div>
            <AutocompleteLocationInput
              setLocation={setLocation}
              className={classes.InputBox}
              setLatLong={setLatLong}
            />
          </div>

          <div>
            <div className={classes.Details}>Details:</div>
            <div className={classes.InputBox}>
              <TextField
                fullWidth
                id='fullWidth'
                multiline
                color='info'
                rows={7}
                value={encounter.description}
                onChange={handleDescriptionChange}
              />
            </div>
          </div>

          <div className={classes.Buttons}>
            <CustomButton
              btnText='Cancel'
              className='Button'
              onClick={() => {
                navigate('/people');
              }}
            />
            {isSubmittable ? (
              <CustomButton
                btnText='Save'
                className='Button'
                onClick={handleSaveClick}
              />
            ) : (
              <CustomButton
                btnText='Save'
                className='Button'
                onClick={handleShowWarning}
              />
            )}
          </div>

          <div className={classes.WarningText}>
            {showWarning && 'Encounters must have a title, a description, at least one person and must not take place in the future'}
          </div>
        </div>
      </Card>
      <ToastContainer
        position='bottom-center'
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}
