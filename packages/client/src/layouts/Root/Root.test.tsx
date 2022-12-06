import '@testing-library/jest-dom';

import { screen } from '@testing-library/react';

import { renderWithRouter, waitUntilLoaderToBeRemoved } from '../../utils/testing-utils';

describe('Root', () => {
  test('it renders logo and footer', async () => {
    const { user } = renderWithRouter();
    await waitUntilLoaderToBeRemoved();

    await user.click(screen.getByText('Not game'));
    expect(screen.queryByTestId('logo')).toBeInTheDocument();
    expect(screen.queryByTestId('footer')).toBeInTheDocument();
  });

  test(`it doesn't render logo and footer on Game path`, async () => {
    renderWithRouter({ route: '/game' });
    await waitUntilLoaderToBeRemoved();

    expect(screen.queryByTestId('logo')).toBeNull();
    expect(screen.queryByTestId('footer')).toBeNull();
  });
});
