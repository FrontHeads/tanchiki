import '@testing-library/jest-dom';

import { screen } from '@testing-library/react';

import { renderWithRouter } from '../../../../utils/testingUtils';
import { Stick } from './Stick';

describe('Stick', () => {
  test('it render', () => {
    renderWithRouter({ component: <Stick /> });

    const renderedStick = screen.getByTestId('stick');

    expect(renderedStick).toBeInTheDocument();
  });
});
