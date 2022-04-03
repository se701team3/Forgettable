import TestRenderer from 'react-test-renderer';
import ShallowRenderer from 'react-test-renderer/shallow';
import React from 'react';
import {render, fireEvent, cleanup} from '@testing-library/react';
import {
  within,
  getByText,
  getByTestId,
} from '@testing-library/dom';
import SearchFilterModal from '../SearchFilterModal';

it('renders SearchFilterModal with correct hierarchy', () => {
  const renderer = new ShallowRenderer();

  renderer.render(<SearchFilterModal
    open={true}
    selectedFilter=""
    setSelectedFilter={() => {}}
  />);
  const result = renderer.getRenderOutput();

  expect(result).toMatchSnapshot();
});
