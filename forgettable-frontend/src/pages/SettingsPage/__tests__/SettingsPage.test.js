import {Settings} from '@mui/icons-material';
import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';


it('renders Settings page UI with correct hierarchy', () => {
  const renderer = new ShallowRenderer();
  renderer.render(<Settings />);
  const result = renderer.getRenderOutput();

  expect(result).toMatchSnapshot();
});
