import '@testing-library/jest-dom';

import { fireEvent, render, screen } from '@testing-library/react';

import { ForumTopic } from './ForumTopic';

describe('ForumTopic', () => {
  test('it renders', () => {
    render(<ForumTopic />);
    const forumTopicTestId = 'forum-topic';

    const renderedForum = screen.getByTestId(forumTopicTestId);

    expect(renderedForum).toBeInTheDocument();
  });

  test('it render textarea', () => {
    render(<ForumTopic />);

    const forumTestId = 'topic-textarea';
    const addMessageBtnId = 'add-message';

    const renderedAddMessageBtn = screen.getByTestId(addMessageBtnId);

    fireEvent.click(renderedAddMessageBtn);

    const renderedTextarea = screen.getByTestId(forumTestId);
    expect(renderedTextarea).toBeInTheDocument();
  });
});
