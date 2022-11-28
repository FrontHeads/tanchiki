import '@testing-library/jest-dom';

import { render, screen } from '@testing-library/react';

import { headerText, Leaderboard } from './Leaderboard';
describe('Leaderboard', () => {
  test('it renders', () => {
    render(<Leaderboard header={headerText} />);

    const renderedLeaderboard = screen.getByText(headerText);

    expect(renderedLeaderboard).toBeInTheDocument();
  });
});
