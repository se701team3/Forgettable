import {TextField} from '@mui/material';
import React from 'react';
import styles from './InputComponent.module.css';
import {useState} from 'react';
import {StyledEngineProvider} from '@mui/material';

/**
 * React input component used for text entry with the possibility of
 * various stylings that can be applied.
 *
 * Note the type parameter that must be passed in. Pass in 'primary' for primary
 * input style, 'secondary' for the secondary input style, 'multiLine' for
 * the multiline style. See UI design for more details.
 */

export default function InputComponent({inputLabel, inputType, placeholder}) {
  /**
   * Retrieve state of primary input component to be rendered in a
   * responsive manner.
   * */
  const [inputState, setInput] = useState('TO DO');

  /**
   * Types allowed for input component styling.
   */
  const primary = 'primary';
  const secondary = 'secondary';
  const multiLine = 'multiLine';

  const textColour =
    getComputedStyle(document.documentElement).getPropertyValue('--ltxt1');

  return (
    <div>
      <StyledEngineProvider injectFirst>

        {inputType === primary &&
         <TextField
           className={styles.textFieldPrimary}
           label={inputLabel}
           value={inputState}
           placeholder={placeholder}
           onChange={(event) => setInput(event.target.value)}
           sx={{
             input: {color: textColour, fontSize: '23px'},
             label: {color: textColour, fontSize: '23px'},
           }}
         />
        }

        {inputType === secondary &&
         <TextField
           className={styles.textFieldSecondary}
           label={inputLabel}
           value={inputState}
           placeholder={placeholder}
           onChange={(event) => setInput(event.target.value)}
           sx={{
             input: {color: textColour, fontSize: '18px'},
             label: {color: textColour, fontSize: '18px'},
           }}
         />
        }

        {inputType === multiLine &&
         <TextField
           className={styles.textFieldMultiLine}
           label={inputLabel}
           value={inputState}
           placeholder={placeholder}
           onChange={(event) => setInput(event.target.value)}
           multiline={true}
           minRows={5}
           sx={{
             input: {color: textColour, fontSize: '16px'},
             label: {color: textColour, fontSize: '16px'},
           }}
         />
        }

      </StyledEngineProvider>
    </div>
  );
}
