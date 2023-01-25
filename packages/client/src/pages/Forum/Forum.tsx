import './Forum.css';

import { type FC, useEffect, useState } from 'react';

import { forumAPI } from '../../api/forumAPI';
import { generateMetaTags } from '../../utils/seoUtils';
import { ForumSectionList } from './ForumSectionList';
import { type ForumSectionItem } from './ForumSectionList/typings';
import { type ForumProps } from './typing';

export const Forum: FC<ForumProps> = () => {
  const [sectionList, setSectionList] = useState<ForumSectionItem[]>([]);

  const pageTitle = 'Форум';

  useEffect(() => {
    if (sectionList.length) {
      return;
    }

    const fetchSections = async () => {
      const response = await forumAPI.getAllSections();
      setSectionList(response.data);
      console.log(response.data);
    };
    fetchSections();
  }, [sectionList]);

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
