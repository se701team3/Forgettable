import React from 'react';
import ReactDOM from 'react-dom';
import CreateEncounter from './CreateEncounter';

it('renders without crashing', () => {
  // eslint-disable-next-line indent
    const div = document.createElement('div');
  // eslint-disable-next-line react/react-in-jsx-scope
  ReactDOM.render(<CreateEncounter></CreateEncounter>, div);
});
