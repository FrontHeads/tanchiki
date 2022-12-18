import '@testing-library/jest-dom';

import { render, screen } from '@testing-library/react';

import { ForumMessage } from './ForumMessage';

describe('ForumMessage', () => {
  const message = {
    id: 1,
    userId: 1,
    username: 'Ivan1990',
    date: Date(),
    content: 'Здесь что-то не так. Нет такого тэга root. Возможно это опечатка от #root',
  };

  test('it renders', () => {
    render(<ForumMessage message={message} />);
    const forumMessageTestId = 'forum-message';

    const renderedTopic = screen.getByTestId(forumMessageTestId);

    expect(renderedTopic).toBeInTheDocument();
  });

  test('it renders with props', () => {
    render(<ForumMessage message={message} />);

    expect(screen.getByText(message.username)).toBeInTheDocument();
    expect(screen.getByText(message.content)).toBeInTheDocument();
  });
});
