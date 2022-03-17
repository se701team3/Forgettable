import TestRenderer from 'react-test-renderer';
import renderer from 'react-test-renderer';
import ShallowRenderer from 'react-test-renderer/shallow';
import React from 'react';
import {render, fireEvent, cleanup, screen} from '@testing-library/react';
import {
  within,
  getByText,
  getByTestId,
} from '@testing-library/dom';
import EditPerson from '../EditPerson';
import {createMemoryHistory} from 'history';
import {MemoryRouter, Router} from 'react-router-dom';
import nock from 'nock';

afterEach(cleanup);

it('renders Create person page correctly', () => {
  const history = createMemoryHistory();
  history.push('/people/create');
  const rendered = renderer.create(<MemoryRouter initialEntries={[{pathname: '/people/create'}]}>
    <EditPerson/>
  </MemoryRouter>).toJSON();
  expect(rendered).toMatchSnapshot();
});

it('Create Person heading displays when navigating to /people/create', () => {
  const history = createMemoryHistory();
  history.push('/people/create');
  render(
      <MemoryRouter initialEntries={[{pathname: '/people/create'}]}>
        <EditPerson/>
      </MemoryRouter>);

  expect(screen.getByText('Create Person')).toBeInTheDocument();
});

it('Edit person heading displays when navigating to /people/:id', () => {
  render(
      <MemoryRouter initialEntries={[{pathname: '/people/edit/1'}]}>
        <EditPerson/>
      </MemoryRouter>);

  expect(screen.getByText('Edit Person')).toBeInTheDocument();
});

// it('Displays correct data from database', async () => {
//   nock('http://localhost:3001')
//       .get('/persons/1')
//       .reply(200, {
//         personData: {
//           first_name: 'Name Last',
//           last_name: 'Namef Last',
//           birthday: '2012-03-04',
//           gender: 'male',
//           location: 'here',
//           first_met: '2001-01-01',
//           how_we_met: 'idk',
//           interests: 'afefefee',
//           organisation: 'job co.',
//           social_media: [],
//           image: 'iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAIAAAD/gAIDAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAI2SURBVHhe7dpBcgFBFIdxspqlJTtu4hhuwC0cgx23MMexdAPLyavqri6FZOYfyWuv8v0WySBJma9aT6cZd103wjAf+TsGIJaAWAJiCYglIJaAWAJiCYglIJaAWAJiCYglIJaAWAJiCYglIJaAWAJiCYglIJaAWAJiCf5LrLZtF4vF+IHdeTwe8w/16iI7nU7L5fJwOOTbN+yh+XyeT/JbTdPk3+kTO9Z0OrWztQGSTvtnNptN/nN9gsUaPl6eGt7lqQCxXgn0Yp077xtLavS7Ub7yprGs1GQyySUelDT5ttdl6k1jPY6pp2MnP+YV603XWev1Oh2URrvdLt1TUexP/pVFg89Z8O+OgFgCYgmIJQgcq23bfOQl8NVwNptdLpd0zNWwRylla7F08NcCjyznRZZhghdEjeU/u5uoL0P/2d1EHVn+s7uJOrL8Z3fDBC8IGWu/3+cjZzaMw0nvgJnVapXvchFyzioT1vV6bZomHTuIHcv5ycebszyXo/efkAg3sjyXo1bqfD7nGxFHludytLzJlMQbWfZqSAf+z5xFqSBYrCqbDUWwl2GVzYYi2MiqstlQBBtZFWd3wwQvIJaAWAJiCSLFqrbnV9hlJYpae35FpKVDWTc47/kVIWPVes5M8AJiCYgliBSryqR+K1Ks7XZrX6vsNyTxtpUrYs4SEEtALAGxBMQSEEtALAGxBMQSEEtALAGxBMQSEEtALAGxBMQSEEtALAGxBMQSEEtALAGxBhuNPgHlJKV46HCjogAAAABJRU5ErkJggg==',
//           encounters: [],
//           time_updated: '0002-02-02',
//         },
//       });

//   const {container} = render(
//       <MemoryRouter initialEntries={[{pathname: '/people/edit/1'}]}>
//         <EditPerson/>
//       </MemoryRouter>);

//   expect(screen.getByDisplayValue('Name Last')).toBeInTheDocument();
// });

it('checks right number of social media icons', () => {
  const socialMediaMap = new Map([
    ['twitter', 'https://twitter.com/Twitter'],
    ['github', 'github.com'],
  ]);

  nock('http://localhost:3001')
      .get('/persons/1')
      .reply(200, {
        personData: {
          first_name: 'Name Last',
          last_name: 'Namef Last',
          birthday: '2012-03-04',
          gender: 'male',
          location: 'here',
          first_met: '2001-01-01',
          how_we_met: 'idk',
          interests: 'afefefee',
          organisation: 'job co.',
          social_media: socialMediaMap,
          image: 'iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAIAAAD/gAIDAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAI2SURBVHhe7dpBcgFBFIdxspqlJTtu4hhuwC0cgx23MMexdAPLyavqri6FZOYfyWuv8v0WySBJma9aT6cZd103wjAf+TsGIJaAWAJiCYglIJaAWAJiCYglIJaAWAJiCYglIJaAWAJiCYglIJaAWAJiCYglIJaAWAJiCf5LrLZtF4vF+IHdeTwe8w/16iI7nU7L5fJwOOTbN+yh+XyeT/JbTdPk3+kTO9Z0OrWztQGSTvtnNptN/nN9gsUaPl6eGt7lqQCxXgn0Yp077xtLavS7Ub7yprGs1GQyySUelDT5ttdl6k1jPY6pp2MnP+YV603XWev1Oh2URrvdLt1TUexP/pVFg89Z8O+OgFgCYgmIJQgcq23bfOQl8NVwNptdLpd0zNWwRylla7F08NcCjyznRZZhghdEjeU/u5uoL0P/2d1EHVn+s7uJOrL8Z3fDBC8IGWu/3+cjZzaMw0nvgJnVapXvchFyzioT1vV6bZomHTuIHcv5ycebszyXo/efkAg3sjyXo1bqfD7nGxFHludytLzJlMQbWfZqSAf+z5xFqSBYrCqbDUWwl2GVzYYi2MiqstlQBBtZFWd3wwQvIJaAWAJiCSLFqrbnV9hlJYpae35FpKVDWTc47/kVIWPVes5M8AJiCYgliBSryqR+K1Ks7XZrX6vsNyTxtpUrYs4SEEtALAGxBMQSEEtALAGxBMQSEEtALAGxBMQSEEtALAGxBMQSEEtALAGxBMQSEEtALAGxBhuNPgHlJKV46HCjogAAAABJRU5ErkJggg==',
          encounters: [],
          time_updated: '0002-02-02',
        },
      });

  const {getByTestId} = render(
      <MemoryRouter initialEntries={[{pathname: '/people/edit/1'}]}>
        <EditPerson/>
      </MemoryRouter>);

  const socialMediaContainer = getByTestId('social-media-div');

  expect(socialMediaContainer.childElementCount).toBe(socialMediaMap.size + 1);
});
