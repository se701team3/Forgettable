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

const PERSON_NAME = 'Mercury Lin';

it('renders EncounterDrawer UI with correct hierarchy', () => {
  const renderer = new ShallowRenderer();
  renderer.render(<EncounterDrawer
    open={true}
    name="Mercury Lin"
    img="https://user-images.githubusercontent.com/62003343/157863205-d299d1aa-deeb-4009-bcc8-2238227f5703.gif"
    dateMet={new Date('2020-01-01')}
    location="London"
    encounterDetail="We met on a train, it was a long journey"
  />);
  const result = renderer.getRenderOutput();

  expect(result).toMatchSnapshot();
});

afterEach(cleanup);

it('Name prop passed in is displayed correctly', () => {
  const {getByTestId} = render(
      <EncounterDrawer
        open={true}
        name={PERSON_NAME}
      />);

  const {getByText} = within(getByTestId('name-element'));

  expect(getByText(PERSON_NAME.split(' ')[0])).toBeInTheDocument();
});

it('displays the correct date met an existing date', () => {
  const dateMet = new Date('2000-01-01');

  const {getByTestId} = render(
      <EncounterDrawer
        open={true}
        name={PERSON_NAME}
        dateMet={dateMet}
      />);

  const {getByText} = within(getByTestId('date-met-element'));

  expect(
      getByText('01 Jan 2000'),
  ).toBeInTheDocument();
});

it('displays the correct location', () => {
  const location = 'London';

  const {getByTestId} = render(
      <EncounterDrawer
        open={true}
        name={PERSON_NAME}
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
        name={PERSON_NAME}
        encounterDetail={details}
      />);

  const {getByText} = within(getByTestId('location-element'));

  expect(
      getByText(details),
  ).toBeInTheDocument();
});

