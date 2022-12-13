import '@testing-library/jest-dom';

import { fireEvent, getByTestId, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import { store } from '../../store';
import { NAVIGATION_LIST } from '../Navigation/data';
import { BurgerMenu } from './BurgerMenu';

describe('Menu', () => {
  test('it renders', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <BurgerMenu />
        </BrowserRouter>
      </Provider>
    );

    const renderedMenu = screen.getByTestId('menu');

    expect(renderedMenu).toBeInTheDocument();
  });

  test('it renders all menu links', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <BurgerMenu />
        </BrowserRouter>
      </Provider>
    );
    const menuLinks = screen.getAllByTestId('navigation-list__row');
    const amount = menuLinks.length;
    expect(amount).toBe(NAVIGATION_LIST.length);
  });

  test('it opens menu', () => {
    const { container } = render(
      <Provider store={store}>
        <BrowserRouter>
          <BurgerMenu />
        </BrowserRouter>
      </Provider>
    );

    const testState = getByTestId(container, 'menu');

    const button = getByTestId(testState, 'menu__button');

    const menuList = getByTestId(testState, 'menu__list');

    expect(menuList.getAttribute('data-test')).toBe('menu-list-off');

    fireEvent.click(button);

    expect(menuList.getAttribute('data-test')).toBe('menu-list-on');
  });
});
