import React, {useEffect} from 'react';
import {useState} from 'react';
import styles from './InputField.module.css';

/**
 * React input field component used for text entry with the possibility of
 * various stylings that can be applied.
 *
 * Note the "inputType" parameter that must be passed in. Pass in 'primary' for
 * primary input style, 'secondary' for the secondary input style, 'multiLine'
 * for the multiline style. See UI design for more details.
 *
 * Function Arguments:
 * @param inputLabel refers to the label associated with the text input component.
 * @param inputType refers to the "inputType" parameter as mentioned above.
 * @param placeholder refers to the placeholder text in the component.
 * @param dataType refers to the data format allowed as input.
 * @param inputID refers to the ID for the data associated with the input.
 * @param inputStateValue refers to the pre-filled value when the input is rendered.
 * @param autoFocusState refers to the autoFocus attribute, parameter is a Boolean.
 * @param requiredState refers to the required attribute, parameter is a Boolean.
 */

export default function InputField({inputLabel, inputType, placeholder,
  dataType, inputID, inputStateValue, autoFocusState, requiredState}) {
  /**
     * Retrieve state of input component to be rendered in a responsive manner.
     */
  const [inputState, setInput] = useState(inputStateValue);

  useEffect(() => {
    setInput(inputStateValue);
  }, [inputStateValue]);

  /**
     * Types allowed for innput component styling.
     */
  const PRIMARY = 'primary';
  const SECONDARY = 'secondary';
  const MULTILINE = 'multiLine';

  return (
    <div>

      {inputType === PRIMARY &&
        <label className={styles.inputLabelPrimary}>{inputLabel}
          <input className={styles.inputFieldPrimary}
            type={dataType}
            name={inputID}
            placeholder={placeholder}
            value={inputState}
            onChange={(event) => setInput(event.target.value)}
            autoFocus={autoFocusState}
            required={requiredState}
          />
        </label>
      }

      {inputType === SECONDARY &&
        <label className={styles.inputLabelSecondary}>{inputLabel}
          <input className={styles.inputFieldSecondary}
            type={dataType}
            name={inputID}
            placeholder={placeholder}
            value={inputState}
            onChange={(event) => setInput(event.target.value)}
            autoFocus={autoFocusState}
            required={requiredState}
          />
        </label>
      }

      {inputType === MULTILINE &&
      <label className={styles.inputLabelMultiLine}>{inputLabel}
        <textarea className={styles.inputFieldMultiLine}
          type={dataType}
          name={inputID}
          placeholder={placeholder}
          value={inputState}
          onChange={(event) => setInput(event.target.value)}
          autoFocus={autoFocusState}
          required={requiredState}
        />
      </label>
      }

    </div>
  );
}
