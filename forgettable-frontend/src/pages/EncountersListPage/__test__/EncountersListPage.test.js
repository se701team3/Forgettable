import React from 'react';
import {screen, render, fireEvent, waitFor} from '@testing-library/react';
import {act} from 'react-dom/test-utils';
import * as api from '../../../services';
import ShallowRenderer from 'react-test-renderer/shallow';
import EncountersListPage from '../EncountersListPage';

jest.mock('../../../services');

it('renders EncountersList UI with correct hierarchy', () => {
  const renderer = new ShallowRenderer();
  renderer.render(<EncountersListPage/>);
  const result = renderer.getRenderOutput();

  expect(result).toMatchSnapshot();
});
