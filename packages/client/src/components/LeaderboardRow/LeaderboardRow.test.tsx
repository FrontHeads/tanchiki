import '@testing-library/jest-dom';

import { render, screen } from '@testing-library/react';

import { LeaderboardRow } from './LeaderboardRow';

describe('LeaderboardRow', () => {
  const place = 1,
    username = 'John',
    record = 1234,
    time = 20,
    matches = 99;

  test('renders', () => {
    render(
      <table>
        <tbody>
          <LeaderboardRow place={place} username={username} record={record} time={time} matches={matches} />
        </tbody>
      </table>
    );

    const renderedElement = screen.getByText(username);

    expect(renderedElement).toBeInTheDocument();
  });

  test('renders with props', () => {
    render(
      <table>
        <tbody>
          <LeaderboardRow place={place} username={username} record={record} time={time} matches={matches} />
        </tbody>
      </table>
    );
    expect(screen.getByText(place)).toBeInTheDocument();
    expect(screen.getByText(username)).toBeInTheDocument();
    expect(screen.getByText(record)).toBeInTheDocument();
    expect(screen.getByText(time)).toBeInTheDocument();
    expect(screen.getByText(matches)).toBeInTheDocument();
  });
});
