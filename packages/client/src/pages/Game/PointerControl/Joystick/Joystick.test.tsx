import '@testing-library/jest-dom';

import { screen } from '@testing-library/react';

import { renderWithRouter } from '../../../../utils/testingUtils';
import { Joystick } from './Joystick';

describe('Joystick', () => {
  test('it render', () => {
    renderWithRouter({ component: <Joystick /> });

    const renderedJoystick = screen.getByTestId('joystick');
    const renderedJoystickCenter = screen.getByTestId('joystick__center');

    expect(renderedJoystick).toBeInTheDocument();
    expect(renderedJoystickCenter).toBeInTheDocument();
  });
});
