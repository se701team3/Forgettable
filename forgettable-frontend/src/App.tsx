import React from 'react';
import logo from './logo.svg';
import './App.css';
import EncounterSummary from './components/EncounterCardSummary/EncounterSummary';

function App() {
  return (
    <EncounterSummary
      Name="Alby"
      Date="12/02/2022"
      Description="Brief Description"
      Summary="Hello how are you all today? Im good thanks"
    />
  );
}

export default App;
