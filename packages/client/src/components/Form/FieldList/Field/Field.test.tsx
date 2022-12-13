import '@testing-library/jest-dom';

import { render } from '@testing-library/react';

import { Field } from './Field';

describe('Field', () => {
  test('it render', () => {
    const title = 'Login',
      id = 'login',
      type = 'text';

    const { container } = render(<Field id={id} title={title} type={type} />);

    expect(container.querySelector('input')).toBeInTheDocument();
  });

  test('it has attributes', () => {
    const title = 'Login',
      id = 'login',
      type = 'text';

    const { container } = render(<Field id={id} title={title} type={type} />);

    expect(container.querySelector('input')).toHaveAttribute('name', 'login');
    expect(container.querySelector('input')).toHaveAttribute('type', 'text');
  });

  test('it has label', () => {
    const title = 'Login',
      id = 'login',
      type = 'text';

    const { container } = render(<Field id={id} title={title} type={type} />);

    expect(container.querySelector('label')).toBeInTheDocument();
    expect(container.querySelector('label')).toHaveTextContent(title);
  });
});
