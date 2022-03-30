import React from 'react';
import {CircularProgress} from '@mui/material';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const GoalSummary = (props) => {
  const {encounters, encountered, endDate} = props;
  const progress = (encountered/encounters)*100;

  if (progress != 100) {
    return (
      <div>
        <Box sx={{position: 'relative', display: 'inline-flex'}}>
          <CircularProgress
            color="success" size={75} variant="determinate" value={-progress} />
          <Box
            sx={{
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              position: 'absolute',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography
              variant="caption" component="div" color="black">
              {`${encountered}/${encounters}`}
            </Typography>
          </Box>
        </Box>

        <p>Welldone!</p>

      </div>
    );
  } else {
    return (
      <div>
        <p>
            None set, you can create a new goal here
        </p>
      </div>
    );
  }
};

export default GoalSummary;
