import '@testing-library/jest-dom';

import { fireEvent, getByTestId, render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

import { Menu } from './Menu';
import { navigationList } from './MenuData';

describe('Menu', () => {
  test('it renders', () => {
    render(
      <BrowserRouter>
        <Menu />
      </BrowserRouter>
    );

    const renderedMenu = screen.getByTestId('menu');

    expect(renderedMenu).toBeInTheDocument();
  });

  test('it renders all menu links', () => {
    render(
      <BrowserRouter>
        <Menu />
      </BrowserRouter>
    );
    const menuLinks = screen.getAllByTestId('menulink');
    const amount = menuLinks.length;
    expect(amount).toBe(navigationList.length);
  });

  test('it opens menu', () => {
    const { container } = render(
      <BrowserRouter>
        <Menu />
      </BrowserRouter>
    );

    const testState = getByTestId(container, 'menu');

    const button = getByTestId(testState, 'menu__icon');

    const menuList = getByTestId(testState, 'menu__list');

    expect(menuList.getAttribute('data-test')).toBe('menu-list-off');

    fireEvent.click(button);

    expect(menuList.getAttribute('data-test')).toBe('menu-list-on');
  });
});
