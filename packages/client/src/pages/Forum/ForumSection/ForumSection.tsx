import './ForumSection.css';

import { type FC } from 'react';
import { useParams } from 'react-router-dom';

import { Breadcrumbs } from '../../../components/Breadcrumbs';
import { BreadcrumbsVariant } from '../../../components/Breadcrumbs/data';
import { Button } from '../../../components/Button';
import { ButtonVariant } from '../../../components/Button/data';
import { forumActions, useAppDispatch } from '../../../store';
import { generateMetaTags } from '../../../utils/seoUtils';
import { DUMMY_SECTION as topicList, DUMMY_SECTION_BREADCRUMBS as breadcrumbs } from '../DummyData';
import { ForumTopicList } from './ForumTopicList';
import { type ForumSectionProps } from './typings';

export const ForumSection: FC<ForumSectionProps> = () => {
  const { sectionId } = useParams();
  const dispatch = useAppDispatch();

  const handleClick = () => {
    dispatch(forumActions.addTopic());
  };
  return (
    <>
      {generateMetaTags({ title: `Раздел ${sectionId}` })}
      <section className="forum__wrapper">
        <h1 className="forum__title" data-testid="forum-section-title">
          Раздел {sectionId}
        </h1>
        <div className="actions-wrapper">
          <Breadcrumbs data={breadcrumbs} variant={BreadcrumbsVariant.Wide} />
          <div className="add-topic-wrapper">
            <Button text="Создать тему" variant={ButtonVariant.Primary} onClick={handleClick} />
          </div>
        </div>
        <ForumTopicList topicList={topicList} sectionId={sectionId} />
      </section>
    </>
  );
};
