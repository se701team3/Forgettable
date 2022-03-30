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
              className={selectedFilter == 'Title' ?
                classes.selectedButton : null}
              onClick={() => {
                if (selectedFilter != 'Title') {
                  setSelectedFilter('Title');
                } else {
                  setSelectedFilter('');
                }
              }} />
            <CustomButton btnText="Date"
              className={selectedFilter == 'Date' ?
              classes.selectedButton : null}
              onClick={() => {
                if (selectedFilter != 'Date') {
                  setSelectedFilter('Date');
                } else {
                  setSelectedFilter('');
                }
              }} />
            <CustomButton btnText="Location"
              className={selectedFilter == 'EncounterLocation' ?
              classes.selectedButton : null}
              onClick={() => {
                if (selectedFilter != 'EncounterLocation') {
                  setSelectedFilter('EncounterLocation');
                } else {
                  setSelectedFilter('');
                }
              }} />
            <CustomButton btnText="Description"
              className={selectedFilter == 'Description' ?
              classes.selectedButton : null}
              onClick={() => {
                if (selectedFilter != 'Description') {
                  setSelectedFilter('Description');
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
            <CustomButton btnText="Name"
              className={selectedFilter == 'Name' ?
              classes.selectedButton : null}
              onClick={() => {
                if (selectedFilter != 'Name') {
                  setSelectedFilter('Name');
                } else {
                  setSelectedFilter('');
                }
              }}/>
            <CustomButton btnText="Birthday"
              className={selectedFilter == 'Birthday' ?
              classes.selectedButton : null}
              onClick={() => {
                if (selectedFilter != 'Birthday') {
                  setSelectedFilter('Birthday');
                } else {
                  setSelectedFilter('');
                }
              }}/>
            <CustomButton btnText="Gender"
              className={selectedFilter == 'Gender' ?
               classes.selectedButton : null}
              onClick={() => {
                if (selectedFilter != 'Gender') {
                  setSelectedFilter('Gender');
                } else {
                  setSelectedFilter('');
                }
              }}/>
            <CustomButton btnText="Location"
              className={selectedFilter == 'PersonLocation' ?
              classes.selectedButton : null}
              onClick={() => {
                if (selectedFilter != 'PersonLocation') {
                  setSelectedFilter('PersonLocation');
                } else {
                  setSelectedFilter('');
                }
              }}/>
            <CustomButton btnText="Importance"
              className={selectedFilter == 'Importance' ?
              classes.selectedButton : null}
              onClick={() => {
                if (selectedFilter != 'Importance') {
                  setSelectedFilter('Importance');
                } else {
                  setSelectedFilter('');
                }
              }}/>
            <CustomButton btnText="Interests"
              className={selectedFilter == 'Interests' ?
              classes.selectedButton : null}
              onClick={() => {
                if (selectedFilter != 'Interests') {
                  setSelectedFilter('Interests');
                } else {
                  setSelectedFilter('');
                }
              }} />
            <CustomButton btnText="Organisation"
              className={selectedFilter == 'Organisation' ?
              classes.selectedButton : null}
              onClick={() => {
                if (selectedFilter != 'Organisation') {
                  setSelectedFilter('Organisation');
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
                className={selectedFilter == 'Title' ?
                classes.selectedButton : null}
                onClick={() => {
                  if (selectedFilter != 'Title') {
                    setSelectedFilter('Title');
                  } else {
                    setSelectedFilter('');
                  }
                }} />
              <CustomButton btnText="Date"
                className={selectedFilter == 'Date' ?
              classes.selectedButton : null}
                onClick={() => {
                  if (selectedFilter != 'Date') {
                    setSelectedFilter('Date');
                  } else {
                    setSelectedFilter('');
                  }
                }} />
              <CustomButton btnText="Location"
                className={selectedFilter == 'EncounterLocation' ?
              classes.selectedButton : null}
                onClick={() => {
                  if (selectedFilter != 'EncounterLocation') {
                    setSelectedFilter('EncounterLocation');
                  } else {
                    setSelectedFilter('');
                  }
                }} />
              <CustomButton btnText="Description"
                className={selectedFilter == 'Description' ?
              classes.selectedButton : null}
                onClick={() => {
                  if (selectedFilter != 'Description') {
                    setSelectedFilter('Description');
                  } else {
                    setSelectedFilter('');
                  }
                }}/></div>

          </div>
          <div>
            <h3>Person Filters</h3>
            <div className={classes.filterSelectionPanel}>
              <CustomButton btnText="Name"
                className={selectedFilter == 'Name' ?
              classes.selectedButton : null}
                onClick={() => {
                  if (selectedFilter != 'Name') {
                    setSelectedFilter('Name');
                  } else {
                    setSelectedFilter('');
                  }
                }}/>
              <CustomButton btnText="Birthday"
                className={selectedFilter == 'Birthday' ?
              classes.selectedButton : null}
                onClick={() => {
                  if (selectedFilter != 'Birthday') {
                    setSelectedFilter('Birthday');
                  } else {
                    setSelectedFilter('');
                  }
                }}/>
              <CustomButton btnText="Gender"
                className={selectedFilter == 'Gender' ?
               classes.selectedButton : null}
                onClick={() => {
                  if (selectedFilter != 'Gender') {
                    setSelectedFilter('Gender');
                  } else {
                    setSelectedFilter('');
                  }
                }}/>
              <CustomButton btnText="Location"
                className={selectedFilter == 'PersonLocation' ?
              classes.selectedButton : null}
                onClick={() => {
                  if (selectedFilter != 'PersonLocation') {
                    setSelectedFilter('PersonLocation');
                  } else {
                    setSelectedFilter('');
                  }
                }}/>
              <CustomButton btnText="Importance"
                className={selectedFilter == 'Importance' ?
              classes.selectedButton : null}
                onClick={() => {
                  if (selectedFilter != 'Importance') {
                    setSelectedFilter('Importance');
                  } else {
                    setSelectedFilter('');
                  }
                }}/>
              <CustomButton btnText="Interests"
                className={selectedFilter == 'Interests' ?
              classes.selectedButton : null}
                onClick={() => {
                  if (selectedFilter != 'Interests') {
                    setSelectedFilter('Interests');
                  } else {
                    setSelectedFilter('');
                  }
                }} />
              <CustomButton btnText="Organisation"
                className={selectedFilter == 'Organisation' ?
              classes.selectedButton : null}
                onClick={() => {
                  if (selectedFilter != 'Organisation') {
                    setSelectedFilter('Organisation');
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
