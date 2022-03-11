import React from 'react';
import classes from './Dialog.module.css';

function Dialog(props) {
  const {title, description, cancalEvent, confirmEvent} = props;
  return <div className={classes.dialog}>
    <div className={classes.title}>{title}</div>
    <div className={classes.description}>{description}</div>
    <div className={classes.toolbar}>
      <button className={classes.button} onClick={cancalEvent}>Cancal</button>
      <button className={classes.button} onClick={confirmEvent}>Confirm</button>
    </div>
  </div>;
}

export default Dialog;
