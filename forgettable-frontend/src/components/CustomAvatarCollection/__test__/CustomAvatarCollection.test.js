import TestRenderer from 'react-test-renderer';
import ShallowRenderer from 'react-test-renderer/shallow';
import React from 'react';
import {render, screen} from '@testing-library/react';
import CustomAvatarCollection from '../CustomAvatarCollection';

const persons = [
  {
    first_name: 'Kent',
    last_name: 'Dodds',
    img: 'https://images.unsplash.com/photo-1646936218155-caedb4ed9bf7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80',
  },
  {
    first_name: 'Jed',
    last_name: 'Watson',
    img: 'https://images.unsplash.com/photo-1600010437709-10176a56ea45?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=765&q=80',
  },
  {
    first_name: 'Marley',
    last_name: 'George',
    img: 'https://images.unsplash.com/photo-1646936218590-91d949706cb5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
  },
  {
    first_name: 'Jack',
    last_name: 'Winston',
  },
  {
    first_name: 'John',
    last_name: 'Doe',
  },
];

it('renders CustomAvatarCollection UI to test correct hierarchy', () => {
  const renderer = new ShallowRenderer();
  renderer.render(
      <CustomAvatarCollection persons={persons}/>,
  );

  const result = renderer.getRenderOutput();

  expect(result).toMatchSnapshot();
});
