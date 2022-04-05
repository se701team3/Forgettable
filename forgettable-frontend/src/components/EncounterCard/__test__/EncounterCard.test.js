import TestRenderer from 'react-test-renderer';
import ShallowRenderer from 'react-test-renderer/shallow';
import React from 'react';
import EncounterCard from '../EncounterCard';
import {render, screen} from '@testing-library/react';

const persons = [
  {name: 'Kent Dodds'},
  {name: 'Jed Watson'},
  {name: 'Marley George'},
  {name: 'Jack Winston'},
  {name: 'John Doe'},
];
const title = 'Example Title';
const description = 'Example Description';
const location = 'Example Location';
const isInitialEncounter = false;

it('renders EncounterCard UI to test correct hierarchy', () => {
  const renderer = new ShallowRenderer();
  renderer.render(<EncounterCard
    title={title}
    description={description}
    location={location}
    persons={persons}
    onClick={jest.fn()}
    onDelete={jest.fn()}
    isInitialEncounter={isInitialEncounter}
  />);
  const result = renderer.getRenderOutput();

  expect(result).toMatchSnapshot();
});

it('Title displays correctly', () => {
  render(<EncounterCard
    title={title}
    description={description}
    location={location}
    persons={persons}
    onClick={jest.fn()}
    onDelete={jest.fn()}
    isInitialEncounter={isInitialEncounter}
  />);
  const titleElement = screen.getByText(/example title/i);

  expect(titleElement).toBeInTheDocument();
});

it('Description displays correctly', () => {
  render(<EncounterCard
    title={title}
    description={description}
    location={location}
    persons={persons}
    onClick={jest.fn()}
    onDelete={jest.fn()}
    isInitialEncounter={isInitialEncounter}
  />);
  const descriptionElement = screen.getByText(/example description/i);

  expect(descriptionElement).toBeInTheDocument();
});

it('Location displays correctly', () => {
  render(<EncounterCard
    title={title}
    description={description}
    location={location}
    persons={persons}
    onClick={jest.fn()}
    onDelete={jest.fn()}
    isInitialEncounter={isInitialEncounter}
  />);
  const locationElement = screen.getByText(/example description/i);

  expect(locationElement).toBeInTheDocument();
});

it('Renders the correct number of avatars when persons number is greater than max (4)', () => {
  const maxAvatarNum = 4;
  render(<EncounterCard
    title={title}
    description={description}
    location={location}
    persons={persons}
    onClick={jest.fn()}
    onDelete={jest.fn()}
    isInitialEncounter={isInitialEncounter}
  />);
  const avatarGroupElement = screen.getByTestId('persons-avatar-group');

  expect(avatarGroupElement.childElementCount).toBe(maxAvatarNum);
});

it('Renders the correct number of avatars when persons number is lower than max (4) and not one', () => {
  const persons = [
    {name: 'Kent Dodds'},
    {name: 'Jed Watson'},
    {name: 'Marley George'},
  ];
  render(<EncounterCard
    title={title}
    description={description}
    location={location}
    persons={persons}
    onClick={jest.fn()}
    onDelete={jest.fn()}
    isInitialEncounter={isInitialEncounter}
  />);
  const avatarGroupElement = screen.getByTestId('persons-avatar-group');

  expect(avatarGroupElement.childElementCount).toBe(persons.length);
});

it('Renders the correct number of avatars when persons number is one', () => {
  const persons = [
    {name: 'Kent Dobbs'},
  ];
  render(<EncounterCard
    title={title}
    description={description}
    location={location}
    persons={persons}
    onClick={jest.fn()}
    onDelete={jest.fn()}
    isInitialEncounter={isInitialEncounter}
  />);
  const avatarGroupElement = screen.getByTestId('persons-avatar-group');

  expect(avatarGroupElement.childElementCount).toBe(persons.length);
});

it('Date is displayed in the correct format', () => {
  const date = new Date(1646965503063);

  render(<EncounterCard
    title={title}
    description={description}
    location={location}
    persons={persons}
    onClick={jest.fn()}
    onDelete={jest.fn()}
    date={date}
    isInitialEncounter={isInitialEncounter}
  />);

  const dateElement = screen.getByText('11/03/2022');

  expect(dateElement).toBeInTheDocument();
});

it('Displays date placeholder correctly when there is no date specified', () => {
  render(<EncounterCard
    title={title}
    description={description}
    location={location}
    persons={persons}
    onClick={jest.fn()}
    onDelete={jest.fn()}
    isInitialEncounter={isInitialEncounter}
  />);
  const dateElement = screen.getByText(/unknown/i);

  expect(dateElement).toBeInTheDocument();
});

it('Displays the first encounter label when it is the first encounter', () => {
  const isInitialEncounter = true;

  render(<EncounterCard
    title={title}
    description={description}
    location={location}
    persons={persons}
    onClick={jest.fn()}
    onDelete={jest.fn()}
    isInitialEncounter={isInitialEncounter}
  />);

  const firstEncounterLabelElement = screen.getByText(/first encounter!/i);

  expect(firstEncounterLabelElement).toBeInTheDocument();
});
