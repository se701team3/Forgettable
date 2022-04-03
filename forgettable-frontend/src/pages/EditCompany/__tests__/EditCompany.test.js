import renderer from 'react-test-renderer';
import React from 'react';
import {render, fireEvent, cleanup, screen} from '@testing-library/react';
import EditPerson from '../EditCompany';
import {createMemoryHistory} from 'history';
import {MemoryRouter, Router} from 'react-router-dom';
import axios from 'axios';
import firebase from 'firebase/compat/app';
import EditCompany from '../EditCompany';

afterEach(cleanup);

jest.mock('axios');

it('renders Create company page correctly', () => {
  const history = createMemoryHistory();
  history.push('/company/create');
  const rendered = renderer.create(<MemoryRouter initialEntries={[{pathname: '/company/create'}]}>
    <EditCompany/>
  </MemoryRouter>).toJSON();
  expect(rendered).toMatchSnapshot();
});

it('Create Company heading displays when navigating to /company/create', () => {
  const history = createMemoryHistory();
  history.push('/company/create');
  render(
      <MemoryRouter initialEntries={[{pathname: '/company/create'}]}>
        <EditCompany/>
      </MemoryRouter>);

  expect(screen.getByText('Create company')).toBeInTheDocument();
});

it('Edit company heading displays when navigating to /company/:id', () => {
  render(
      <MemoryRouter initialEntries={[{pathname: '/company/1/edit'}]}>
        <EditCompany/>
      </MemoryRouter>);

  expect(screen.getByText('Edit Company')).toBeInTheDocument();
});

it('Edit company page displays delete button', () => {
  render(
      <MemoryRouter initialEntries={[{pathname: '/company/1/edit'}]}>
        <EditCompany/>
      </MemoryRouter>);

  expect(screen.getByText('Delete')).toBeInTheDocument();
});

it('Create Company page does not display delete button', () => {
  render(
      <MemoryRouter initialEntries={[{pathname: '/company/create'}]}>
        <EditCompany/>
      </MemoryRouter>);

  expect(screen.queryByText('Delete')).not.toBeInTheDocument();
});

it('Displays correct data from database', async () => {
  const personData = {
    first_name: 'newf',
    last_name: 'Namef Last',
    birthday: '2012-03-04',
    gender: 'male',
    location: 'here',
    first_met: '2001-01-01',
    how_we_met: 'idk',
    interests: 'afefefee',
    organisation: 'job co.',
    social_media: new Map([['twitter', 'fdfd']]),
    image: 'iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAIAAAD/gAIDAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAI2SURBVHhe7dpBcgFBFIdxspqlJTtu4hhuwC0cgx23MMexdAPLyavqri6FZOYfyWuv8v0WySBJma9aT6cZd103wjAf+TsGIJaAWAJiCYglIJaAWAJiCYglIJaAWAJiCYglIJaAWAJiCYglIJaAWAJiCYglIJaAWAJiCf5LrLZtF4vF+IHdeTwe8w/16iI7nU7L5fJwOOTbN+yh+XyeT/JbTdPk3+kTO9Z0OrWztQGSTvtnNptN/nN9gsUaPl6eGt7lqQCxXgn0Yp077xtLavS7Ub7yprGs1GQyySUelDT5ttdl6k1jPY6pp2MnP+YV603XWev1Oh2URrvdLt1TUexP/pVFg89Z8O+OgFgCYgmIJQgcq23bfOQl8NVwNptdLpd0zNWwRylla7F08NcCjyznRZZhghdEjeU/u5uoL0P/2d1EHVn+s7uJOrL8Z3fDBC8IGWu/3+cjZzaMw0nvgJnVapXvchFyzioT1vV6bZomHTuIHcv5ycebszyXo/efkAg3sjyXo1bqfD7nGxFHludytLzJlMQbWfZqSAf+z5xFqSBYrCqbDUWwl2GVzYYi2MiqstlQBBtZFWd3wwQvIJaAWAJiCSLFqrbnV9hlJYpae35FpKVDWTc47/kVIWPVes5M8AJiCYgliBSryqR+K1Ks7XZrX6vsNyTxtpUrYs4SEEtALAGxBMQSEEtALAGxBMQSEEtALAGxBMQSEEtALAGxBMQSEEtALAGxBMQSEEtALAGxBhuNPgHlJKV46HCjogAAAABJRU5ErkJggg==',
    encounters: [],
    time_updated: '0002-02-02',
    _id: '1',
  };

  axios.get.mockResolvedValue({data: personData});
  firebase.auth().onAuthStateChanged(async (u) => {
    if (u) {
      await apiCalls.getCompany('1');
      render(<MemoryRouter initialEntries={[{pathname: '/person/1/edit'}]}>
        <EditCompany/>
      </MemoryRouter>);

      expect(screen.getByText('newf')).toBeInTheDocument();
    }
  });
});
