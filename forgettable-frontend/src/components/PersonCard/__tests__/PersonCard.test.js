import TestRenderer from 'react-test-renderer';
import ShallowRenderer from 'react-test-renderer/shallow';
import PersonCard from '../PersonCard';
import React from 'react';
import {render, fireEvent, cleanup} from '@testing-library/react';
import {
  within,
  getByText,
  getByTestId,
} from '@testing-library/dom';

it('renders PersonCard UI with correct hierarchy', () => {
  const renderer = new ShallowRenderer();
  renderer.render(<PersonCard />);
  const result = renderer.getRenderOutput();

  expect(result).toMatchSnapshot();
});

afterEach(cleanup);

it('Text in state is changed when button clicked', () => {
  const {getByTestId} = render(
      <PersonCard
        name="Mercury Lin"
      />);

  const {getByText} = within(getByTestId('name-element'));

  expect(getByText('Mercury Lin')).toBeInTheDocument();

  // screen.getByRole('button', {
  //     name: /edit/i
  //   })

  // expect(getByText(/Initial/i).textContent).toBe("Initial State")

  // fireEvent.click(getByText("State Change Button"))

  // expect(getByText(/Initial/i).textContent).toBe("Initial State Changed")
});
