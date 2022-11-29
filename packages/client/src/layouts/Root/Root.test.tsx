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
  test('it render header and footer', async () => {
    const { user } = renderWithRouter(<TestApp />);

    expect(screen.getByText('Вы на домашней странице')).toBeInTheDocument();

    await user.click(screen.getByText('Not game'));
    expect(screen.queryByTestId('header')).toBeDefined();
    expect(screen.queryByTestId('footer')).toBeDefined();
  });
  test('it not render header and footer on Game path', async () => {
    const { user } = renderWithRouter(<TestApp />);

    expect(screen.getByText('Вы на домашней странице')).toBeInTheDocument();

    await user.click(screen.getByText('Game'));
    expect(screen.queryByTestId('header')).toBeNull();
    expect(screen.queryByTestId('footer')).toBeNull();
  });
});
