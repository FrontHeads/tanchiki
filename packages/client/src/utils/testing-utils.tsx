import { render } from '@testing-library/react';
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
  let routes;
  if (!ui) {
    routes = testAppRoutes;
  } else {
    routes = <Route path={route} element={ui} />;
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
        <RouterProvider router={createMemoryRouterRoutes(routes, { initialEntries: [route] })} />
      </Provider>
    ),
  };
};

export const waitUntilLoaderToBeRemoved = async () => {
  // TODO: Temporary solution. Fix it later
  await sleep();
  // if (screen.getByTestId('fallback-loader')) {
  //   await waitForElementToBeRemoved(() => screen.getByTestId('fallback-loader'));
  // }
};

export const createMemoryRouterRoutes = (routes: JSX.Element, opts?: Parameters<typeof createMemoryRouter>[1]) =>
  createMemoryRouter(createRoutesFromElements(routes), opts);

export const sleep = (ms = 300) => {
  return new Promise(r => setTimeout(r, ms));
};
