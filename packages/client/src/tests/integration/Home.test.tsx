import '@testing-library/jest-dom';

import { screen } from '@testing-library/react';
import { Provider } from 'react-redux';

import { Root } from '../../layouts/Root';
import { Home } from '../../pages/Home';
import { store } from '../../store';
import { renderWithRouter } from '../../utils/testing-utils';

jest.mock('react-router-dom', () => {
  return {
    ...jest.requireActual('react-router-dom'),
    useNavigation: jest.fn(() => ({ state: '' })),
  };
});

describe('Home page', () => {
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
});
