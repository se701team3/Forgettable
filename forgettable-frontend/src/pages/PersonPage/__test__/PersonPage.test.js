import React from 'react';
import {screen, render, fireEvent, waitFor} from '@testing-library/react';
import {act} from 'react-dom/test-utils';
import * as api from '../../../services';
import ShallowRenderer from 'react-test-renderer/shallow';

import PersonPage from '../PersonPage';
import {BrowserRouter} from 'react-router-dom';

jest.mock('../../../services');

const mockedUsedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));

it('renders PersonPage UI with correct hierarchy', () => {
  const renderer = new ShallowRenderer();
  renderer.render(<PersonPage/>);
  const result = renderer.getRenderOutput();

  expect(result).toMatchSnapshot();
});


it('should display the correct user returned from the person api call',
    async () => {
      api.getPerson.mockImplementation(() =>
        Promise.resolve({
          first_name: 'Hiruna',
          last_name: 'Smith',
        }),
      );

      act(() => {
        render(
            <BrowserRouter>
              <PersonPage />
            </BrowserRouter>,
        );
      });

      await waitFor(
          () => expect(screen.getByText('Hiruna Smith'))
              .toBeInTheDocument());
    });

it(
    'should display the correct title detailing the number of encounters returned from person api call',
    async () => {
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
        render(
            <BrowserRouter>
              <PersonPage />
            </BrowserRouter>,
        );
      });

      await waitFor(
          () => expect(screen.getByText(/2(.*)times/))
              .toBeInTheDocument());
    });


it('should show the deletion confirmation modal when the delete button on an encounter is clicked',
    async () => {
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
          },
          ],
        }),
      );

      await act(async () => {
        render(
            <BrowserRouter>
              <PersonPage />
            </BrowserRouter>,
        );

        let deleteButton;

        await waitFor(() => {
          deleteButton = screen.getAllByText('Delete')[0].closest('button');
        });

        fireEvent.click(deleteButton);

        await waitFor(
            () => expect(screen.getByText('Warning'),
            )
                .toBeInTheDocument());
      });
    });


it('should show success message when encounter is successfully deleted',
    async () => {
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
          },
          ],
        }),
      );

      api.deleteEncounter.mockImplementation(() =>
        Promise.resolve('OK'));

      await act(async () => {
        render(
            <BrowserRouter>
              <PersonPage />
            </BrowserRouter>,
        );

        let deleteButton;
        let confirmButton;

        await waitFor(() => {
          deleteButton = screen.getAllByText('Delete')[0].closest('button');
        });

        fireEvent.click(deleteButton);

        await waitFor(() => {
          confirmButton = screen.getByText('Confirm').closest('button');
        });

        fireEvent.click(confirmButton);

        await waitFor(
            () => expect(screen.getByText('Encounter deleted!'),
            )
                .toBeInTheDocument());
      });
    });


it('should show success message when encounter could not be deleted',
    async () => {
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
          },
          ],
        }),
      );

      api.deleteEncounter.mockImplementation(() =>
        Promise.resolve(undefined));

      await act(async () => {
        render(
            <BrowserRouter>
              <PersonPage />
            </BrowserRouter>,
        );

        let deleteButton;
        let confirmButton;

        await waitFor(() => {
          deleteButton = screen.getAllByText('Delete')[0].closest('button');
        });

        fireEvent.click(deleteButton);

        await waitFor(() => {
          confirmButton = screen.getByText('Confirm').closest('button');
        });

        fireEvent.click(confirmButton);

        await waitFor(
            () => expect(screen.getByText('Something went wrong... :('),
            )
                .toBeInTheDocument());
      });
    });
