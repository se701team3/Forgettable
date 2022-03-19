import TestRenderer from 'react-test-renderer';
import ShallowRenderer from 'react-test-renderer/shallow';
import React from 'react';
import {render, fireEvent, cleanup} from '@testing-library/react';
import {
  within,
  getByText,
  getByTestId,
} from '@testing-library/dom';
import EncounterCardSummary from '../EncounterCardSummary';

const FIRST_NAME = 'Mercury';

it('renders EncounterCardSummary UI with correct hierarchy', () => {
  const renderer = new ShallowRenderer();
  renderer.render(<EncounterCardSummary
    firstName={FIRST_NAME}
    description="I met her at a mall"
    onClick={jest.fn()}
  />);
  const result = renderer.getRenderOutput();

  expect(result).toMatchSnapshot();
});

afterEach(cleanup);

it('Name prop passed in is displayed correctly', () => {
  const {getByTestId} = render(
      <EncounterCardSummary
        firstName={FIRST_NAME}
        description="I met her at a mall"
        onClick={jest.fn()}
      />);

  const {getByText} = within(getByTestId('name-element'));

  expect(getByText(FIRST_NAME)).toBeInTheDocument();
});

it('displays the correct format for firstMet for an existing location', () => {
  const location = 'Auckland';

  const {getByTestId} = render(
      <EncounterCardSummary
        firstName={FIRST_NAME}
        description="I met her at a mall"
        onClick={jest.fn()}
        location={location}
      />);

  const {getByText} = within(getByTestId('location-element'));

  expect(
      getByText('Met at: ' + location),
  ).toBeInTheDocument();
});

it('displays the date met in the correct format', () => {
  const date = new Date('01-01-2000');

  const {getByTestId} = render(
      <EncounterCardSummary
        firstName={FIRST_NAME}
        description="I met her at a mall"
        onClick={jest.fn()}
        dateMet={date}
      />);

  const {getByText} = within(getByTestId('date-met-element'));

  expect(
      getByText('01/01/2000'),
  ).toBeInTheDocument();
});

it('displays the description when passed in as a prop', () => {
  const description = 'I met her at a mall';

  const {getByTestId} = render(
      <EncounterCardSummary
        firstName={FIRST_NAME}
        description="I met her at a mall"
        onClick={jest.fn()}
      />);

  const {getByText} = within(getByTestId('description-element'));

  expect(
      getByText(description),
  ).toBeInTheDocument();
});


it('successfully fires event when card is clicked', () => {
  const handleClick = jest.fn();

  const {getByTestId} = render(
      <EncounterCardSummary
        firstName={FIRST_NAME}
        description="I met her at a mall"
        onClick={handleClick}
      />);

  const node = getByTestId('container-card');

  fireEvent.click(node);
  expect(handleClick).toHaveBeenCalledTimes(1);
});


