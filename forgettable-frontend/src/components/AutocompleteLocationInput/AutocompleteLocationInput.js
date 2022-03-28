import React, {useState, useEffect} from 'react';
import classes from './AutocompleteLocationInput.module.css';
import Autocomplete, {usePlacesWidget} from 'react-google-autocomplete';

export default function AutocompleteLocationInput(props) {
  const [placename, setPlacename] = useState('');
  
  const {ref: ref} = usePlacesWidget({
    apiKey: process.env.REACT_APP_MAPS_API_KEY,
    options: {
      types: ['establishment'],
      fields: ['name'],
    },
    onPlaceSelected: (place) => {setPlacename(place.name);},
  });

  useEffect(() => {
    props.handleChange(placename);
  }, [placename]);

  return (
    <input className={classes.InputBox}
      size='small'
      ref={ref}
      placeholder='Location'
    />
  );
}
