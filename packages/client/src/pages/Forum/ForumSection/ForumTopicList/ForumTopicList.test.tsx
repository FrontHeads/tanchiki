import '@testing-library/jest-dom';

import { screen } from '@testing-library/react';

import { renderWithRouter } from '../../../../utils/testingUtils';
import { ForumTopicList } from './ForumTopicList';
import { type ForumTopicItem } from './typings';

describe('ForumTopicList', () => {
  const topicList = [{ id: 1, name: 'Как побеждать?', messages: 100 } as ForumTopicItem];
  const topicListItem = topicList[0];

  beforeEach(() => {
    renderWithRouter({
      component: <ForumTopicList topicList={topicList} />,
    });
  });

  test('it renders', () => {
    const renderedElement = screen.getByTestId(topicListItem.id);

    expect(renderedElement).toBeInTheDocument();
  });

  test('it renders with props', () => {
    expect(screen.getByText(topicListItem.name)).toBeInTheDocument();
    expect(screen.getByText(topicListItem.messages)).toBeInTheDocument();
  });
});
