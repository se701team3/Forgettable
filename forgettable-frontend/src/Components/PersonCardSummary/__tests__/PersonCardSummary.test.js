import TestRenderer from 'react-test-renderer';
import ShallowRenderer from 'react-test-renderer/shallow';
import React from 'react';
import {render, fireEvent, cleanup} from '@testing-library/react';
import {
  within,
  getByText,
  getByTestId,
} from '@testing-library/dom';
import PersonCardSummary from '../PersonCardSummary';

it('renders PersonCardSummary UI with correct hierarchy', () => {
  const renderer = new ShallowRenderer();
  renderer.render(<PersonCardSummary
    name="Mercury Lin"
    onClick={() => {}}
  />);
  const result = renderer.getRenderOutput();

  expect(result).toMatchSnapshot();
});

afterEach(cleanup);

it('Name prop passed in is displayed correctly', () => {
  const name = 'Mercury Lin';
  const firstName = name.split(' ')[0];

  const {getByTestId} = render(
      <PersonCardSummary
        name={name}
        onClick={() => {}}
      />);

  const {getByText} = within(getByTestId('name-element'));

  expect(getByText(firstName)).toBeInTheDocument();
});

it('displays the correct format for firstMet for an existing date', () => {
  const twoYearsAgo = new Date(Date.now() - (365 * 24 * 60 * 60 * 1000 * 2));

  const {getByTestId} = render(
      <PersonCardSummary
        name="Mercury Lin"
        firstMet={twoYearsAgo}
        onClick={() => {}}
      />);

  const {getByText} = within(getByTestId('first-met-element'));

  expect(
      getByText('First met 2 years ago'),
  ).toBeInTheDocument();
});

it('displays the firstMet string when there is no date', () => {
  const {getByTestId} = render(
      <PersonCardSummary
        name="Mercury Lin"
        onClick={() => {}}
      />);

  const {getByText} = within(getByTestId('first-met-element'));

  expect(
      getByText('First met once upon a time'),
  ).toBeInTheDocument();
});

it('successfully fires event when card is clicked', () => {
  const handleClick = jest.fn();

  const {getByTestId} = render(
      <PersonCardSummary
        name=" Lin"
        onClick={handleClick}
      />);

  const node = getByTestId('container-card');

  fireEvent.click(node);
  expect(handleClick).toHaveBeenCalledTimes(1);
});


