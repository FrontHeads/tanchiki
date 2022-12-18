import '@testing-library/jest-dom';

import { screen } from '@testing-library/react';

import { renderWithRouter } from '../../utils/testingUtils';
import { Logo } from './Logo';

describe('Logo', () => {
  test('it render', () => {
    renderWithRouter({ component: <Logo /> });

    const renderedLogo = screen.getByTestId('logo');

    expect(renderedLogo).toBeInTheDocument();
  });
});
