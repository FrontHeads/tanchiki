import './ForumTopic.css';

import { FC } from 'react';

import { ForumTopicRowProps } from './typings';
import { useParams } from 'react-router-dom';
import { DUMMY_TOPIC as topicList } from '../DummyData';
import { ForumMessage } from './ForumMessage';

export const ForumTopic: FC<ForumTopicRowProps> = () => {
  const { topicId } = useParams();
  return (
    <section className="topic__wrapper">
      <h1 className="topic__title">Топик {topicId}</h1>
      <div className="topic">
        {topicList.map(row => (
          <ForumMessage key={row.id} {...row} />
        ))}
      </div>
    </section>
  );
};
