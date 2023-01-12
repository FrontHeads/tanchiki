import './Forum.css';

import { type FC } from 'react';

import { DUMMY_FORUM as sectionList } from './DummyData';
import { ForumSectionList } from './ForumSectionList';
import { type ForumProps } from './typing';

export const Forum: FC<ForumProps> = () => {
  return (
    <section className="forum__wrapper">
      <h1 className="forum__title" data-testid="forum-title">
        Форум
      </h1>
      <ForumSectionList sectionList={sectionList} />
    </section>
  );
};
