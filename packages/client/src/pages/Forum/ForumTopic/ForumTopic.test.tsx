import '@testing-library/jest-dom';

import { render, screen } from '@testing-library/react';

import { ForumTopic } from './ForumTopic';

describe('LeaderboardRow', () => {
  const row = { place: 1, username: 'John', record: 1234, time: 20, matches: 99 };

  test('it renders', () => {
    render(
      <table>
        <tbody>
          <ForumTopic row={row} />
        </tbody>
      </table>
    );

    const renderedElement = screen.getByText(row.username);

    expect(renderedElement).toBeInTheDocument();
  });

  test('it renders with props', () => {
    render(
      <table>
        <tbody>
          <ForumTopic row={row} />
        </tbody>
      </table>
    );
    expect(screen.getByText(row.place)).toBeInTheDocument();
    expect(screen.getByText(row.username)).toBeInTheDocument();
    expect(screen.getByText(row.record)).toBeInTheDocument();
    expect(screen.getByText(row.time)).toBeInTheDocument();
    expect(screen.getByText(row.matches)).toBeInTheDocument();
  });
});
