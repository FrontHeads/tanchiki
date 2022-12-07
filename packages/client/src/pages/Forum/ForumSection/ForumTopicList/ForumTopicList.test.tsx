import '@testing-library/jest-dom';

import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { ForumTopicList } from './ForumTopicList';
import { ForumTopicItem } from './typings';

describe('ForumTopicList', () => {
  const topicList = [{ id: 1, name: 'Как побеждать?', messages: 100 } as ForumTopicItem];
  const topicListItem = topicList[0];

  test('it renders', () => {
    render(
      <table>
        <tbody>
          <ForumTopicList topicList={topicList} />
        </tbody>
      </table>,
      { wrapper: MemoryRouter }
    );

    const renderedElement = screen.getByTestId(topicListItem.id);

    expect(renderedElement).toBeInTheDocument();
  });

  test('it renders with props', () => {
    render(
      <table>
        <tbody>
          <ForumTopicList topicList={topicList} />
        </tbody>
      </table>,
      { wrapper: MemoryRouter }
    );

    expect(screen.getByText(topicListItem.name)).toBeInTheDocument();
    expect(screen.getByText(topicListItem.messages)).toBeInTheDocument();
  });
});
