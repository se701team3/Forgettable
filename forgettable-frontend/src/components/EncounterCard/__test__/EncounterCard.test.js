import TestRenderer from 'react-test-renderer';
import ShallowRenderer from 'react-test-renderer/shallow';
import React from 'react';
import EncounterCard from '../EncounterCard';

const isInitialEncounter = true;
const persons = [
  {first_name: 'Kent', last_name: 'Dodds'},
  {first_name: 'Jed', last_name: 'Watson'},
  {first_name: 'Kent', last_name: 'Dodds'},
  {first_name: 'Jed', last_name: 'Watson'},
  {first_name: 'Kent', last_name: 'Dodds'},
  {first_name: 'Jed', last_name: 'Watson'},
];
const handleCardOnClick = () => {
  console.log('card click!');
};

const handleDelete = () => {
  console.log('delete');
};

it('renders EncounterCard UI to test correct structure', () => {
  const renderer = new ShallowRenderer();
  renderer.render(<EncounterCard
    isInitialEncounter={isInitialEncounter}
    title={'Fermentum pellentesque Fermentum pellentesque'}
    persons={persons}
    details={'Diam dictum vestibulum mi nulla vestibulum, id nibh. Nunc consequat amet commodo turpis tellus. Scelerisque a pellentesque vel accumsan sed mauris, ac turpis pharetra. Sem tristique nulla cursussssss praesent tincidunt integer'}
    date={'13/01/1872'}
    location={'Atlantis'}
    onClick={handleCardOnClick}
    onDelete={handleDelete} />);
  const result = renderer.getRenderOutput();

  expect(result).toMatchSnapshot();
});
