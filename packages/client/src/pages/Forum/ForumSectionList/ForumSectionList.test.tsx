import '@testing-library/jest-dom';

import { render, screen } from '@testing-library/react';

import { ForumSectionList } from './ForumSectionList';

describe('LeaderboardSectionList', () => {
  const sectionList = { place: 1, username: 'John', record: 1234, time: 20, matches: 99 };

  test('it renders', () => {
    render(
      <table>
        <tbody>
          <ForumSectionList sectionList={sectionList} />
        </tbody>
      </table>
    );

    const renderedElement = screen.getByText(sectionList.username);

    expect(renderedElement).toBeInTheDocument();
  });

  test('it renders with props', () => {
    render(
      <table>
        <tbody>
          <ForumSectionList sectionList={sectionList} />
        </tbody>
      </table>
    );
    expect(screen.getByText(sectionList.place)).toBeInTheDocument();
    expect(screen.getByText(sectionList.username)).toBeInTheDocument();
    expect(screen.getByText(sectionList.record)).toBeInTheDocument();
    expect(screen.getByText(sectionList.time)).toBeInTheDocument();
    expect(screen.getByText(sectionList.matches)).toBeInTheDocument();
  });
});
