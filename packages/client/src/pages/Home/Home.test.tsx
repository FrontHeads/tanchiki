import '@testing-library/jest-dom';

import { screen } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { Provider } from 'react-redux';

import { navigationList } from '../../components/Menu/MenuData';
import { Root } from '../../layouts/Root';
import { store } from '../../store';
import { buildPath } from '../../utils/HTTP';
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

    const nav = screen.getByTestId('nav');

    expect(nav).toBeInTheDocument();
  });

  test('it renders all page components', () => {
    renderWithRouter(
      <Provider store={store}>
        <Root>
          <Home />
        </Root>
      </Provider>
    );

    const nav = screen.getByTestId('nav');
    const logo = screen.getByTestId('logo');
    const footer = screen.getByTestId('footer');
    const image = screen.getByAltText('Игра Танчики на Денди');
    const burger = screen.getByTestId('menu');

    expect(nav).toBeInTheDocument();
    expect(logo).toBeInTheDocument();
    expect(footer).toBeInTheDocument();
    expect(image).toBeInTheDocument();
    expect(burger).toBeInTheDocument();
  });

  test('it renders all links', () => {
    renderWithRouter(<Home />);

    const menuLinks = screen.getAllByTestId('menulink');

    const amount = menuLinks.length;
    expect(amount).toBe(navigationList.length);
  });
});
