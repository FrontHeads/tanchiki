import './ForumTopic.css';

import { FC } from 'react';
import { useParams } from 'react-router-dom';

import { Breadcrumbs } from '../../../components/Breadcrumbs';
import { BreadcrumbsVariant } from '../../../components/Breadcrumbs/typings';
import { Button } from '../../../components/Button';
import { ButtonVariant } from '../../../components/Button/typings';
import { DUMMY_TOPIC as topicList, DUMMY_TOPIC_BREADCRUMBS as breadcrumbs } from '../DummyData';
import { ForumMessage } from './ForumMessage';
import { ForumTopicRowProps } from './typings';

export const ForumTopic: FC<ForumTopicRowProps> = () => {
  const { topicId } = useParams();

  return (
    <section className="forum-topic__wrapper" data-testid="forum-topic">
      <h1 className="forum-topic__title">Топик {topicId}</h1>
      <Breadcrumbs data={breadcrumbs} variant={BreadcrumbsVariant.Normal} />
      <div className="forum-topic__container">
        <div className="forum-topic__messages">
          {topicList.map(row => (
            <ForumMessage key={row.id} {...row} />
          ))}
        </div>
        <div className="forum-topic__new-message">
          <textarea
            className="forum-topic__textarea"
            rows={4}
            placeholder="Текст сообщения"
            data-testid="topic-textarea"
          />
          <div className="forum-topic__buttons-wrapper">
            <Button text="Отправить" variant={ButtonVariant.Primary} />
          </div>
        </div>
      </div>
    </section>
  );
};
