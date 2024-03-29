import { render, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { type ReactElement } from 'react';
import { Provider } from 'react-redux';
import {
  type LoaderFunction,
  createMemoryRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';

import { rootLoader } from '../config/router';
import { Root } from '../layouts/Root';
import { setupStore } from '../store';
import { type AppDispatch } from '../store/store';
import { testAppRoutes } from '../tests/TestApp';

type renderWithRouterArgs = {
  component?: ReactElement;
  route?: string;
  wrapWithRootLayout?: boolean;
  routeLoader?: (dispatch: AppDispatch) => LoaderFunction;
};

/**
 * Renders test app
 *
 * @param {Object} obj - Parameters
 * @param {string} obj.component - Component to render. If not set - renders <TestApp/>
 * @param {string} obj.wrapWithRootLayout - Sets whether the component should be wrapped with the <Root/> layout or not.
 * @param {string} obj.route - Initial route
 * @param {string} obj.routeLoader - routeLoader
 */
export const renderWithRouter = ({
  component,
  route = '/',
  wrapWithRootLayout = false,
  routeLoader,
}: renderWithRouterArgs = {}) => {
  const store = setupStore();

  let routes;

  if (!component) {
    routes = testAppRoutes(store.dispatch);
  } else {
    routes = <Route path={route} element={component} loader={routeLoader && routeLoader(store.dispatch)} />;

    if (wrapWithRootLayout) {
      routes = (
        <Route element={<Root />} loader={rootLoader(store.dispatch)}>
          {routes}
        </Route>
      );
    }
  }

  const renderResult = render(
    <Provider store={store}>
      <RouterProvider router={createMemoryRouterRoutes(routes, { initialEntries: [route] })} />
    </Provider>
  );

  return { user: userEvent.setup(), ...renderResult, store };
};

export const createMemoryRouterRoutes = (routes: JSX.Element, opts?: Parameters<typeof createMemoryRouter>[1]) =>
  createMemoryRouter(createRoutesFromElements(routes), opts);

// Waits until the <Loader/> is removed from the user interface and the application loads the real content
export const waitUntilLoaderToBeRemoved = async (testId = 'fallback-loader') => {
  await waitFor(() => expect(screen.getByTestId(testId)).toBeInTheDocument());
  await waitForElementToBeRemoved(() => screen.getByTestId(testId));
};
