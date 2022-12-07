import '@testing-library/jest-dom';

import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { ForumSectionList } from './ForumSectionList';

describe('ForumSectionList', () => {
  const sectionList = [{ id: 1, name: 'Как побеждать?', topicCount: 2400, messages: 100 }];
  const sectionListItem = sectionList[0];

  test('it renders', () => {
    render(
      <table>
        <tbody>
          <ForumSectionList sectionList={sectionList} />
        </tbody>
      </table>,
      { wrapper: MemoryRouter }
    );

    const renderedElement = screen.getByTestId(sectionListItem.id);

    expect(renderedElement).toBeInTheDocument();
  });

  test('it renders with props', () => {
    render(
      <table>
        <tbody>
          <ForumSectionList sectionList={sectionList} />
        </tbody>
      </table>,
      { wrapper: MemoryRouter }
    );

    expect(screen.getByText(sectionListItem.name)).toBeInTheDocument();
    expect(screen.getByText(sectionListItem.topicCount)).toBeInTheDocument();
    expect(screen.getByText(sectionListItem.messages)).toBeInTheDocument();
  });
});
