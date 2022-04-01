import React, {useEffect} from 'react';
import {useState} from 'react';
import styles from './InputSelector.module.css';

/**
 * React input selector component used for entry of data.
 *
 * The styling of the component is based on that of the "primary" InputField component.
 *
 * @author Bill Song
 */

export default function InputField({inputLabel, placeholder, inputID,
  dataType, inputStateValue, autoFocusState, requiredState, options}) {
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
