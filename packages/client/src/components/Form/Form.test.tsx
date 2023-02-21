import '@testing-library/jest-dom';

import { fireEvent, render, screen } from '@testing-library/react';

import { Form } from './Form';

describe('Form', () => {
  test('it render form header', () => {
    const header = 'Форма';

    render(<Form header={header} />);

    const renderedForm = screen.getByText(header);

    expect(renderedForm).toBeInTheDocument();
  });

  test('it call handle function', async () => {
    const handleSubmit = jest.fn();
    const { container } = render(<Form onSubmit={handleSubmit} />);

    fireEvent.submit(screen.getByTestId('form'));
    expect(container.querySelector('form')).toBeInTheDocument();
    expect(handleSubmit).toHaveBeenCalledTimes(1);
  });
});
