import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ReactElement } from 'react';
import { BrowserRouter } from 'react-router-dom';

export const renderWithRouter = (ui: ReactElement, { route = '/' } = {}) => {
  window.history.pushState({}, 'Test page', route);

  return {
    user: userEvent.setup(),
    ...render(ui, { wrapper: BrowserRouter }),
  };
};

export const waitUntilLoaderToBeRemoved = async () => {
  await waitForElementToBeRemoved(() => screen.getByTestId('loader'));
};
