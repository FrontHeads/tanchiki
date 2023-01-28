import '@testing-library/jest-dom';

import { screen } from '@testing-library/react';

import { renderWithRouter } from '../../utils/testingUtils';
import { ThemeToggle } from './ThemeToggle';

describe('ThemeToggle', () => {
  test('it renders', () => {
    renderWithRouter({ component: <ThemeToggle /> });

    const renderedThemeToggle = screen.getByTestId('theme-toggle');

    expect(renderedThemeToggle).toBeInTheDocument();
  });
});
