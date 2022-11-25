import '@testing-library/jest-dom';

import { fireEvent, render, screen } from '@testing-library/react';

import { Button } from './Button';

describe('Button', () => {
  test('it render', () => {
    const buttonText = 'Кнопка';
    render(<Button text={buttonText} />);

    const renderedButton = screen.getByRole('button', { name: buttonText });

    expect(renderedButton).toBeInTheDocument();
  });

  test('it call handle function', async () => {
    const buttonText = 'Кнопка';
    const handleClick = jest.fn();

    render(<Button text={buttonText} onClick={handleClick} />);

    fireEvent.click(screen.getByText('Кнопка'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
