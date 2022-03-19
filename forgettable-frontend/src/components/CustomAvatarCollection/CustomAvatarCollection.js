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
        return (<div className={classes.MiniPersonProfile} key={person._id || i}>
          <Link to={{
            pathname: `/person/${person._id}`,
            state: {
              person: person,
            }}}
          style={{textDecoration: 'none'}}
          >
            <Avatar
              alt={`${person.first_name} ${person.last_name}`}
              {...!person.image && stringAvatar(`${person.first_name} ${person.last_name}`)}
              src={getImageSrcFromBuffer(person.image)}
              sx={{
                'width': '30px',
                'height': '30px',
              }}
            />
          </Link>
          <p data-testid="name-element">{person.first_name}</p>
        </div>);
      })}
    </>
  );
};

CustomAvatarCollection.propTypes = {
  persons: PropTypes.arrayOf(PropTypes.shape({
    first_name: PropTypes.string.isRequired,
    last_name: PropTypes.string.isRequired,
    image: PropTypes.string,
  })),
};

export default CustomAvatarCollection;
