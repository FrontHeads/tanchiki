import '@testing-library/jest-dom';

import { render, screen } from '@testing-library/react';

import { ValidationErrors } from './ValidationErrors';

describe('ValidationErrors', () => {
  const errorText = 'Error';
  const validationErrors = [errorText, 'second'];

  test('it renders', () => {
    render(<ValidationErrors validationErrors={validationErrors} />);

    const renderedElement = screen.getByText(errorText);

    expect(renderedElement).toBeInTheDocument();
  });
});
