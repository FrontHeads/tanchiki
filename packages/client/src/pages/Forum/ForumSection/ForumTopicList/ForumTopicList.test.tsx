import '@testing-library/jest-dom';

import { screen } from '@testing-library/react';

import { renderWithRouter } from '../../../../utils/testing-utils';
import { ForumTopicList } from './ForumTopicList';
import { ForumTopicItem } from './typings';

describe('ForumTopicList', () => {
  const topicList = [{ id: 1, name: 'Как побеждать?', messages: 100 } as ForumTopicItem];
  const topicListItem = topicList[0];

  beforeEach(() => {
    renderWithRouter({
      component: (
        <table>
          <tbody>
            <ForumTopicList topicList={topicList} />
          </tbody>
        </table>
      ),
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
