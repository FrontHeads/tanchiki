import '@testing-library/jest-dom';

import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

import { ThemeToggle } from './ThemeToggle';

describe('ThemeToggle', () => {
  test('it renders', () => {
    render(
      <BrowserRouter>
        <ThemeToggle />
      </BrowserRouter>
    );

    const renderedThemeToggle = screen.getByTestId('theme-toggle');

    expect(renderedThemeToggle).toBeInTheDocument();
  });
});
