import React from 'react';
import classes from './PersonDrawer.module.css';
import {Avatar, Drawer} from '@mui/material';
import PropTypes from 'prop-types';
import {getFirstMetTimeString} from '../../functions/dateFormatter';

const PersonDrawer = (props) => {
  const unknownDetail = <span className={classes.UnknownText}>Unknown</span>;

  return (
    <Drawer
      sx={{
        'width': '460px',
        'flexShrink': 0,
        '& .MuiDrawer-paper': {
          width: '460px',
          boxSizing: 'border-box',
        },
      }}
      variant="persistent"
      anchor="right"
      open={open}
    >
      <div className={classes.PersonDrawer}>
        <div className={classes.ContentContainer}>
          <Avatar
            alt={props.name}
            // this style is written inline because MUI does not support className
            style={{
              height: '200px',
              width: '200px',
              backgroundColor:
                getComputedStyle(document.body).getPropertyValue('--prmry'),
              fontSize:
                getComputedStyle(document.body).getPropertyValue('--text-xxlarge')
              ,
            }}
            src={props.img}
          />
          <div className={classes.InfoHeader}>
            <h1>{props.name}</h1>
            <h2>First met {getFirstMetTimeString(props.firstMet)}</h2>
          </div>
          <div className={classes.InfoContent}>
            <p>Age: {props.birthday? <span className={classes.KnownText}>34</span> : unknownDetail}</p>
            <p>Gender: {props.gender ? <span>Female</span> : unknownDetail}</p>
            <p>Birthday: {props.birthday ? <span>13/12/2000</span> : unknownDetail}</p>
            <p>Organisation: {props.organisation ? <span>Google</span> : unknownDetail}</p>
            <p>Location: {props.location ? <span>Sydney</span> : unknownDetail}</p>
            <p>Date first met: {props.firstMet ? <span>13/12/2009</span> : unknownDetail}</p>
            <p>Their interests: {props.interests ? <span>Sydney</span> : unknownDetail}</p>
          </div>
        </div>
      </div>
    </Drawer>
  );
};

PersonDrawer.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
  img: PropTypes.string,
  socialMedias: PropTypes.arrayOf(PropTypes.string),
  firstMet: PropTypes.instanceOf(Date),
};

export default PersonDrawer;
