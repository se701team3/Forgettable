import React from 'react';
import classes from './PersonDrawer.module.css';
import {Drawer} from '@mui/material';

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


        </div>
      </div>
    </Drawer>
  );
};

export default PersonDrawer;
