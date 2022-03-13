import React from 'react';
import classnames from 'classnames';
import classes from './CustomButton.module.css';

function CustomButton(props) {
  const {
    btnText, onClick, className,
  } = props;
  return (
    <div className={classnames(classes.Button, className)} onClick={onClick}>
      <p className={classes.Text}>{ btnText }</p>
    </div>
  );
}

export default CustomButton;
