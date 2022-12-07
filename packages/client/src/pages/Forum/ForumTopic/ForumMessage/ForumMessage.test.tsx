import '@testing-library/jest-dom';

import { render, screen } from '@testing-library/react';

import { ForumMessage } from './ForumMessage';

describe('ForumMessage', () => {
  const messageProps = {
    id: 1,
    userId: 1,
    username: 'Ivan1990',
    date: Date(),
    content: 'Здесь что-то не так. Нет такого тэга root. Возможно это опечатка от #root',
  };

  test('it renders', () => {
    render(<ForumMessage {...messageProps} />);
    const forumMessageTestId = 'forum-message';

    const renderedTopic = screen.getByTestId(forumMessageTestId);

    expect(renderedTopic).toBeInTheDocument();
  });

  test('it renders with props', () => {
    render(<ForumMessage {...messageProps} />);

    expect(screen.getByText(messageProps.username)).toBeInTheDocument();
    expect(screen.getByText(messageProps.content)).toBeInTheDocument();
  });
});
