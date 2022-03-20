
import ShallowRenderer from 'react-test-renderer/shallow';
import NotFound from '../NotFound';
import React from 'react';
import {BrowserRouter} from 'react-router-dom';

it('renders NotFound UI to with the correct hierarchy', () => {
  const renderer = new ShallowRenderer();
  renderer.render(
      <BrowserRouter>
        <NotFound/>
      </BrowserRouter>,
  );
  const result = renderer.getRenderOutput();

  expect(result).toMatchSnapshot();
});

