import '@testing-library/jest-dom';

import { screen, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';

import { leaderboardLoader } from '../../config/leaderboardRoute';
import { fakeLeaderboardData } from '../../tests/data';
import { renderWithRouter } from '../../utils/testingUtils';
import { headerText, Leaderboard } from './Leaderboard';

describe('Leaderboard', () => {
  test('it renders header', async () => {
    await act(async () => {
      renderWithRouter({
        component: <Leaderboard header={headerText} />,
        routeLoader: leaderboardLoader,
      });
    });

    expect(screen.getByText(headerText)).toBeInTheDocument();
  });

  test('it renders leaderboard table', async () => {
    renderWithRouter({
      component: <Leaderboard header={headerText} />,
      routeLoader: leaderboardLoader,
    });

    await waitFor(() => expect(screen.getAllByTestId('leaderboard-row')[0]).toBeInTheDocument());

    const leaderboardRows = screen.getAllByTestId('leaderboard-row');
    expect(leaderboardRows.length).toBe(fakeLeaderboardData.length);
  });
});
