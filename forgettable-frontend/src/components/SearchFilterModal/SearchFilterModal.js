import {Button, Modal} from '@mui/material';
import React from 'react';
import classes from './SearchFilterModal.module.css';
import CustomButton from '../CustomButton/CustomButton';
import {Box} from '@mui/system';

const SearchFilterModal = ({filterType, open, onClose}) => {
  /*
    The filters should be the properties of the model object.
    */
  if (filterType === 'encounter') {
    return (
      <div
        className={`${classes.encounterPosition} ${open ? null : classes.hiddenPanel}` }>
        <Box className={classes.searchFilterBox}>
          <h3>Filters</h3>
          <div className={classes.filterSelectionPanel}>
            <CustomButton btnText="Title" />
            <CustomButton btnText="Date" />
            <CustomButton btnText="Location" />
            <CustomButton btnText="Description" />
          </div>
        </Box>
      </div>

    );
  } else if (filterType === 'person') {
    return (
      <div
        className={`${classes.personPosition} ${open ? null : classes.hiddenPanel}` }>
        <Box className={classes.searchFilterBox}>
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
        </Box>
      </div>
    );
  } else {
    return (
      <div
        className={`${classes.homePosition} ${open ? null : classes.hiddenPanel}` }>
        <Box className={classes.searchFilterBox}>
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
        </Box>
      </div>
    );
  }
};

export default SearchFilterModal;
