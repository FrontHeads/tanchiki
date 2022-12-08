import '@testing-library/jest-dom';

import { screen } from '@testing-library/react';

import { renderWithRouter } from '../../../utils/testing-utils';
import { ForumTopic } from './ForumTopic';

describe('ForumTopic', () => {
  test('it renders', () => {
    renderWithRouter({
      component: <ForumTopic />,
    });

    const forumTopicTestId = 'forum-topic';

    const renderedForum = screen.getByTestId(forumTopicTestId);

    expect(renderedForum).toBeInTheDocument();
  });
});
