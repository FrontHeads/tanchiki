import '@testing-library/jest-dom';

import { screen } from '@testing-library/react';

import { TestApp } from '../../tests/TestApp';
import { renderWithRouter } from '../../utils/testing-utils';

jest.mock('react-router-dom', () => {
  return {
    ...jest.requireActual('react-router-dom'),
    useRouteError: () => ({ url: '' }),
    useNavigation: jest.fn(() => ({ state: '' })),
  };
});

describe('Error Page', () => {
  test('it render at a wrong path', async () => {
    const { user } = renderWithRouter(<TestApp />);

    await user.click(screen.getByText('Fake path'));

    expect(screen.queryByTestId('web-error__header')).toBeTruthy();
    expect(screen.queryByTestId('web-error__button')).toBeTruthy();
  });

  test('it NOT render at a correct path', async () => {
    const { user } = renderWithRouter(<TestApp />);

    await user.click(screen.getByText('Game'));
    expect(screen.queryByTestId('web-error__header')).toBeNull();
    expect(screen.queryByTestId('web-error__button')).toBeNull();
  });

  test('it can return to main page from error page', async () => {
    const { user } = renderWithRouter(<TestApp />);

    await user.click(screen.getByText('Fake path'));
    expect(screen.queryByTestId('web-error__header')).toBeTruthy();

    //Клик по кнопке "На главную"
    await user.click(screen.getByTestId('web-error__button'));
    expect(screen.queryByTestId('web-error__header')).toBeNull();
    expect(screen.getByText('Вы на домашней странице')).toBeInTheDocument();
  });
});
