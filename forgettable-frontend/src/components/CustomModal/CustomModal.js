import React from 'react';
import {Modal} from '@mui/material';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import CustomButton from '../CustomButton/CustomButton';
import classes from './CustomModal.module.css';

function CustomModal(props) {
  const {open, onClose, hasCancel, hasConfirm, onConfirm, className} = props;

  return (
    <Modal
      open={open}
      onClose={onClose}
    >
      <div className={classnames(classes.Container, className)}>
        <div>{props.children}</div>
        <div className={classes.Footer}>
          {hasCancel &&
          <CustomButton btnText={'Cancel'} onClick={onClose}/>}
          {hasConfirm &&
          // eslint-disable-next-line max-len
          <CustomButton btnText={'Confirm'} onClick={onConfirm} className={classes.warning} warning={classes.warning}/>}
        </div>
      </div>
    </Modal>);
}

CustomModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  hasCancel: PropTypes.bool,
  hasConfirm: PropTypes.bool,
  onConfirm: PropTypes.func,
  className: PropTypes.string,
};

export default CustomModal;
