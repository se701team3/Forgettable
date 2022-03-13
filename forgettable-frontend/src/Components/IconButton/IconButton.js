/* eslint-disable max-len */
import React from 'react';
import {Button} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

function IconButton({btnText, onClick, includeIcon}) {
  const prmry = getComputedStyle(document.documentElement).getPropertyValue('--prmry');
  const txt3 = getComputedStyle(document.documentElement).getPropertyValue('--txt3');
  const fontMedium = getComputedStyle(document.documentElement).getPropertyValue('--font-medium');
  const textLarge = getComputedStyle(document.documentElement).getPropertyValue('--text-large');
  const radiusBtn = getComputedStyle(document.documentElement).getPropertyValue('--radius-btn');

  return (
    <Button
      variant="contained"
      startIcon={includeIcon && <AddIcon />}
      style={{
        backgroundColor: prmry,
        color: txt3,
        fontWeight: fontMedium,
        fontSize: textLarge,
        textTransform: 'none',
        borderRadius: radiusBtn,
        paddingLeft: '42px',
        paddingRight: '42px',
        fontFamily: '\'Poppins\', sans-serif',
        boxShadow: 'none',
        height: '100%',
      }}
      onClick={onClick}
    >
      {btnText}
    </Button>
  );
}

export default IconButton;
