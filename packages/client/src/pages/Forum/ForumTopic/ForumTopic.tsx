import './ForumTopic.css';

import cn from 'classnames';
import { FC, useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';

import { Breadcrumbs } from '../../../components/Breadcrumbs';
import { BreadcrumbsVariant } from '../../../components/Breadcrumbs/typings';
import { Button } from '../../../components/Button';
import { ButtonVariant } from '../../../components/Button/typings';
import { ValidationErrors } from '../../../components/ValidationErrors';
import { generateMetaTags } from '../../../utils/seoUtils';
import { useValidation } from '../../../utils/validation';
import { ValidationErrorList } from '../../../utils/validation/typings';
import { DUMMY_TOPIC as topicList, DUMMY_TOPIC_BREADCRUMBS as breadcrumbs } from '../DummyData';
import { ForumMessage } from './ForumMessage';

export const ForumTopic: FC = () => {
  const { topicId } = useParams();
  const [formMessage, setFormMessage] = useState('');
  const [validationErrors, setValidationErrors] = useState<ValidationErrorList>({});
  const [messageHasErrors, setFormHasErrors] = useState(false);
  const validation = useValidation([
    {
      title: 'Message',
      type: 'text',
      id: 'message',
      validator: 'notEmpty',
      required: true,
    },
  ]);

  const textareaChangeHandler = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      const { value } = event.target;

      const validationResult = validation({ message: value });

      setValidationErrors(validationResult.errors);

      setFormMessage(value);
    },
    [formMessage]
  );

  const submitHandler = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const validationResult = validation({ message: formMessage });

      if (validationResult.hasErrors) {
        setFormHasErrors(true);
        setValidationErrors(validationResult.errors);
        return;
      }

      console.log(formMessage);

      setFormMessage('');
    },
    [formMessage]
  );
  const forumTopicClassNames = cn('forum-topic', {
    'forum-topic_has-errors': messageHasErrors,
  });

  return (
    <>
      {generateMetaTags({ title: `Топик {topicId}` })}

      <section className={forumTopicClassNames} data-testid="forum-topic">
        <h1 className="forum-topic__title">Топик {topicId}</h1>
        <Breadcrumbs data={breadcrumbs} variant={BreadcrumbsVariant.Normal} />
        <div className="forum-topic__container">
          <div className="forum-topic__messages">
            {topicList.map(row => (
              <ForumMessage key={row.id} message={row} />
            ))}
          </div>
          <form onSubmit={submitHandler} className="forum-topic__new-message">
            <textarea
              onChange={textareaChangeHandler}
              name="message"
              id="message"
              value={formMessage}
              className="forum-topic__textarea"
              rows={4}
              placeholder="Текст сообщения"
              data-testid="topic-textarea"
            />
            <div className="forum-topic__buttons-wrapper">
              <Button type="submit" text="Отправить" variant={ButtonVariant.Primary} />
            </div>
          </form>
          {validationErrors.message ? <ValidationErrors errorList={validationErrors.message} /> : null}
        </div>
      </section>
    </>
  );
};
