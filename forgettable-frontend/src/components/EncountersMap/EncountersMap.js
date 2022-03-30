import React, {useEffect} from 'react';
import {GoogleMap, Marker} from '@react-google-maps/api';

const containerStyle = {
  width: '90%',
  height: '500px',
};

// This is centered for auckland by default
const center = {
  lat: -36.848461,
  lng: 174.763336,
};
const zoomLevel = 11;

const EncountersMap = ({markers}) => {
  useEffect(() => {}, [markers]);

  const locations = markers.map((location) => {
    return (
      <Marker
        visible={true}
        icon={{
          path: google.maps.SymbolPath.CIRCLE,
          fillColor: '#4A4FF2',
          fillOpacity: 10,
          scale: 10,
          strokeWeight: 2,
          strokeColor: '#6265ed',
        }}
        key={location.id}
        position={{lat: location.lat, lng: location.lng}}
      />
    );
  });

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={zoomLevel}
    >
      <>{locations}</>
    </GoogleMap>
  );
};

export default React.memo(EncountersMap);
