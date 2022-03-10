import React from 'react';
import classes from './Dialog.module.css';

function Dialog(props) {
  const {title, desc, cancalEvent, confirmEvent} = props;
  return <div className={classes.dialog}>
    <div className={classes.title}>{title}</div>
    <div className={classes.desc}>{desc}</div>
    <div className={classes.toolbar}>
      <button className={classes.button1} onClick={cancalEvent}>Cancal</button>
      <button className={classes.button2} onClick={confirmEvent}>Confirm</button>
    </div>
  </div>;
}

export default Dialog;
