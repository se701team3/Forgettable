import React from 'react';
import {screen, render, fireEvent, waitFor} from '@testing-library/react';
import {act} from 'react-dom/test-utils';
import * as api from '../../../services';
import ShallowRenderer from 'react-test-renderer/shallow';

import PersonPage from '../PersonPage';

jest.mock('../../../services');

it('renders PersonPage UI with correct hierarchy', () => {
  const renderer = new ShallowRenderer();
  renderer.render(<PersonPage/>);
  const result = renderer.getRenderOutput();

  expect(result).toMatchSnapshot();
});


it('should display the correct user returned from the person api call', async () => {
  api.getPerson.mockImplementation(() =>
    Promise.resolve({
      first_name: 'Hiruna',
      last_name: 'Smith',
    }),
  );

  act(() => {
    render(<PersonPage />);
  });

  await waitFor(
      () => expect(screen.getByText('Hiruna Smith'))
          .toBeInTheDocument());
});

it('should display the correct title detailing the number of encounters returned from person api call', async () => {
  api.getPerson.mockImplementation(() =>
    Promise.resolve({
      first_name: 'Hiruna',
      last_name: 'Smith',
      encounters: [{
        title: 'encounter 1',
        description: 'description 1',
        persons: [
          {
            first_name: 'person 1',
            last_name: 'person 1',
          },
        ],
        location: 'place 1',
        onClick: jest.fn(),
        onDelete: jest.fn(),
        isInitialEncounter: false,
      }, {
        title: 'encounter 2',
        description: 'description 2',
        persons: [
          {
            first_name: 'person 2',
            last_name: 'person 2',
          },
        ],
        location: 'place 2',
        onClick: jest.fn(),
        onDelete: jest.fn(),
        isInitialEncounter: false,
      },
      ],
    }),
  );

  act(() => {
    render(<PersonPage />);
  });

  await waitFor(
      () => expect(screen.getByText('2 times'))
          .toBeInTheDocument());
});
