import './ForumTopic.css';

import { FC } from 'react';
import { useParams } from 'react-router-dom';

import { DUMMY_TOPIC as topicList } from '../DummyData';
import { ForumMessage } from './ForumMessage';
import { ForumTopicRowProps } from './typings';
import { Paths } from '../../../config/constants';

export const ForumTopic: FC<ForumTopicRowProps> = () => {
  const { topicId } = useParams();
  return (
    <section className="topic__wrapper">
      <h1 className="topic__title">Топик {topicId}</h1>
      <div className="breadcrumbs breadcrumbs_width_normal">
        <a href={Paths.Forum}>Forum</a> {'> '}
        <a href="#">Section</a> {'> '}
        <span>Топик {topicId}</span>
      </div>
      <div className="topic">
        {topicList.map(row => (
          <ForumMessage key={row.id} {...row} />
        ))}
      </div>
    </section>
  );
};
