import '@testing-library/jest-dom';

import { screen } from '@testing-library/react';

import { renderWithRouter } from '../../utils/testingUtils';

describe('Root', () => {
  test('it renders logo and footer', async () => {
    const { user } = renderWithRouter();

    await user.click(screen.getByText('Not game'));
    expect(screen.queryByTestId('logo')).toBeInTheDocument();
    expect(screen.queryByTestId('footer')).toBeInTheDocument();
  });

  test(`it doesn't render logo and footer on Game path`, async () => {
    renderWithRouter({ route: '/game' });

    expect(screen.queryByTestId('logo')).toBeNull();
    expect(screen.queryByTestId('footer')).toBeNull();
  });
});
