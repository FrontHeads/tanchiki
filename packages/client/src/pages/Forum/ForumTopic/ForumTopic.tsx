import './ForumTopic.css';

import cn from 'classnames';
import { type FC, useCallback, useState } from 'react';
import { useLoaderData, useParams } from 'react-router-dom';

import { Breadcrumbs } from '../../../components/Breadcrumbs';
import { BreadcrumbsVariant } from '../../../components/Breadcrumbs/data';
import { Button } from '../../../components/Button';
import { ButtonVariant } from '../../../components/Button/data';
import { ValidationErrors } from '../../../components/ValidationErrors';
import { authSelectors, useAppDispatch, useAppSelector } from '../../../store';
import { forumThunks } from '../../../store/features/forum/forumThunks';
import { generateMetaTags } from '../../../utils/seoUtils';
import { useValidation } from '../../../utils/validation';
import { type ValidationErrorList } from '../../../utils/validation/typings';
import { type ForumTopicItem } from '../ForumSection/ForumTopicList/typings';
import { ForumMessage } from './ForumMessage';

export const ForumTopic: FC = () => {
  const dispatch = useAppDispatch();
  const { id: userId } = useAppSelector(authSelectors.userProfile);
  const { topicData: currentTopic } = useLoaderData() as { topicData: ForumTopicItem };
  console.log(currentTopic);

  const { topicId } = useParams();
  // const [currentTopic, setCurrentTopic] = useState<ForumTopicItem | undefined>(undefined);
  const topicMessages = currentTopic?.messages;
  const [formMessage, setFormMessage] = useState('');
  const [validationErrors, setValidationErrors] = useState<ValidationErrorList>({});
  const [messageHasErrors, setFormHasErrors] = useState(false);
  const validation = useValidation([
    {
      title: 'Message',
      type: 'text',
      id: 'message',
      validator: 'NotEmpty',
      required: true,
    },
  ]);

  // useEffect(() => {
  //   const fetchCurrentTopic = async () => {
  //     const { data } = await forumAPI.getTopicById(Number(topicId));
  //     console.log(data);

  //     setCurrentTopic(data);
  //   };
  //   if (!currentTopic) {
  //     fetchCurrentTopic();
  //   }
  // }, [topicId]);

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

      dispatch(
        forumThunks.createMessage({
          user_id: userId,
          topic_id: Number(topicId),
          content: formMessage,
        })
      );

      setFormMessage('');
    },
    [formMessage]
  );

  const forumTopicClassNames = cn('forum-topic', {
    'forum-topic_has-errors': messageHasErrors,
  });

  return (
    <>
      {generateMetaTags({ title: `${currentTopic?.name}` })}

      <section className={forumTopicClassNames} data-testid="forum-topic">
        <h1 className="forum-topic__title">{currentTopic?.name}</h1>
        <Breadcrumbs variant={BreadcrumbsVariant.Normal} />
        <div className="forum-topic__container">
          <div className="forum-topic__messages">
            {topicMessages ? topicMessages.map(row => <ForumMessage key={row.id} message={row} />) : null}
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
