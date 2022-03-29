import {Button} from '@mui/material';
import React from 'react';
import classes from './SearchFilterPanel.module.css';
import CustomButton from '../../components/CustomButton/CustomButton';

const SearchFilterPanel = ({filterType}) => {
  /*
    The filters should be the properties of the model object.
    */
  if (filterType === 'encounter') {
    return (
      <div>
        <h3>Filters</h3>
        <div className={classes.filterSelectionPanel}>
          <CustomButton btnText="Title" />
          <CustomButton btnText="Date" />
          <CustomButton btnText="Location" />
          <CustomButton btnText="Description" />
        </div>
      </div>
    );
  } else if (filterType === 'person') {
    return (
      <div>
        <h3>Filters</h3>
        <div className={classes.filterSelectionPanel}>
          <CustomButton btnText="Name" />
          <CustomButton btnText="Birthday" />
          <CustomButton btnText="Gender" />
          <CustomButton btnText="Location" />
          <CustomButton btnText="Importance" />
          <CustomButton btnText="Interests" />
          <CustomButton btnText="Organisation" />
        </div>
      </div>
    );
  } else {
    return (
      <div className={classes.searchFilterPanel}>
        <div>
          <h3>Encounter Filters</h3>
          <div className={classes.filterSelectionPanel}>
            <CustomButton btnText="Title" />
            <CustomButton btnText="Date" />
            <CustomButton btnText="Location" />
            <CustomButton btnText="Description" /></div>

        </div>
        <div>
          <h3>Person Filters</h3>
          <div className={classes.filterSelectionPanel}>
            <CustomButton btnText="Name" />
            <CustomButton btnText="Birthday" />
            <CustomButton btnText="Gender" />
            <CustomButton btnText="Location" />
            <CustomButton btnText="Importance" />
            <CustomButton btnText="Interests" />
            <CustomButton btnText="Organisation" />
          </div>
        </div>
      </div>
    );
  }
};

export default SearchFilterPanel;
