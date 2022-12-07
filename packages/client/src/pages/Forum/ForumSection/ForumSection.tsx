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
      <h1 className="forum__title">Раздел {sectionId}</h1>
      <Breadcrumbs data={breadcrumbs} variant={BreadcrumbsVariant.Wide} />
      <table border={1} className="forum" data-testid="forum-section">
        <thead className="forum__row-header">
          <tr>
            <th className="forum__cell-header">Темы</th>
            <th className="forum__cell-header">Ответы</th>
          </tr>
        </thead>
        <tbody className="forum__body">
          <ForumTopicList topicList={topicList} sectionId={sectionId} />
        </tbody>
      </table>
    </section>
  );
};
