import '@testing-library/jest-dom';

import { render, screen } from '@testing-library/react';
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
});
