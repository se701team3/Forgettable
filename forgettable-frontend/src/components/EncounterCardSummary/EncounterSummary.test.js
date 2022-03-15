/* eslint-disable indent */
import React from 'react';
import ReactDOM from 'react-dom';
import EncounterSummary from './EncounterSummary';

it('renders without crashing', () => {
    // eslint-disable-next-line indent
    const div = document.createElement('div');
    // eslint-disable-next-line react/react-in-jsx-scope
    ReactDOM.render(<EncounterSummary></EncounterSummary>, div);
});
