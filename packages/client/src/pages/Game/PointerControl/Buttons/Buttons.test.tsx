import '@testing-library/jest-dom';

import { screen } from '@testing-library/react';

import { renderWithRouter } from '../../../../utils/testingUtils';
import { Buttons } from './Buttons';

describe('Controller Buttons', () => {
  test('it render', () => {
    renderWithRouter({ component: <Buttons /> });

    const renderedServiceButtons = screen.getByTestId('controller__service');
    const renderedShootButton = screen.getByTestId('controller__shoot');

    expect(renderedServiceButtons).toBeInTheDocument();
    expect(renderedShootButton).toBeInTheDocument();
  });
});
