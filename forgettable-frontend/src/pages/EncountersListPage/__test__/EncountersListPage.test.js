import React from 'react';
import {screen, render, fireEvent, waitFor} from '@testing-library/react';
import {act} from 'react-dom/test-utils';
import * as api from '../../../services';
import ShallowRenderer from 'react-test-renderer/shallow';
import EncountersListPage from '../EncountersListPage';
import {BrowserRouter} from 'react-router-dom';

jest.mock('../../../services');

it('renders EncountersList UI with correct hierarchy', () => {
  const renderer = new ShallowRenderer();
  renderer.render(<BrowserRouter><EncountersListPage/></BrowserRouter>);
  const result = renderer.getRenderOutput();

  expect(result).toMatchSnapshot();
});
