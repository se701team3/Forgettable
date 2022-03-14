import TestRenderer from 'react-test-renderer';
import ShallowRenderer from 'react-test-renderer/shallow';
import React from 'react';
import {render, fireEvent, cleanup} from '@testing-library/react';
import {
  within,
  getByText,
  getByTestId,
} from '@testing-library/dom';
import EncounterDrawer from '../EncounterDrawer';

const PERSONS = [
  {

    id: '1',
    name: 'John Doe',
    img: 'https://www.w3schools.com/w3css/img_lights.jpg',
  },
  {

    id: '2',
    name: 'Mercury Lin',
    img: 'https://user-images.githubusercontent.com/62003343/158133392-b606b9d2-b05a-49dc-a4e8-9d6aed696d6b.gif',
  },
  {

    id: '3',
    name: 'Raina Song',
    img: 'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg',
  },
];

it('renders EncounterDrawer UI with correct hierarchy', () => {
  const renderer = new ShallowRenderer();
  renderer.render(<EncounterDrawer
    open={true}
    dateMet={new Date('2020-01-01')}
    location="London"
    encounterDetail="We met on a train, it was a long journey"
    persons={PERSONS}
  />);
  const result = renderer.getRenderOutput();

  expect(result).toMatchSnapshot();
});

afterEach(cleanup);

it('Title prop passed in is displayed correctly', () => {
  const title='Fun times';

  const {getByTestId} = render(
      <EncounterDrawer
        open={true}
        persons={PERSONS}
        encounterTitle={title}

      />);

  const {getByText} = within(getByTestId('title-element'));

  expect(getByText(title)).toBeInTheDocument();
});

it('displays the correct date met an existing date', () => {
  const dateMet = new Date('2000-01-01');

  const {getByTestId} = render(
      <EncounterDrawer
        open={true}
        persons={PERSONS}
        dateMet={dateMet}
      />);

  const {getByText} = within(getByTestId('date-met-element'));

  expect(
      getByText('01/01/2000'),
  ).toBeInTheDocument();
});

it('displays the correct location', () => {
  const location = 'London';

  const {getByTestId} = render(
      <EncounterDrawer
        open={true}
        persons={PERSONS}
        location={location}
      />);

  const {getByText} = within(getByTestId('location-element'));

  expect(
      getByText(location),
  ).toBeInTheDocument();
});


it('displays the details when the props is passed', () => {
  const details = 'We met on a train, it was a long journey';

  const {getByTestId} = render(
      <EncounterDrawer
        open={true}
        persons={PERSONS}
        encounterDetail={details}
      />);

  const {getByText} = within(getByTestId('location-element'));

  expect(
      getByText(details),
  ).toBeInTheDocument();
});

