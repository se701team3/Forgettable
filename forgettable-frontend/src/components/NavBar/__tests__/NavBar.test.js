import ShallowRenderer from 'react-test-renderer/shallow';
import NavBar from '../NavBar';
import React from 'react';
import {BrowserRouter} from 'react-router-dom';


it('renders NavBar UI with correct hierarchy', () => {
  const renderer = new ShallowRenderer();
  renderer.render(<BrowserRouter><NavBar /></BrowserRouter>);
  const result = renderer.getRenderOutput();

  expect(result).toMatchSnapshot();
});


