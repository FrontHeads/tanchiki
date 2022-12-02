import '@testing-library/jest-dom';

import { screen } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import { navigationList } from '../../components/Menu/MenuData';
import { buildPath } from '../../utils/HTTP';
import { renderWithRouter } from '../../utils/testing-utils';
import { Home } from './Home';

describe('Home page', () => {
  beforeAll(() => {
    const mock = new MockAdapter(axios);
    mock.onGet(buildPath(`http://localhost:${__SERVER_PORT__}`, '/')).reply(200);
  });

  test('it renders', () => {
    renderWithRouter(<Home />);

    const nav = screen.getByTestId('nav');

    expect(nav).toBeInTheDocument();
  });
  test('it renders all links', () => {
    renderWithRouter(<Home />);

    const menuLinks = screen.getAllByTestId('menulink');

    const amount = menuLinks.length;
    expect(amount).toBe(navigationList.length);
  });
});
