import '@testing-library/jest-dom';

import { screen } from '@testing-library/react';

import { navigationList } from '../../components/Menu/MenuData';
import { renderWithRouter } from '../../utils/testing-utils';
import { Home } from './Home';

describe('Home page', () => {
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
