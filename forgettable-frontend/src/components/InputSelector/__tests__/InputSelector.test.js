import React from 'react';
import InputSelector from '../InputSelector';
import {render, cleanup} from '@testing-library/react';
import testRenderer from 'react-test-renderer';

afterEach(cleanup);

it('renders primary input field correctly', () => {
  const primaryInput = testRenderer.create(
      <InputSelector inputLabel={'SELECTOR'}
        placeholder={'SELECTOR TEXT'}
        dataType={'text'}
        inputID={'InputSelector'}
        options={['option1', 'option2', 'option3']} />).toJSON();
  expect(primaryInput).toMatchSnapshot();
});


