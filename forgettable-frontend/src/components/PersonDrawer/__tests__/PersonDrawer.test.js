import TestRenderer from 'react-test-renderer';
import ShallowRenderer from 'react-test-renderer/shallow';
import React from 'react';
import {render, fireEvent, cleanup} from '@testing-library/react';
import {
  within,
  getByText,
  getByTestId,
} from '@testing-library/dom';
import PersonDrawer from '../PersonDrawer';

const PERSON_NAME = 'Mercury Lin';

it('renders PersonDrawer UI with correct hierarchy', () => {
  const renderer = new ShallowRenderer();
  renderer.render(<PersonDrawer
    open={true}
    name="Mercury Lin"
    img="https://user-images.githubusercontent.com/62003343/157863205-d299d1aa-deeb-4009-bcc8-2238227f5703.gif"
    firstMet={new Date().now}
    location="London"
    gender="female"
    organisation="Team3"
    interests={['food, sleep']}
    socialMedia={[
      {
        name: 'facebook',
        link: 'https://google.com/',
      },
      {
        name: 'instagram',
        link: 'https://google.com/',
      },
    ]
    }
  />);
  const result = renderer.getRenderOutput();

  expect(result).toMatchSnapshot();
});

afterEach(cleanup);

it('Name prop passed in is displayed correctly', () => {
  const {getByTestId} = render(
      <PersonDrawer
        open={true}
        name={PERSON_NAME}
      />);

  const {getByText} = within(getByTestId('name-element'));

  expect(getByText(PERSON_NAME)).toBeInTheDocument();
});

it('displays the correct format for firstMet for an existing date', () => {
  const twoYearsAgo = new Date(Date.now() - (365 * 24 * 60 * 60 * 1000 * 2));

  const {getByTestId} = render(
      <PersonDrawer
        open={true}
        name={PERSON_NAME}
        firstMet={twoYearsAgo}
      />);

  const {getByText} = within(getByTestId('first-met-element'));

  expect(
      getByText('First met 2 years ago'),
  ).toBeInTheDocument();
});

it('displays the firstMet string when there is no date', () => {
  const {getByTestId} = render(
      <PersonDrawer
        open={true}
        name={PERSON_NAME}
      />);

  const {getByText} = within(getByTestId('first-met-element'));

  expect(
      getByText('First met once upon a time'),
  ).toBeInTheDocument();
});

it('displays the correct age number given a timestamp', () => {
  const birthday = new Date('2000-01-01');

  const {getByTestId} = render(
      <PersonDrawer
        open={true}
        name={PERSON_NAME}
        birthday={birthday}
      />);

  const {getByText} = within(getByTestId('birthday-element'));

  expect(
      getByText('01 Jan 2000'),
  ).toBeInTheDocument();
});

it('displays the correct organisation', () => {
  const org = 'Team3';

  const {getByTestId} = render(
      <PersonDrawer
        open={true}
        name={PERSON_NAME}
        organisation={org}
      />);

  const {getByText} = within(getByTestId('organisation-element'));

  expect(
      getByText(org),
  ).toBeInTheDocument();
});

it('displays the correct organisation', () => {
  const location = 'London';

  const {getByTestId} = render(
      <PersonDrawer
        open={true}
        name={PERSON_NAME}
        location={location}
      />);

  const {getByText} = within(getByTestId('location-element'));

  expect(
      getByText(location),
  ).toBeInTheDocument();
});

it('displays the correct date first met in detailed fields', () => {
  const date = new Date('01/01/2000');

  const {getByTestId} = render(
      <PersonDrawer
        open={true}
        name={PERSON_NAME}
        firstMet={date}
      />);

  const {getByText} = within(getByTestId('date-first-met-element'));

  expect(
      getByText('01/01/2000'),
  ).toBeInTheDocument();
});

it('displays the correct list of interests in correct format', () => {
  const interests = ['food', 'sleep'];

  const {getByTestId} = render(
      <PersonDrawer
        open={true}
        name={PERSON_NAME}
        interests={interests}
      />);

  const {getByText} = within(getByTestId('interests-element'));

  expect(
      getByText('food, sleep'),
  ).toBeInTheDocument();
});

it('displays the social media items correctly', () => {
  const socialMedias =
    [
      {
        name: 'facebook',
        link: 'https://github.com/',
      },
      {
        name: 'instagram',
        link: 'https://github.com/',
      },
    ];

  const {getByTestId} = render(
      <PersonDrawer
        open={true}
        name={PERSON_NAME}
        socialMedia={socialMedias}
      />);

  // eslint-disable-next-line guard-for-in
  for (const i in socialMedias) {
    expect(
        getByTestId(
            `social-media-element-${socialMedias[i].name}`,
        ),
    ).toBeTruthy();
  }
});

