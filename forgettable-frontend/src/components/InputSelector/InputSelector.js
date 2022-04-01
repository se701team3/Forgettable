import React, {useEffect} from 'react';
import {useState} from 'react';
import styles from './InputSelector.module.css';

/**
 * React input selector component used for text entry
 *
 * The styling of the component is based on that of the InputField component ("primary")
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
 * @param options refers to an array of the options to be displayed in the dropdown.
 *
 * @author Bill Song
 */

export default function InputField({inputLabel, placeholder,
  dataType, inputID, inputStateValue, autoFocusState, requiredState, options}) {
  /**
     * Retrieve state of input component to be rendered in a responsive manner.
     */
  const [inputState, setInput] = useState(inputStateValue);

  useEffect(() => {
    setInput(inputStateValue);
  }, [inputStateValue]);

  /**
   *  process options into DOM elements
   */

  const optionElements = options.map((option) => {
    return <option key={option} value={option}>{option}</option>;
  });

  /**
     * Types allowed for innput component styling.
     */

  return (
    <div>
      <label className={styles.inputLabelPrimary}>{inputLabel}
        <select className={styles.inputFieldPrimary}
          type={dataType}
          name={inputID}
          placeholder = {placeholder}
          value={inputState}
          onChange={(event) => setInput(event.target.value)}
          autoFocus={autoFocusState}
          required={requiredState}
        >
          {optionElements}
        </select>
      </label>
    </div>
  );
}
