import '@testing-library/jest-dom';

import { screen } from '@testing-library/react';

import { renderWithRouter, waitUntilLoaderToBeRemoved } from '../utils/testing-utils';
import { LocationDisplay } from './TestApp';

describe('Router', () => {
  test('it correct renders and navigates', async () => {
    const { user } = renderWithRouter();
    await waitUntilLoaderToBeRemoved();

    expect(screen.getByText('Вы на домашней странице')).toBeInTheDocument();
    await user.click(screen.getByText('О нас'));
    expect(screen.getByText('Вы на странице "О нас"')).toBeInTheDocument();
  });

  test('it catches wrong route', async () => {
    renderWithRouter({ route: '/bad/route' });

    expect(screen.queryByTestId('web-error__header')).toBeTruthy();
    expect(screen.queryByTestId('web-error__button')).toBeTruthy();
  });

  test('it renders a component that uses useLocation', async () => {
    const route = '/custom-route';
    renderWithRouter({ ui: <LocationDisplay />, route });

    expect(screen.getByTestId('location-display')).toHaveTextContent(route);
  });
});
