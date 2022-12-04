import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ReactElement } from 'react';
import { Provider } from 'react-redux';
import { createMemoryRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';

import { rootLoader } from '../config/router';
import { Root } from '../layouts/Root';
import { store } from '../store';
import { testAppRoutes } from '../tests/TestApp';

export const renderWithRouter = ({
  ui,
  route = '/',
  wrapWithRootLayout = false,
}: {
  ui?: ReactElement;
  route?: string;
  wrapWithRootLayout?: boolean;
} = {}) => {
  window.history.pushState({}, 'Test page', route);

  let routes;
  if (!ui) {
    routes = testAppRoutes;
  } else {
    routes = <Route path="/" element={ui} />;
    if (wrapWithRootLayout) {
      routes = (
        <Route element={<Root />} loader={rootLoader}>
          {routes}
        </Route>
      );
    }
  }

  return {
    user: userEvent.setup(),
    ...render(
      <Provider store={store}>
        <RouterProvider router={createMemoryRouterRoutes(routes)} />
      </Provider>
    ),
  };
};

export const waitUntilLoaderToBeRemoved = async () => {
  if (screen.getByTestId('fallback-loader')) {
    await waitForElementToBeRemoved(() => screen.getByTestId('fallback-loader'));
  }
};

export const createMemoryRouterRoutes = (routes: JSX.Element) => createMemoryRouter(createRoutesFromElements(routes));
