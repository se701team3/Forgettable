import React from 'react';
import classes from './Loading.module.css';

const Loading = (props) => {
  return (
    <div className={classes.Loading}>

      <p>{props.text || 'Signing you in...'}</p>

    </div>
  );
};

export default Loading;
