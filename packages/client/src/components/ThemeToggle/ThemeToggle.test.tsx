import '@testing-library/jest-dom';

import { fireEvent, screen } from '@testing-library/react';

import { renderWithRouter } from '../../utils/testingUtils';
import { ThemeToggle } from './ThemeToggle';

describe('ThemeToggle', () => {
  test('it renders', () => {
    renderWithRouter({ component: <ThemeToggle /> });

    const renderedThemeToggle = screen.getByTestId('theme-toggle');

    expect(renderedThemeToggle).toBeInTheDocument();
  });

  test('it toggle theme', () => {
    renderWithRouter({ component: <ThemeToggle /> });

    // Проверяем, корректность начального состояния
    expect(screen.getByTestId('LIGHT').classList).not.toContain('theme-toggle__icon_selected');
    expect(localStorage.getItem('theme')).toBeFalsy();

    // По клику на LIGHT-тумблер он должен стать выбранным, а в localStorage должно быть записано LIGHT
    fireEvent.click(screen.getByTestId('LIGHT'));
    expect(screen.getByTestId('LIGHT').classList).toContain('theme-toggle__icon_selected');
    expect(localStorage.getItem('theme')).toBe('LIGHT');

    // Проверяем корректность состояния не кликнутого элемента.
    expect(screen.getByTestId('DARK').classList).not.toContain('theme-toggle__icon_selected');

    // По клику на DARK-тумблер он должен стать выбранным, а в localStorage должно быть записано DARK
    fireEvent.click(screen.getByTestId('DARK'));
    expect(screen.getByTestId('LIGHT').classList).not.toContain('theme-toggle__icon_selected');
    expect(screen.getByTestId('DARK').classList).toContain('theme-toggle__icon_selected');
    expect(localStorage.getItem('theme')).toBe('DARK');
  });
});
