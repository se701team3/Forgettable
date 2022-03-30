import React from 'react';
import classnames from 'classnames';
import classes from './CustomButton.module.css';

function CustomButton(props) {
  const {
    btnText, onClick, className, warning,
  } = props;
  return (
    <button className={classnames(classes.Button, className)} onClick={onClick} type={props.type}>
      <p className={classnames(classes.Text, props.textStyle, warning)}>{ btnText }</p>
    </button>
  );
}

export default CustomButton;
