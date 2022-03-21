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
  renderer.render(<PersonCard
    name={'Mercury Lin'}
    onDelete={jest.fn()}
    onEdit={jest.fn()}
  />);
  const result = renderer.getRenderOutput();

  expect(result).toMatchSnapshot();
});

afterEach(cleanup);

it('Name prop passed in is displayed correctly', () => {
  const name = 'Mercury Lin';

  const {getByTestId} = render(
      <PersonCard
        name={name}
        onDelete={jest.fn()}
        onEdit={jest.fn()}
      />);

  const {getByText} = within(getByTestId('name-element'));

  expect(getByText(name)).toBeInTheDocument();
});

it('renders the correct number of social media icons', () => {
  const socialMedias = ['instagram', 'facebook'];

  const {getByTestId} = render(
      <PersonCard
        onDelete={jest.fn()}
        onEdit={jest.fn()}
        socialMedias={socialMedias}
        name={'Mercury Lin'}
      />);

  const socialMediaContainer = getByTestId('social-media-icons-element');

  expect(socialMediaContainer.childElementCount).toBe(socialMedias.length);
});

it('displays the correct number of encounters', () => {
  const numEncounters = 14;

  const {getByTestId} = render(
      <PersonCard
        name={'Mercury Lin'}
        onDelete={jest.fn()}
        onEdit={jest.fn()}
        numEncounters={numEncounters}
      />);

  const {getByText} = within(getByTestId('encounters-element'));

  expect(
      getByText('Encounters: ' + numEncounters + ' times'),
  ).toBeInTheDocument();
});

it('displays the correct format for lastMet', () => {
  const lastMet = new Date(1646965503063);

  const {getByTestId} = render(
      <PersonCard
        name={'Mercury Lin'}
        onDelete={jest.fn()}
        onEdit={jest.fn()}
        lastMet={lastMet}
      />);

  const {getByText} = within(getByTestId('last-met-element'));

  expect(
      getByText('11/03/2022'),
  ).toBeInTheDocument();
});

it('displays the correct format for firstMet for an existing date', () => {
  const twoYearsAgo = new Date(Date.now() - (365 * 24 * 60 * 60 * 1000 * 2));

  const {getByTestId} = render(
      <PersonCard
        name={'Mercury Lin'}
        onDelete={jest.fn()}
        onEdit={jest.fn()}
        firstMet={twoYearsAgo}
      />);

  const {getByText} = within(getByTestId('first-met-element'));

  expect(
      getByText('First met 2 years ago'),
  ).toBeInTheDocument();
});

it('displays the firstMet string when there is no date', () => {
  const {getByTestId} = render(
      <PersonCard
        name={'Mercury Lin'}
        onDelete={jest.fn()}
        onEdit={jest.fn()}
      />);

  const {getByText} = within(getByTestId('first-met-element'));

  expect(
      getByText('First met once upon a time'),
  ).toBeInTheDocument();
});
