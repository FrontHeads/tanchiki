import '@testing-library/jest-dom';

import { render, screen } from '@testing-library/react';

import { Logo } from './Logo';

describe('Logo', () => {
  test('it render', () => {
    render(<Logo />);

    const renderedLogo = screen.getByTestId('logo');

    expect(renderedLogo).toBeInTheDocument();
  });
});
