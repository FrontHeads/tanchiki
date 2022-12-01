import '@testing-library/jest-dom';

import { render, screen } from '@testing-library/react';

import { headerText, Forum } from './Forum';
describe('Leaderboard', () => {
  test('it renders', () => {
    render(<Forum header={headerText} />);

    const renderedLeaderboard = screen.getByText(headerText);

    expect(renderedLeaderboard).toBeInTheDocument();
  });
});
