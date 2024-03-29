import '@testing-library/jest-dom';

import { screen } from '@testing-library/react';

import { getFilteredNavigationList } from '../../utils/navigationUtils';
import { renderWithRouter } from '../../utils/testingUtils';
import { Home } from './Home';

describe('Home page', () => {
  test('it renders', () => {
    renderWithRouter({ component: <Home /> });

    const nav = screen.getByTestId('menu-nav-home');
    expect(nav).toBeInTheDocument();
  });

  test('it renders image', () => {
    renderWithRouter({ component: <Home /> });

    const nav = screen.getByAltText('Игра Танчики на Денди');
    expect(nav).toBeInTheDocument();
  });

  test('it renders all links', () => {
    renderWithRouter({ component: <Home /> });

    const menuLinks = screen.getAllByTestId('navigation-list__row');
    const amount = menuLinks.length;
    expect(amount).toBe(getFilteredNavigationList(false, ['home']).length);
  });
});
