import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';

import { store } from '../../store';
import { Home } from './Home';

const homeContent = 'Вот тут будет жить ваше приложение :)';

// @ts-expect-error mock function
global.fetch = jest.fn(() => Promise.resolve({ json: () => Promise.resolve('hey') }));

test('Home page test', async () => {
  render(
    <Provider store={store}>
      <Home />
    </Provider>
  );
  expect(screen.getByText(homeContent)).toBeDefined();
});
