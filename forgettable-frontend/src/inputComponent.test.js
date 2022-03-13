import React from 'react';
import InputComponent from './InputComponent';
import {render, cleanup, getByTestId} from '@testing-library/react';
import testRenderer from 'react-test-renderer';
import {TextField} from '@mui/material';

afterEach(cleanup);

it('renders primary input component correctly', () => {
  const primaryInput = testRenderer.create(<InputComponent inputLabel={'TO DO'} inputType={'primary'} placeholder={'TO DO PLEASE'} />).toJSON();
  expect(primaryInput).toMatchSnapshot();
});

it('renders secondary input component correctly', () => {
  const secondaryInput = testRenderer.create(<InputComponent inputLabel={'TO DO'} inputType={'secondary'} placeholder={'TO DO PLEASE'} />).toJSON();
  expect(secondaryInput).toMatchSnapshot();
});

it('renders multiLine input component correctly', () => {
  const multiLineInput = testRenderer.create(<InputComponent inputLabel={'TO DO'} inputType={'multiLine'} placeholder={'TO DO PLEASE'} />).toJSON();
  expect(multiLineInput).toMatchSnapshot();
});
