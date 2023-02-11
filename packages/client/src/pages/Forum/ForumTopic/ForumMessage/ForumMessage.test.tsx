import '@testing-library/jest-dom';

import { screen } from '@testing-library/react';

import { renderWithRouter } from '../../../../utils/testingUtils';
import { ForumMessage } from './ForumMessage';
import { type ForumMessageT } from './typings';

describe('ForumMessage', () => {
  const mockFn = jest.fn();
  const message: ForumMessageT = {
    topic_id: 0,
    updated_at: '',
    id: 1,
    user_id: 1,
    created_at: Date(),
    content: 'Здесь что-то не так. Нет такого тэга root. Возможно это опечатка от #root',
    user: {
      display_name: 'User 1',
      avatar: '',
      id: 1,
      login: 'login',
      created_at: '',
      updated_at: '',
    },
  };

  test('it renders', () => {
    renderWithRouter({ component: <ForumMessage deleteMessageHandler={mockFn} message={message as ForumMessageT} /> });
    const forumMessageTestId = 'forum-message';

    const renderedTopic = screen.getByTestId(forumMessageTestId);

    expect(renderedTopic).toBeInTheDocument();
  });

  test('it renders with props', () => {
    renderWithRouter({ component: <ForumMessage deleteMessageHandler={mockFn} message={message as ForumMessageT} /> });

    expect(screen.getByText(message.content)).toBeInTheDocument();
  });
});
