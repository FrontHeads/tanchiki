import '@testing-library/jest-dom';

import { render, screen } from '@testing-library/react';

import { Footer } from './Footer';

describe('Footer', () => {
  test('it render', () => {
    render(<Footer />);

    const renderedFooter = screen.getByTestId('footer');

    expect(renderedFooter).toBeInTheDocument();
  });
});
