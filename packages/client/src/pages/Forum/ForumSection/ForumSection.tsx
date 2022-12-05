import { FC } from 'react';
import { useParams } from 'react-router-dom';

import { DUMMY_SECTION as topicList } from '../DummyData';
import { ForumTopicList } from './ForumTopicList';
import { ForumSectionProps } from './typings';
import { Paths } from '../../../config/constants';

export const ForumSection: FC<ForumSectionProps> = () => {
  const { sectionId } = useParams();
  return (
    <section className="forum__wrapper">
      <h1 className="forum__title">Раздел {sectionId}</h1>
      <div className="breadcrumbs breadcrumbs_width_wide">
        <a href={Paths.Forum}>Forum</a> {'> '}
        <span>Section {sectionId}</span>
      </div>
      <table border={1} className="forum">
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
