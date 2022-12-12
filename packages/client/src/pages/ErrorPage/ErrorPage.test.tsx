import '@testing-library/jest-dom';

import { screen } from '@testing-library/react';

import { renderWithRouter, waitUntilLoaderToBeRemoved } from '../../utils/testingUtils';

describe('Error Page', () => {
  test('it renders at a wrong path', async () => {
    const { user } = renderWithRouter();
    await waitUntilLoaderToBeRemoved();

    await user.click(screen.getByText('Fake path'));

    expect(screen.queryByTestId('web-error__header')).toBeTruthy();
    expect(screen.queryByTestId('web-error__button')).toBeTruthy();
  });

  test(`it doesn't render at a correct path`, async () => {
    const { user } = renderWithRouter();
    await waitUntilLoaderToBeRemoved();

    await user.click(screen.getByText('Game'));
    expect(screen.queryByTestId('web-error__header')).toBeNull();
    expect(screen.queryByTestId('web-error__button')).toBeNull();
  });

  test('it can return to main page from error page', async () => {
    const { user } = renderWithRouter();
    await waitUntilLoaderToBeRemoved();

    await user.click(screen.getByText('Fake path'));
    expect(screen.queryByTestId('web-error__header')).toBeTruthy();

    //Клик по кнопке "На главную"
    await user.click(screen.getByTestId('web-error__button'));
    await waitUntilLoaderToBeRemoved();
    expect(screen.queryByTestId('web-error__header')).toBeNull();
    expect(screen.getByText('Вы на домашней странице')).toBeInTheDocument();
  });
});
