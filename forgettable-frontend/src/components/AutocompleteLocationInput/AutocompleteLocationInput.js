import React, {useState, useEffect, useRef} from 'react';
import classes from './AutocompleteLocationInput.module.css';

import Autocomplete, {usePlacesWidget} from 'react-google-autocomplete';

// Code adapted from:
// https://betterprogramming.pub/the-best-practice-with-google-place-autocomplete-api-on-react-939211e8b4ce
// and https://developers.google.com/maps/documentation/javascript/examples/places-autocomplete

export default function AutocompleteLocationInput(props) {
  const placeName = useRef('');
  
  const [country, setCountry] = useState('nz');
  const {ref: ref} = usePlacesWidget({
    apiKey: process.env.REACT_APP_MAPS_API_KEY,
    onPlaceSelected: (place) => {
      console.log('place:')
      console.log(place);
      console.log('checking if same')
      if (!(placeName.current == place.name)) {
        console.log('wasnt the same')
        placeName.current = place.name;
      }
    },

    // inputAutocompleteValue: 'country',
    options: {
      componentRestrictions: {country},
      fields: ['name'],
    },
  });

  useEffect(() => {
    console.log('useEffect');
    console.log(placeName)
    debugger;
    props.handleChange(placeName);
  }, []);


  return (
    <input className={classes.InputBox}
      size='small'
      ref={ref}
      onChange={(event) => {
        console.log('change');
      }}

      placeholder='Enter a Location'
    />
  );
}
