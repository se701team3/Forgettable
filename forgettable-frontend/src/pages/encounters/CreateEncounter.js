import React from 'react';
import classes from './CreateEncounter.module.css';
import SearchBar from '../../Components/SearchBar/SearchBar';
import {Card} from '@mui/material';
import TextField from '@mui/material/TextField';
import CustomButton from '../../Components/CustomButton/CustomButton';
import {Autocomplete} from '@mui/material';


export default function Encounters() {
  const options = ['Flynn', 'Jared'];
  return (
    <div className={classes.Card}>
      <Card sx={{Width: 910, Height: 875, bgcolor: 'var(--lcard)', borderRadius: 6, boxShadow: 0}}>
        <div className={classes.CardContent}>
          <div className={classes.Title}>Create Encounter</div>
          <div className={classes.SubTitle}>
            <div className={classes.SubHeader}>You Encountered:</div>
            <div className={classes.SearchBar}>
              <Autocomplete
                id="combo-box-demo"
                options={options}
                sx={{width: 250}}
                size='small'
                renderInput={(params) => <TextField {...params} label="" />}
              />
            </div>
          </div>
          <div className={classes.Text}>Date we met: 12/02/2022</div>
          <div className={classes.Text}>Where we met: University Libarary</div>
          <div className={classes.Details}>Details:</div>
          <div>
            <TextField
              fullWidth
              id="fullWidth"
              multiline
              color='info'
              rows={7}
            >
            </TextField>
          </div>
          <div className={classes.Buttons}>
            <CustomButton btnText='Cancel' className='Button'></CustomButton>
            <CustomButton btnText='Save' className='Button'></CustomButton>
          </div>

        </div>

      </Card>

    </div>
  );
}
