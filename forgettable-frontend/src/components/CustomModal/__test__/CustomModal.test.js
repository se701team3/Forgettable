import TestRenderer from 'react-test-renderer';
import ShallowRenderer from 'react-test-renderer/shallow';
import React from 'react';
import CustomModal from '../CustomModal';
import {render, screen} from '@testing-library/react';

let modalOpen = true;
const handleModalClose = () => {
  modalOpen = false;
};

it('renders CustomModal UI to test correct hierarchy', () => {
  const renderer = new ShallowRenderer();
  renderer.render(
      <CustomModal
        open={modalOpen}
        onClose={handleModalClose}
        hasCancel={true}
        hasConfirm={true}
        onConfirm={handleModalClose}
      >
        <h1>This is an example title</h1>
      </CustomModal>);

  const result = renderer.getRenderOutput();

  expect(result).toMatchSnapshot();
});

it('check if children Components are passed in correctly', () => {
  render(
      <CustomModal
        open={true}
        onClose={handleModalClose}
        hasCancel={true}
        hasConfirm={true}
        onConfirm={handleModalClose}
      >
        <h1>Title</h1>
      </CustomModal>);

  const titleElement = screen.getByText(/title/i);

  expect(titleElement).toBeInTheDocument();
});
