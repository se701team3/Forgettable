import React from 'react';
import classes from './CustomModal.module.css';
import {Modal} from '@mui/material';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import CustomButton from '../CustomButton/CustomButton';

function CustomModal(props) {
  const {open, onClose, hasCancel, hasConfirm, onConfirm} = props;

  return (
    <Modal
      open={open}
      onClose={onClose}
    >
      <div className={classnames(classes.Container, props.className)}>
        <div>{props.children}</div>
        <div className={classes.Footer}>
          {hasCancel && <CustomButton btnText={'Cancel'} onClick={onClose}/>}
          {hasConfirm && <CustomButton btnText={'Confirm'} onClick={onConfirm}/>}
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
};

export default CustomModal;
