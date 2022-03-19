import React from 'react';
import classnames from 'classnames';
import classes from './CustomButton.module.css';

function CustomButton(props) {
  const {
    btnText, onClick, className,
  } = props;
  return (
    <button className={classnames(classes.Button, className)} onClick={onClick}>
      <p className={classnames(classes.Text, props.textStyle)}>{ btnText }</p>
    </button>
  );
}

export default CustomButton;
