import '@testing-library/jest-dom';

import { render, screen } from '@testing-library/react';

import { Loader } from './Loader';

describe('Button', () => {
  test('it render', () => {
    render(<Loader />);

    const renderedButton = screen.getByTestId('loader');

    expect(renderedButton).toBeInTheDocument();
  });
});
