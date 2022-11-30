import '@testing-library/jest-dom';

import { screen } from '@testing-library/react';

import { renderWithRouter } from '../utils/testing-utils';
import { LocationDisplay, TestApp } from './TestApp';

jest.mock('react-router-dom', () => {
  return {
    ...jest.requireActual('react-router-dom'),
    useRouteError: () => ({ url: '' }),
    useNavigation: jest.fn(() => ({ state: '' })),
  };
});

describe('Router', () => {
  test('correct rendering/navigating', async () => {
    const { user } = renderWithRouter(<TestApp />);

    expect(screen.getByText('Вы на домашней странице')).toBeInTheDocument();

    await user.click(screen.getByText('О нас'));
    expect(screen.getByText('Вы на странице "О нас"')).toBeInTheDocument();
  });

  test('catch wrong route', () => {
    renderWithRouter(<TestApp />, { route: '/bad/route' });
    expect(screen.queryByTestId('web-error__header')).toBeTruthy();
    expect(screen.queryByTestId('web-error__button')).toBeTruthy();
  });

  test('rendering a component that uses useLocation', () => {
    const route = '/custom-route';
    renderWithRouter(<LocationDisplay />, { route });
    expect(screen.getByTestId('location-display')).toHaveTextContent(route);
  });
});
