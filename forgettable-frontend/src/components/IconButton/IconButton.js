/* eslint-disable max-len */
import React from 'react';
import {Button} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const CUSTOM_ICON_SIZE = '20px';

function IconButton({btnText, onClick, includeIcon, height, maxWidth, customIcon}) {
  const prmry = getComputedStyle(document.documentElement).getPropertyValue('--prmry');
  const txt3 = getComputedStyle(document.documentElement).getPropertyValue('--txt3');
  const fontMedium = getComputedStyle(document.documentElement).getPropertyValue('--font-medium');
  const textLarge = getComputedStyle(document.documentElement).getPropertyValue('--text-large');
  const radiusBtn = getComputedStyle(document.documentElement).getPropertyValue('--radius-btn');

  let icon = <AddIcon />;
  if (customIcon) {
    icon = <img
      src={customIcon}
      alt="Button Icon"
      height={CUSTOM_ICON_SIZE}
      width={CUSTOM_ICON_SIZE}
    />;
  }

  return (
    <Button
      variant="contained"
      startIcon={includeIcon && icon}
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
        height: height || '100%',
        maxWidth: maxWidth || 'none',
      }}
      onClick={onClick}
    >
      {btnText}
    </Button>
  );
}

export default IconButton;
