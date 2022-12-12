import './Forum.css';

import { FC } from 'react';

import { DUMMY_FORUM as sectionList } from './DummyData';
import { ForumSectionList } from './ForumSectionList';
import { ForumProps } from './typing';

export const Forum: FC<ForumProps> = () => {
  return (
    <section className="forum__wrapper">
      <h1 className="forum__title">Форум</h1>
      <table border={1} className="forum" data-testid="forum">
        <ForumSectionList sectionList={sectionList} />
      </table>
    </section>
  );
};
