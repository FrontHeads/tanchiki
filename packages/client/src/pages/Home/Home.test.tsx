import '@testing-library/jest-dom';

import { screen } from '@testing-library/react';
import MockAdapter from 'axios-mock-adapter';

import { navigationList } from '../../components/Menu/MenuData';
import { axios, buildPath } from '../../utils/HTTP';
import { renderWithRouter } from '../../utils/testing-utils';
import { Home } from './Home';

jest.mock('react-router-dom', () => {
  return {
    ...jest.requireActual('react-router-dom'),
    useNavigation: jest.fn(() => ({ state: '' })),
  };
});

describe('Home page', () => {
  beforeAll(() => {
    const mock = new MockAdapter(axios);
    mock.onGet(buildPath(`http://localhost:${__SERVER_PORT__}`, '/')).reply(200);
  });
  test('it renders', () => {
    renderWithRouter(<Home />);

    const nav = screen.getByTestId('menu-nav-home');

    expect(nav).toBeInTheDocument();
  });
  test('it renders image', () => {
    renderWithRouter(<Home />);

    const nav = screen.getByAltText('Игра Танчики на Денди');

    expect(nav).toBeInTheDocument();
  });
  test('it renders all links', () => {
    renderWithRouter(<Home />);

    const menuLinks = screen.getAllByTestId('navigation-list__row');

    const amount = menuLinks.length;
    expect(amount).toBe(navigationList.length + 1);
  });
});
