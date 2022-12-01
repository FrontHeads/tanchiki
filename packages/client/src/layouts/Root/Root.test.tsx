import '@testing-library/jest-dom';

import { screen } from '@testing-library/react';

import { TestApp } from '../../tests/TestApp';
import { renderWithRouter } from '../../utils/testing-utils';

jest.mock('react-router-dom', () => {
  return {
    ...jest.requireActual('react-router-dom'),
    useNavigation: jest.fn(() => ({ state: '' })),
  };
});

describe('Root', () => {
  test('it renders logo and footer', async () => {
    const { user } = renderWithRouter(<TestApp />);

    await user.click(screen.getByText('Not game'));
    expect(screen.queryByTestId('logo')).toBeInTheDocument();
    expect(screen.queryByTestId('footer')).toBeInTheDocument();
  });

  test(`it doesn't render logo and footer on Game path`, async () => {
    const { user } = renderWithRouter(<TestApp />);

    await user.click(screen.getByText('Game'));
    expect(screen.queryByTestId('logo')).toBeNull();
    expect(screen.queryByTestId('footer')).toBeNull();
  });
});
