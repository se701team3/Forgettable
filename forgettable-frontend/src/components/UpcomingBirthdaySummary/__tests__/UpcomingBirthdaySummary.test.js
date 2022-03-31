import React from 'react';
import {render, fireEvent, cleanup} from '@testing-library/react';

import ShallowRenderer from 'react-test-renderer/shallow';

import UpcomingBirthdaySummary from '../UpcomingBirthdaySummary';
import moment from 'moment';

jest.mock('../../../services');

const mockedUsedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));

it('renders UpcomingBirthdaySummary UI with correct hierarchy', () => {
  const renderer = new ShallowRenderer();
  renderer.render(<UpcomingBirthdaySummary
    firstName='Bob'
    onClick={() => { }} />);
  const result = renderer.getRenderOutput();
  expect(result).toMatchSnapshot();
});

afterEach(cleanup);

it('successfully fires event when card is clicked', () => {
  const handleClick = jest.fn();

  const {getByTestId} = render(
      <UpcomingBirthdaySummary
        firstName='Bob'
        birthday={moment(1648698811606).toDate()}
        onClick={handleClick}
      />);

  const node = getByTestId('container-card');

  fireEvent.click(node);
  expect(handleClick).toHaveBeenCalledTimes(1);
});
