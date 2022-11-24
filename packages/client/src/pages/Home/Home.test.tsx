import { render, screen } from '@testing-library/react';

import { Home } from './Home';

const homeContent = 'Вот тут будет жить ваше приложение :)';

// @ts-expect-error mock function
global.fetch = jest.fn(() => Promise.resolve({ json: () => Promise.resolve('hey') }));

test('Home page test', async () => {
  render(<Home />);
  expect(screen.getByText(homeContent)).toBeDefined();
});
