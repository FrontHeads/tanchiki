import '@testing-library/jest-dom';

import { fireEvent, render, screen } from '@testing-library/react';

import { Dropdown } from './Dropdown';

describe('Dropdown', () => {
  test('it renders and call handle function', async () => {
    const buttonText = 'Кнопка';
    const menuItemText = 'text text';
    const handleClick = jest.fn();

    render(
      <Dropdown
        trigger={<button>{buttonText}</button>}
        menu={[<button onClick={handleClick}>{menuItemText}</button>]}
      />
    );

    fireEvent.click(screen.getByText(buttonText));
    expect(screen.getByText(menuItemText)).toBeInTheDocument();

    fireEvent.click(screen.getByText(menuItemText));
    expect(handleClick).toHaveBeenCalled();
  });
});
