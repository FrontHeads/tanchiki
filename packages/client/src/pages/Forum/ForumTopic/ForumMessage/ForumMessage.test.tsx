import '@testing-library/jest-dom';

import { render, screen } from '@testing-library/react';

import { ForumMessage } from './ForumMessage';
import { type ForumMessageT } from './typings';

describe('ForumMessage', () => {
  const mockFn = jest.fn();
  const message = {
    topic_id: 0,
    updated_at: '',
    id: 1,
    user_id: 1,
    created_at: Date(),
    content: 'Здесь что-то не так. Нет такого тэга root. Возможно это опечатка от #root',
  };

  test('it renders', () => {
    render(<ForumMessage deleteMessageHandler={mockFn} message={message as ForumMessageT} />);
    const forumMessageTestId = 'forum-message';

    const renderedTopic = screen.getByTestId(forumMessageTestId);

    expect(renderedTopic).toBeInTheDocument();
  });

  test('it renders with props', () => {
    render(<ForumMessage deleteMessageHandler={mockFn} message={message as ForumMessageT} />);

    expect(screen.getByText(message.content)).toBeInTheDocument();
  });
});
