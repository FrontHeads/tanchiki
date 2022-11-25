import '@testing-library/jest-dom';

import { render } from '@testing-library/react';

import { FormField } from './FormField';

describe('FormField', () => {
  test('it render', () => {
    const { container } = render(<FormField id="login" title='Login' type="text" />);
    expect(container.querySelector('input')).toBeInTheDocument();
  });

  test('it has attributes', () => {
    const { container } = render(<FormField id="login" title='Login' type="text" />);
    expect(container.querySelector('input')).toHaveAttribute('name', 'login');
    expect(container.querySelector('input')).toHaveAttribute('type', 'text');
  });

  test('it has label', () => {
    const { container } = render(<FormField id="login" title='Login' type="text" />);

    expect(container.querySelector('.form-field__label')).toBeInTheDocument();
    expect(container.querySelector('.form-field__label')).toHaveTextContent('Login');
  });
});
