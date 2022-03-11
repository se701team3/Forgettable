import {Button} from '@mui/material';
import React from 'react';
import CustomButton from '../../components/CustomButton/CustomButton';
import SearchBar from '../../components/SearchBar/SearchBar';
import classes from './App.module.css';
import AddIcon from '@mui/icons-material/Add';

function App() {
  // @TODO: Input real data.
  const user = {first_name: 'Noah'};

  return (
    <div className={classes.home_container}>
      <div className={classes.home_title}>
        Hi {user.first_name}, Welcome back!
      </div>
      <div className={classes.home_searchArea}>
        <SearchBar />
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          className={classes.home_newEntryBtn}
        >
          New Entry
        </Button>
      </div>
      <div className={classes.home_subtitleContainer}>
        <div className={classes.home_subtitle}>Recently Updated</div>
        <CustomButton btnText='View All' onClick={() => {}} />
      </div>
      <div>This is where the people grid will go</div>
      <div className={classes.home_subtitleContainer}>
        <div className={classes.home_subtitle}>Recently Encounters</div>
        <CustomButton btnText='View All' onClick={() => {}} />
      </div>
      <div>This is where the encounters grid will go</div>
    </div>
  );
}

export default App;
