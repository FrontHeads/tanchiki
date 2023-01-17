import { type FC } from 'react';
import { useParams } from 'react-router-dom';

import { Breadcrumbs } from '../../../components/Breadcrumbs';
import { BreadcrumbsVariant } from '../../../components/Breadcrumbs/data';
import { generateMetaTags } from '../../../utils/seoUtils';
import { DUMMY_SECTION as topicList, DUMMY_SECTION_BREADCRUMBS as breadcrumbs } from '../DummyData';
import { ForumTopicList } from './ForumTopicList';
import { type ForumSectionProps } from './typings';

export const ForumSection: FC<ForumSectionProps> = () => {
  const { sectionId } = useParams();
  return (
    <>
      {generateMetaTags({ title: `Раздел ${sectionId}` })}
      <section className="forum__wrapper">
        <h1 className="forum__title" data-testid="forum-section-title">
          Раздел {sectionId}
        </h1>
        <Breadcrumbs data={breadcrumbs} variant={BreadcrumbsVariant.Wide} />
        <ForumTopicList topicList={topicList} sectionId={sectionId} />
      </section>
    </>
  );
};
