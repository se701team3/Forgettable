import ShallowRenderer from 'react-test-renderer/shallow';
import NavBar from '../NavBar';
import React from 'react';

// Need to mock the Link, as do not have the context of the Router
jest.mock('react-router-dom', () => ({
  Link: () => {
    const MockName = 'link-component';
    return <MockName />;
  },
}));

it('renders NavBar UI with correct hierarchy', () => {
  const renderer = new ShallowRenderer();
  renderer.render(<NavBar />);
  const result = renderer.getRenderOutput();

  expect(result).toMatchSnapshot();
});


