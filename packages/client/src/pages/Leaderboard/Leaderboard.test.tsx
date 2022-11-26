import '@testing-library/jest-dom';

import { render, screen } from '@testing-library/react';

import { Leaderboard } from './Leaderboard';

describe('Leaderboard', () => {
  test('renders', () => {
    render(<Leaderboard />);

    const renderedLeaderboard = screen.getByText(/Рейтинг игроков/i);

    expect(renderedLeaderboard).toBeInTheDocument();
  });
});
