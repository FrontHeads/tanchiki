import { FC } from 'react';
import { useParams } from 'react-router-dom';

import { Breadcrumbs } from '../../../components/Breadcrumbs';
import { BreadcrumbsVariant } from '../../../components/Breadcrumbs/typings';
import { DUMMY_SECTION as topicList, DUMMY_SECTION_BREADCRUMBS as breadcrumbs } from '../DummyData';
import { ForumTopicList } from './ForumTopicList';
import { ForumSectionProps } from './typings';

export const ForumSection: FC<ForumSectionProps> = () => {
  const { sectionId } = useParams();
  return (
    <section className="forum__wrapper">
      <h1 className="forum__title" data-testid="forum-section-title">
        Раздел {sectionId}
      </h1>
      <Breadcrumbs data={breadcrumbs} variant={BreadcrumbsVariant.Wide} />
      <ForumTopicList topicList={topicList} sectionId={sectionId} />
    </section>
  );
};
