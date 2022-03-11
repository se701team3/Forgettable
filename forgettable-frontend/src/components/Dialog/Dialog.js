import {SliderMarkLabel, TextField} from '@mui/material';
import React from 'react';
import classes from './Dialog.module.css';
import PersonsLogo from '../../assets/icons/navbar/persons.svg';
import EncountersLogo from '../../assets/icons/navbar/encounters.svg';

function Modal(props) {
  const {type, title, description, input1, hint1, input2, hint2, cancalEvent, confirmEvent} = props;
  if (type=='warning') {
    return (
      <div className={classes.dialog}>
        <div className={classes.RedTitle}>{title}</div>
        <div className={classes.description}>{description}</div>
        <div className={classes.toolbar}>
          <button className={classes.button} onClick={cancalEvent}>Cancal</button>
          <button className={classes.button} onClick={confirmEvent}>Confirm</button>
        </div>
      </div>
    );
  }
  if (type=='login') {
    return (
      <div className={classes.dialog}>
        <div className={classes.title}>{title}</div>
        <div className={classes.toolbar}>
          <label className={classes.label}>{input1}</label>
          <TextField
            label={hint1}
            placeholder={hint1}
            size="small"
          />
        </div>
        <div className={classes.toolbar}>
          <label className={classes.label}>{input2}</label>
          <TextField
            label={hint2}
            placeholder={hint2}
            size="small"
          />
        </div>
        <div className={classes.toolbar}>
          <button className={classes.button} onClick={cancalEvent}>Cancal</button>
          <button className={classes.button} onClick={confirmEvent}>Confirm</button>
        </div>
      </div>
    );
  }
  if (type=='newEntry') {
    return (
      <div className={classes.SmallDialog}>
        <div className={classes.title}>{title}</div>
        <div className={classes.toolbar}>
          <button className={classes.LargeButton}>
            <img
              src={PersonsLogo}
              height={'25px'}
              width={'25px'}
              className={classes.img}
            />
            Person
          </button>
          <button className={classes.LargeButton}>
            <img
              src={EncountersLogo}
              height={'25px'}
              width={'25px'}
              className={classes.img}
            />
            Encounter
          </button>
        </div>
        <div className={classes.toolbar}>
          <button className={classes.button} onClick={cancalEvent}>Cancal</button>
        </div>
      </div>
    );
  }
  return (<div>hello</div>);
}

export default Modal;
