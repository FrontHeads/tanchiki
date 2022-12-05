import '@testing-library/jest-dom';

import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

import { MenuLink } from './MenuLink';

describe('MenuLink', () => {
  test('it renders', () => {
    const clickHandler = jest.fn();

    render(
      <BrowserRouter>
        <MenuLink id="test" clickHandler={clickHandler} title="test" to="test" />
      </BrowserRouter>
    );

    const renderedMenu = screen.getByTestId('navigation-list__row');

    expect(renderedMenu).toBeInTheDocument();
  });
});
