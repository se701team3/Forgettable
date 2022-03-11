import TestRenderer from 'react-test-renderer';
import ShallowRenderer from 'react-test-renderer/shallow';
import PersonCard from '../PersonCard';
import React from 'react';

it('renders PersonCard UI with correct hierarchy', () => {
  const renderer = new ShallowRenderer();
  renderer.render(<PersonCard />);
  const result = renderer.getRenderOutput();

  expect(result).toMatchSnapshot();
});
