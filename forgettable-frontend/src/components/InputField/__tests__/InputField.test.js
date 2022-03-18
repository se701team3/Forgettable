import React from 'react';
import InputField from '../InputField';
import {render, cleanup} from '@testing-library/react';
import testRenderer from 'react-test-renderer';

afterEach(cleanup);

it('renders primary input field correctly', () => {
  const primaryInput = testRenderer.create(
      <InputField inputLabel={'PRIMARY'}
        inputType={'primary'}
        placeholder={'PRIMARY TEXT'}
        dataType={'text'}
        inputID={'PrimaryInputField'} />).toJSON();
  expect(primaryInput).toMatchSnapshot();
});

it('renders secondary input field correctly', () => {
  const secondaryInput = testRenderer.create(
      <InputField inputLabel={'SECONDARY'}
        inputType={'secondary'}
        placeholder={'SECONDARY TEXT'}
        dataType={'text'}
        inputID={'SecondaryInputField'} />).toJSON();
  expect(secondaryInput).toMatchSnapshot();
});

it('renders multiLine input field correctly', () => {
  const multiLineInput = testRenderer.create(
      <InputField inputLabel={'MULTILINE'}
        inputType={'multiLine'}
        placeholder={'MULTILINE TEXT'}
        dataType={'text'}
        inputID={'MultiLineInputField'} />).toJSON();
  expect(multiLineInput).toMatchSnapshot();
});


