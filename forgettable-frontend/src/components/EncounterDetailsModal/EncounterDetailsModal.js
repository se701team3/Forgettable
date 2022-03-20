import React from 'react';
import {Modal} from '@mui/material';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import CustomModal from '../CustomModal/CustomModal';
import {getLongDateStringWithSlashes} from '../../functions/dateFormatter';
import {Avatar} from '@mui/material';
import classes from './EncounterDetailsModal.module.css';
import CustomButton from '../CustomButton/CustomButton';
import CustomAvatarCollection from '../CustomAvatarCollection/CustomAvatarCollection';
import UnknownDetail from '../UnknownDetail/UnknownDetail';

/*
 * Component for displaying encounter details in a pop-up modal
 *
 * Author: Raina Song (rainasong)
 */
function EncounterDetailsModal(props) {
  const {open, onClose, onDelete, className, encounter} = props;

  return (
    <CustomModal
      open={open}
      onClose={onClose}
      hasCancel={false}
      hasConfirm={false}
      className={className}
      onDelete={onDelete}
    >
      <div className={classes.ContentContainer}>
        <div className={classes.Content}>
          <h1 className={classes.EncounterTitle} data-testid={'title-element'}>
            {encounter.title}
          </h1>
          <div className={classes.SubtitleContainer}>
            <h3 className={classes.EncounterSubtitle}>You encountered: </h3>
            <CustomAvatarCollection persons={encounter.persons}/>
          </div>
          <div
            className={classes.EncounterProperty}
            data-testid="date-met-element"
          >
            {'Date we met: '}
            {encounter.date ?
            getLongDateStringWithSlashes(encounter.date) :
            <UnknownDetail/>}
          </div>
          <div
            className={classes.EncounterProperty}
            data-testid="location-element"
          >
            {'Location: '}
            {encounter.location ? encounter.location : <UnknownDetail/>}
          </div>
          <h2>Details:</h2>
          <p className={classes.EncounterDetails} data-testid="details-element">
            {encounter.description}
          </p>
        </div>
        <div>
          <CustomButton className={classes.DeleteButton} btnText={'Delete'} onClick={onDelete}/>
        </div>
      </div>
    </CustomModal>
  );
}

EncounterDetailsModal.propTypes = {
  open: PropTypes.bool.isRequired,
  hasCancel: PropTypes.bool,
  hasConfirm: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func,
  className: PropTypes.string,
  onDelete: PropTypes.func.isRequired,
  encounter: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    persons: PropTypes.arrayOf(PropTypes.shape({
      first_name: PropTypes.string.isRequired,
      last_name: PropTypes.string,
      img: PropTypes.string,
    })),
    date: PropTypes.instanceOf(Date),
    location: PropTypes.string.isRequired,
  }),
};

export default EncounterDetailsModal;
