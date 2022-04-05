import * as React from 'react';
import {AvatarGroup, Avatar} from '@mui/material';
import classes from './CustomAvatar.module.css';
import PropTypes from 'prop-types';
import {stringAvatar} from '../../functions/helper';
import {getImageSrcFromBuffer} from '../../functions/getImageSrcFromBuffer';

/*
 * Component for single or multiple avatars with custom images
 *
 * Author: Raina Song (rainasong)
 */
function CustomAvatar(props) {
  const {persons} = props;
  const isMultiplePerson = persons.length > 1;

  return (
    <AvatarGroup max={4}
      className={isMultiplePerson ? classes.Avatar_multiple : classes.Avatar_inline}
      data-testid="persons-avatar-group"
    >
      {Object.values(persons).map((person, index) => {
        return (
          <div key={`${index}-container`}>
            <Avatar key={index} alt={`${person.name}`} className={classes.Avatar} {...!person.image && stringAvatar(`${person.name}`)} src={getImageSrcFromBuffer(person.image)} />
            {!isMultiplePerson && <div className={classes.Avatar_name}>
              {person.name}
            </div>}
          </div>
        );
      },
      )}
    </AvatarGroup>
  );
};

CustomAvatar.propTypes = {
  persons: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    image: PropTypes.string,
  })),
};

export default CustomAvatar;
