import React, {useState} from 'react';
import classes from './AutocompleteLocationInput.module.css';
import Autocomplete from 'react-google-autocomplete';

export default function AutocompleteLocationInput({setLocation, setLatLong}) {
  return (
    <Autocomplete
      apiKey={process.env.REACT_APP_MAPS_API_KEY}
      options={{
        componentRestrictions: {country: 'nz'},
        types: ['establishment'],
        fields: ['name', 'geometry.location'],
      }}
      onChange={(event) => {
        setLocation(event.target.value);
      }}
      className={classes.InputBox}
      onPlaceSelected={(place) => {
        setLocation(place.name);
        setLatLong([
          place.geometry.location.lat(),
          place.geometry.location.lng(),
        ]);
      }}
    />
  );
}
