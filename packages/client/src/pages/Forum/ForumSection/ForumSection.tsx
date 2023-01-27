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
import { type ForumSectionProps } from './typings';

export const ForumSection: FC<ForumSectionProps> = () => {
  const navigate = useNavigate();
  const { sectionId } = useParams();
  const [topicList, setTopicList] = useState([]);

  useEffect(() => {
    if (topicList.length) {
      return;
    }
    const fetchTopics = async () => {
      const response = await forumAPI.getTopicsFromSection(Number(sectionId));
      //@ts-ignore
      setTopicList(response.data);
    };
    //  const fetchSections = async () => {
    //    const response = await forumAPI.getTopicsFromSection(Number(sectionId));
    //    setTopicList(response.data);
    //  };

    fetchTopics();
  }, []);

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
            <Button
              text="Создать тему"
              variant={ButtonVariant.Primary}
              onClick={() => navigate(`${Paths.Section}/${sectionId}${Paths.NewTopic}`)}
            />
          </div>
        </div>
        <ForumTopicList topicList={topicList} sectionId={sectionId} />
      </section>
    </>
  );
};
