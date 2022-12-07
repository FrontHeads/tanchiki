import './ForumTopic.css';

import { FC, useState } from 'react';
import { useParams } from 'react-router-dom';

import { Button } from '../../../components/Button';
import { ButtonVariant } from '../../../components/Button/typings';
import { Paths } from '../../../config/constants';
import { DUMMY_TOPIC as topicList } from '../DummyData';
import { ForumMessage } from './ForumMessage';
import { ForumTopicRowProps } from './typings';

export const ForumTopic: FC<ForumTopicRowProps> = () => {
  const { topicId } = useParams();
  const [textareaOpen, setTextareaOpen] = useState(false);

  return (
    <section className="forum-topic__wrapper" data-testid="forum-topic">
      <h1 className="forum-topic__title">Топик {topicId}</h1>
      <div className="breadcrumbs breadcrumbs_margins_normal">
        <a href={Paths.Forum}>Forum</a> {'> '}
        <a href="#">Section</a> {'> '}
        <span>Топик {topicId}</span>
      </div>
      <div className="forum-topic__container">
        <div className="forum-topic__messages">
          {topicList.map(row => (
            <ForumMessage key={row.id} {...row} />
          ))}
        </div>
        {textareaOpen ? (
          <div className="forum-topic__new-message">
            <textarea
              className="forum-topic__textarea"
              rows={4}
              placeholder="Текст сообщения"
              data-testid="topic-textarea"
            />
            <div className="forum-topic__buttons-wrapper">
              <Button onClick={() => setTextareaOpen(false)} text="Отмена" variant={ButtonVariant.Secondary} />
              <Button text="Отправить сообщение" variant={ButtonVariant.Primary} />
            </div>
          </div>
        ) : (
          <div className="forum-topic__add-message">
            <Button
              data-testid="add-message"
              onClick={() => setTextareaOpen(true)}
              text="Написать сообщение"
              variant={ButtonVariant.Primary}
            />
          </div>
        )}
      </div>
    </section>
  );
};
