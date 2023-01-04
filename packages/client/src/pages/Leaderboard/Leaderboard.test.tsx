import '@testing-library/jest-dom';

import { screen } from '@testing-library/react';

import { renderWithRouter } from '../../utils/testingUtils';
import { headerText, Leaderboard } from './Leaderboard';
describe('Leaderboard', () => {
  test('it renders', () => {
    renderWithRouter({ component: <Leaderboard header={headerText} /> });

    const renderedLeaderboard = screen.getByText(headerText);

    expect(renderedLeaderboard).toBeInTheDocument();
  });
});
