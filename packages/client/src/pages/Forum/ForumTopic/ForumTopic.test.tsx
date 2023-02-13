import '@testing-library/jest-dom';

import { screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';

import { forumAPI } from '../../../api/forumAPI';
import { renderWithRouter } from '../../../utils/testingUtils';
import { ForumTopic } from './ForumTopic';

describe('ForumTopic', () => {
  test('it renders', async () => {
    await act(async () => {
      renderWithRouter({
        component: <ForumTopic />,
        routeLoader: async () => {
          const { data: topicData } = await forumAPI.getTopicById(1);
          return topicData;
        },
      });
    });

    const forumTopicTestId = 'forum-topic';

    const renderedForum = screen.getByTestId(forumTopicTestId);

    expect(renderedForum).toBeInTheDocument();
  });
});
