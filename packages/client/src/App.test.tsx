import { render, screen } from '@testing-library/react';

import App from './App';

const appContent = 'Вот тут будет жить ваше приложение :)';

// @ts-expect-error mock functions
global.fetch = jest.fn(() =>
  Promise.resolve({ json: () => Promise.resolve('hey') })
);

test('Example test', async () => {
  render(<App />);
  expect(screen.getByText(appContent)).toBeDefined();
});
