import {Button, Modal} from '@mui/material';
import React from 'react';
import classes from './SearchFilterModal.module.css';
import CustomButton from '../CustomButton/CustomButton';
import {Box} from '@mui/system';

const SearchFilterPanel = ({filterType}) => {
  /*
    The filters should be the properties of the model object.
    */
  if (filterType === 'encounter') {
    return (
      <Modal>
        <Box>
          <h3>Filters</h3>
          <div className={classes.filterSelectionPanel}>
            <CustomButton btnText="Title" />
            <CustomButton btnText="Date" />
            <CustomButton btnText="Location" />
            <CustomButton btnText="Description" />
          </div>
        </Box>
      </Modal>

    );
  } else if (filterType === 'person') {
    return (
      <Modal>
        <Box>
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
      </Modal>
    );
  } else {
    return (
      <Modal>
        <Box>
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
      </Modal>
    );
  }
};

export default SearchFilterPanel;
