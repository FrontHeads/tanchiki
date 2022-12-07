import '@testing-library/jest-dom';

import { fireEvent, screen } from '@testing-library/react';

import { renderWithRouter } from '../../../utils/testing-utils';
import { ForumTopic } from './ForumTopic';

describe('ForumTopic', () => {
  beforeEach(() => {
    renderWithRouter({
      component: <ForumTopic />,
    });
  });

  test('it renders', () => {
    const forumTopicTestId = 'forum-topic';

    const renderedForum = screen.getByTestId(forumTopicTestId);

    expect(renderedForum).toBeInTheDocument();
  });

  test('it render textarea', () => {
    const forumTestId = 'topic-textarea';
    const addMessageBtnId = 'add-message';

    const renderedAddMessageBtn = screen.getByTestId(addMessageBtnId);

    fireEvent.click(renderedAddMessageBtn);

    const renderedTextarea = screen.getByTestId(forumTestId);
    expect(renderedTextarea).toBeInTheDocument();
  });
});
