import * as React from 'react';
import {AvatarGroup, Avatar} from '@mui/material';
import classes from './CustomAvatarCollection.module.css';
import PropTypes from 'prop-types';
import {stringAvatar} from '../../functions/helper';
import {Link} from 'react-router-dom';
import {getImageSrcFromBuffer} from '../../functions/getImageSrcFromBuffer';

/*
 * Component for avatars with custom images and first names
 *
 * Author: Raina Song (rainasong)
 */
function CustomAvatarCollection(props) {
  const {persons} = props;

  return (
    <>
      {Object.values(persons).map((person, i) => {
        return (
          <div className={classes.MiniPersonProfile} key={person._id || i}>
            <Link to={{
              pathname: `/person/${person._id}`,
              state: {
                person: person,
              }}}
            style={{textDecoration: 'none'}}
            >
              <Avatar
                alt={`${person.name}`}
                {...!person.image &&
                stringAvatar(`${person.name}`)}
                src={getImageSrcFromBuffer(person.image)}
                sx={{
                  'width': '30px',
                  'height': '30px',
                }}
              />
            </Link>
            <p data-testid="name-element">{person.name}</p>
          </div>);
      })}
    </>
  );
};

CustomAvatarCollection.propTypes = {
  persons: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    image: PropTypes.string,
  })),
};

export default CustomAvatarCollection;
