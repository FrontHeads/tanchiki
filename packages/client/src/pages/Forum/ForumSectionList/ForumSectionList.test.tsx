import '@testing-library/jest-dom';

import { screen } from '@testing-library/react';

import { renderWithRouter } from '../../../utils/testingUtils';
import { ForumSectionList } from './ForumSectionList';

describe('ForumSectionList', () => {
  const sectionList = [
    { id: 1, name: 'Как побеждать?', topicCount: 2400, messages: 100, created_at: '', updated_at: '' },
  ];
  const sectionListItem = sectionList[0];

  beforeEach(() => {
    renderWithRouter({
      component: <ForumSectionList sectionList={sectionList} />,
    });
  });

  test('it renders', () => {
    const renderedElement = screen.getByTestId(sectionListItem.id);

    expect(renderedElement).toBeInTheDocument();
  });

  test('it renders with props', () => {
    expect(screen.getByText(sectionListItem.name)).toBeInTheDocument();
    expect(screen.getByText(sectionListItem.topicCount)).toBeInTheDocument();
    expect(screen.getByText(sectionListItem.messages)).toBeInTheDocument();
  });
});
