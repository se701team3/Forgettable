import React, {useState} from 'react';
import classes from './AutocompleteLocationInput.module.css';
import Autocomplete from 'react-google-autocomplete';

export default function AutocompleteLocationInput({
  setLocation,
  handleLatLongChange,
}) {
  return (
    <Autocomplete
      apiKey={process.env.REACT_APP_MAPS_API_KEY}
      options={{
        componentRestrictions: {country: 'nz'},
        types: ['establishment'],
        fields: ['name', 'geometry.location'],
      }}
      className={classes.InputBox}
      onPlaceSelected={(place) => {
        setLocation(place.name);
        handleLatLongChange([
          place.geometry.location.lng(),
          place.geometry.location.lat(),
        ]);
      }}
    />
  );
}
