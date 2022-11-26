import '@testing-library/jest-dom';

import { render, screen } from '@testing-library/react';

import { Leaderboard } from './Leaderboard';

describe('Leaderboard', () => {
  test('it render leaderboard header', () => {
    const header = 'Рейтинг игроков';

    render(<Leaderboard />);

    const renderedLeaderboard = screen.getByText(header);

    expect(renderedLeaderboard).toBeInTheDocument();
  });
});
