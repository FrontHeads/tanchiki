import './Forum.css';

import { FC } from 'react';

import { generateMetaTags } from '../../utils/seoUtils';
import { DUMMY_FORUM as sectionList } from './DummyData';
import { ForumSectionList } from './ForumSectionList';
import { ForumProps } from './typing';

export const Forum: FC<ForumProps> = () => {
  const pageTitle = 'Форум';
  return (
    <>
      {generateMetaTags({ title: pageTitle })}
      <section className="forum__wrapper">
        <h1 className="forum__title" data-testid="forum-title">
          {pageTitle}
        </h1>
        <ForumSectionList sectionList={sectionList} />
      </section>
    </>
  );
};
