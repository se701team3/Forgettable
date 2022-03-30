import {Button, Modal} from '@mui/material';
import React, {useState} from 'react';
import classes from './SearchFilterModal.module.css';
import CustomButton from '../CustomButton/CustomButton';
import {Box} from '@mui/system';

const SearchFilterModal = ({filterType, open, selectedFilter, setSelectedFilter}) => {
  /*
    The filters should be the properties of the model object.
    */
  if (filterType === 'encounter') {
    return (
      <div
        className={`${classes.encounterFilter} 
        ${open ? null : classes.hiddenPanel}` }>
        <Box className={classes.searchFilterBox}>
          <h3>Filters</h3>
          <div className={classes.filterSelectionPanel}>
            <CustomButton btnText="Title"
              className={selectedFilter == 'title' ?
                classes.selectedButton : null}
              onClick={() => {
                if (selectedFilter != 'title') {
                  setSelectedFilter('title');
                } else {
                  setSelectedFilter('');
                }
              }} />
            <CustomButton btnText="Location"
              className={selectedFilter == 'location' ?
              classes.selectedButton : null}
              onClick={() => {
                if (selectedFilter != 'location') {
                  setSelectedFilter('location');
                } else {
                  setSelectedFilter('');
                }
              }} />
            <CustomButton btnText="Description"
              className={selectedFilter == 'description' ?
              classes.selectedButton : null}
              onClick={() => {
                if (selectedFilter != 'description') {
                  setSelectedFilter('description');
                } else {
                  setSelectedFilter('');
                }
              }}/>
          </div>
        </Box>
      </div>

    );
  } else if (filterType === 'person') {
    return (
      <div
        className={`${classes.personFilter} 
        ${open ? null : classes.hiddenPanel}` }>
        <Box className={classes.searchFilterBox}>
          <h3>Filters</h3>
          <div className={classes.filterSelectionPanel}>
            <CustomButton btnText="First name"
              className={selectedFilter == 'first_name' ?
              classes.selectedButton : null}
              onClick={() => {
                if (selectedFilter != 'first_name') {
                  setSelectedFilter('first_name');
                } else {
                  setSelectedFilter('');
                }
              }}/>
            <CustomButton btnText="Last name"
              className={selectedFilter == 'last_name' ?
              classes.selectedButton : null}
              onClick={() => {
                if (selectedFilter != 'last_name') {
                  setSelectedFilter('last_name');
                } else {
                  setSelectedFilter('');
                }
              }}/>
            <CustomButton btnText="Gender"
              className={selectedFilter == 'gender' ?
               classes.selectedButton : null}
              onClick={() => {
                if (selectedFilter != 'gender') {
                  setSelectedFilter('gender');
                } else {
                  setSelectedFilter('');
                }
              }}/>
            <CustomButton btnText="Location"
              className={selectedFilter == 'location' ?
              classes.selectedButton : null}
              onClick={() => {
                if (selectedFilter != 'location') {
                  setSelectedFilter('location');
                } else {
                  setSelectedFilter('');
                }
              }}/>
            <CustomButton btnText="How we met"
              className={selectedFilter == 'how_we_met' ?
              classes.selectedButton : null}
              onClick={() => {
                if (selectedFilter != 'how_we_met') {
                  setSelectedFilter('how_we_met');
                } else {
                  setSelectedFilter('');
                }
              }}/>
            <CustomButton btnText="Organisation"
              className={selectedFilter == 'organisation' ?
              classes.selectedButton : null}
              onClick={() => {
                if (selectedFilter != 'organisation') {
                  setSelectedFilter('organisation');
                } else {
                  setSelectedFilter('');
                }
              }}/>
          </div>
        </Box>
      </div>
    );
  } else {
    return (
      <div
        className={`${classes.homeFilter} 
        ${open ? null : classes.hiddenPanel}` }>
        <Box className={classes.searchFilterBox}>
          <div>
            <h3>Encounter Filters</h3>
            <div className={classes.filterSelectionPanel}>
              <CustomButton btnText="Title"
                className={selectedFilter == 'title' ?
                classes.selectedButton : null}
                onClick={() => {
                  if (selectedFilter != 'title') {
                    setSelectedFilter('title');
                  } else {
                    setSelectedFilter('');
                  }
                }} />
              <CustomButton btnText="Location"
                className={selectedFilter == 'location' ?
              classes.selectedButton : null}
                onClick={() => {
                  if (selectedFilter != 'location') {
                    setSelectedFilter('location');
                  } else {
                    setSelectedFilter('');
                  }
                }} />
              <CustomButton btnText="Description"
                className={selectedFilter == 'description' ?
              classes.selectedButton : null}
                onClick={() => {
                  if (selectedFilter != 'description') {
                    setSelectedFilter('description');
                  } else {
                    setSelectedFilter('');
                  }
                }}/>
            </div>

          </div>
          <div>
            <h3>Person Filters</h3>
            <div className={classes.filterSelectionPanel}>
              <CustomButton btnText="First name"
                className={selectedFilter == 'first_name' ?
              classes.selectedButton : null}
                onClick={() => {
                  if (selectedFilter != 'first_name') {
                    setSelectedFilter('first_name');
                  } else {
                    setSelectedFilter('');
                  }
                }}/>
              <CustomButton btnText="Last name"
                className={selectedFilter == 'last_name' ?
              classes.selectedButton : null}
                onClick={() => {
                  if (selectedFilter != 'last_name') {
                    setSelectedFilter('last_name');
                  } else {
                    setSelectedFilter('');
                  }
                }}/>
              <CustomButton btnText="Gender"
                className={selectedFilter == 'gender' ?
               classes.selectedButton : null}
                onClick={() => {
                  if (selectedFilter != 'gender') {
                    setSelectedFilter('gender');
                  } else {
                    setSelectedFilter('');
                  }
                }}/>
              <CustomButton btnText="Location"
                className={selectedFilter == 'location' ?
              classes.selectedButton : null}
                onClick={() => {
                  if (selectedFilter != 'location') {
                    setSelectedFilter('location');
                  } else {
                    setSelectedFilter('');
                  }
                }}/>
              <CustomButton btnText="How we met"
                className={selectedFilter == 'how_we_met' ?
              classes.selectedButton : null}
                onClick={() => {
                  if (selectedFilter != 'how_we_met') {
                    setSelectedFilter('how_we_met');
                  } else {
                    setSelectedFilter('');
                  }
                }}/>
              <CustomButton btnText="Organisation"
                className={selectedFilter == 'organisation' ?
              classes.selectedButton : null}
                onClick={() => {
                  if (selectedFilter != 'organisation') {
                    setSelectedFilter('organisation');
                  } else {
                    setSelectedFilter('');
                  }
                }}/>
            </div>
          </div>
        </Box>
      </div>
    );
  }
};

export default SearchFilterModal;
