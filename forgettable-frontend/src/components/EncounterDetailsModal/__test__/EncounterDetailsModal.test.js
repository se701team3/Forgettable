import TestRenderer from 'react-test-renderer';
import ShallowRenderer from 'react-test-renderer/shallow';
import React from 'react';
import {render, screen} from '@testing-library/react';
import EncounterDetailsModal from '../EncounterDetailsModal';

let modalOpen = true;
const handleModalClose = () => {
  modalOpen = false;
};

const persons = [
  {
    first_name: 'Kent',
    img: 'https://images.unsplash.com/photo-1646936218155-caedb4ed9bf7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80',
    last_name: 'Dodds',
  },
];

const encounter = {
  date: new Date(),
  description: 'Sem tristique nulla cursus praesent tincidunt integer Diam dictum vestibulum mi nulla vestibulum, id nibh. Nunc consequat amet commodo turpis tellus. Scelerisque a pellentesque vel accumsan sed mauris, ac turpis pharetra. Sem tristique nulla cursus praesent tincidunt integer',
  id: '3',
  location: 'Auckland',
  persons: persons,
  title: 'Fermentum pellentesque',
};

it('renders EncounterDetailsModal UI to test correct hierarchy', () => {
  const renderer = new ShallowRenderer();
  renderer.render(
      <EncounterDetailsModal
        open={modalOpen}
        onClose={handleModalClose}
        encounter={encounter}
        onDelete={jest.fn()}
      />);

  const result = renderer.getRenderOutput();

  expect(result).toMatchSnapshot();
});
