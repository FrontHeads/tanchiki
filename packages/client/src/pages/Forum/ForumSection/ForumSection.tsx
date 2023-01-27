import './ForumSection.css';

import { type FC, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { forumAPI } from '../../../api/forumAPI';
import { Breadcrumbs } from '../../../components/Breadcrumbs';
import { BreadcrumbsVariant } from '../../../components/Breadcrumbs/data';
import { Button } from '../../../components/Button';
import { ButtonVariant } from '../../../components/Button/data';
import { Paths } from '../../../config/constants';
import { generateMetaTags } from '../../../utils/seoUtils';
import { DUMMY_SECTION_BREADCRUMBS as breadcrumbs } from '../DummyData';
import { ForumTopicList } from './ForumTopicList';
import { type ForumSectionT } from './typings';

export const ForumSection: FC = () => {
  const navigate = useNavigate();
  const { sectionId } = useParams();
  const [section, setSection] = useState<ForumSectionT>(null);

  useEffect(() => {
    forumAPI.getSectionById(Number(sectionId)).then(response => {
      setSection(response.data);
    });
  }, []);

  return section ? (
    <>
      {generateMetaTags({ title: `${section.name}` })}
      <section className="forum__wrapper">
        <h1 className="forum__title" data-testid="forum-section-title">
          {section.name}
        </h1>
        <div className="actions-wrapper">
          <Breadcrumbs data={breadcrumbs} variant={BreadcrumbsVariant.Wide} />
          <div className="add-topic-wrapper">
            <Button
              text="Создать тему"
              variant={ButtonVariant.Primary}
              onClick={() => navigate(`${Paths.Section}/${sectionId}${Paths.NewTopic}`)}
            />
          </div>
        </div>
        <ForumTopicList topicList={section.topics} sectionId={sectionId} />
      </section>
    </>
  ) : null;
};
