import '@testing-library/jest-dom';

import { screen } from '@testing-library/react';
import { Provider } from 'react-redux';

import { Root } from '../../layouts/Root';
import { Home } from '../../pages/Home';
import { store } from '../../store';
import { renderWithRouter, waitUntilLoaderToBeRemoved } from '../../utils/testing-utils';

describe('Home page', () => {
  test('it renders all page components', async () => {
    renderWithRouter(
      <Provider store={store}>
        <Root>
          <Home />
        </Root>
      </Provider>
    );
    await waitUntilLoaderToBeRemoved();

    const nav = screen.getByTestId('menu-nav-home');
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
