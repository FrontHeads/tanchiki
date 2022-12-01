import { getByTestId, queryByTestId, render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

import { renderWithRouter } from '../../utils/testing-utils';
import { Home } from './Home';

describe('Home page', () => {
  test('it renders', () => {
    renderWithRouter(<Home />);

    const { container } = render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    expect(queryByTestId(container, 'nav')).toBeInTheDocument();
  });

  test('it have nav', () => {
    const { container } = render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    const nav = getByTestId(container, 'nav');

    expect(nav).toBeInTheDocument();
  });
});
