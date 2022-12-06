import '@testing-library/jest-dom';

import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

import { MenuLink } from './MenuLink';

describe('MenuLink', () => {
  test('it renders', () => {
    const onClick = jest.fn();

    render(
      <BrowserRouter>
        <MenuLink name="test" onClick={onClick} title="test" to="test" />
      </BrowserRouter>
    );

    const renderedMenu = screen.getByTestId('navigation-list__row');

    expect(renderedMenu).toBeInTheDocument();
  });
});
