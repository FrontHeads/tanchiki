import '@testing-library/jest-dom';

import { render, screen } from '@testing-library/react';

import { ForumTopicList } from './ForumTopicList';

describe('LeaderboardSectionList', () => {
  const topicList = [{ id: 4, name: 'SomeBoy', topicCount: 2400, messages: 81 }];

  test('it renders', () => {
    render(
      <table>
        <tbody>
          <ForumTopicList topicList={topicList} />
        </tbody>
      </table>
    );

    // const renderedElement = screen.getByText(topicList.name);

    // expect(renderedElement).toBeInTheDocument();
  });

  test('it renders with props', () => {
    render(
      <table>
        <tbody>
          <ForumTopicList topicList={topicList} />
        </tbody>
      </table>
    );
    expect(screen.getByText(topicList.place)).toBeInTheDocument();
    expect(screen.getByText(topicList.username)).toBeInTheDocument();
    expect(screen.getByText(topicList.record)).toBeInTheDocument();
    expect(screen.getByText(topicList.time)).toBeInTheDocument();
    expect(screen.getByText(topicList.matches)).toBeInTheDocument();
  });
});
