import React from 'react';
import classes from './PersonDrawer.module.css';
import {Avatar, Drawer} from '@mui/material';

const PersonDrawer = (props) => {
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
            alt={'Name'}
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
            <h1>Name Person</h1>
            <h2>First met some time</h2>
          </div>
          <div className={classes.InfoContent}>
              content
          </div>
        </div>
      </div>
    </Drawer>
  );
};

export default PersonDrawer;
