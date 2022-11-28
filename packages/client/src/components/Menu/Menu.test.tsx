import '@testing-library/jest-dom';

import { fireEvent, getByTestId, render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

import { Menu } from './Menu';

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
  test('it opens menu', () => {
    const { container } = render(
      <BrowserRouter>
        <Menu />
      </BrowserRouter>
    );

    const testState = getByTestId(container, 'menu');

    const button = getByTestId(testState, 'menu-button');

    const menuList = getByTestId(testState, 'menu-list');

    expect(menuList.getAttribute('data-test')).toBe('menu-list-off');

    fireEvent.click(button);

    expect(menuList.getAttribute('data-test')).toBe('menu-list-on');
  });
});
