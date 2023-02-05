import '@testing-library/jest-dom';

import { screen } from '@testing-library/react';

import { renderWithRouter } from '../../utils/testingUtils';
import { Joystick } from './Joystick';

describe('Logo', () => {
  test('it render', () => {
    renderWithRouter({ component: <Joystick /> });

    const renderedLogo = screen.getByTestId('logo');

    expect(renderedLogo).toBeInTheDocument();
  });
});
