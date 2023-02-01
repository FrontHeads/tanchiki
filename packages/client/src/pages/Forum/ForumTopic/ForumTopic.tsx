import './ForumTopic.css';

import cn from 'classnames';
import { type FC, useCallback, useState } from 'react';
import { useLoaderData, useParams } from 'react-router-dom';

import { forumAPI } from '../../../api/forumAPI';
import { Breadcrumbs } from '../../../components/Breadcrumbs';
import { BreadcrumbsVariant } from '../../../components/Breadcrumbs/data';
import { Button } from '../../../components/Button';
import { ButtonVariant } from '../../../components/Button/data';
import { ValidationErrors } from '../../../components/ValidationErrors';
import { useAppDispatch } from '../../../store';
import { forumThunks } from '../../../store/features/forum/forumThunks';
import { generateMetaTags } from '../../../utils/seoUtils';
import { useValidation } from '../../../utils/validation';
import { type ValidationErrorList } from '../../../utils/validation/typings';
import { EmoteMenu } from './EmoteMenu/EmoteMenu';
import { ForumMessage } from './ForumMessage';
import { ForumTopicDescription } from './ForumTopicDescription/ForumTopicDescription';
import { type ForumTopicT } from './typings';

export const ForumTopic: FC = () => {
  const dispatch = useAppDispatch();
  const currentTopic = useLoaderData() as ForumTopicT;
  const userId = currentTopic.user_id;

  const { topicId } = useParams();
  const [topicMessages, setTopicMessages] = useState(currentTopic?.messages);
  const [formMessage, setFormMessage] = useState('');
  const [validationErrors, setValidationErrors] = useState<ValidationErrorList>({});
  const [messageHasErrors, setFormHasErrors] = useState(false);
  console.log('topic messages', topicMessages);

  const validation = useValidation([
    {
      title: 'Message',
      type: 'text',
      id: 'message',
      validator: 'NotEmpty',
      required: true,
    },
  ]);

  const deleteMessage = useCallback(
    (messageId: number) => {
      forumAPI.deleteMessage(messageId).then(() => {
        const newMessageList = topicMessages.filter(message => message.id !== messageId);

        setTopicMessages(newMessageList);
      });
    },
    [topicMessages]
  );

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
      )
        .unwrap()
        .then(res => {
          setTopicMessages(oldState => [...oldState, res]);
        });

      setFormMessage('');
    },
    [formMessage]
  );

  const forumTopicClassNames = cn('forum-topic', {
    'forum-topic_has-errors': messageHasErrors,
  });

  const pasteEmojiHandler = useCallback(
    (emoji: string) => {
      setFormMessage(formMessage + emoji);
    },
    [formMessage]
  );

  return (
    <>
      {generateMetaTags({ title: `${currentTopic?.name}` })}

      <section className={forumTopicClassNames} data-testid="forum-topic">
        <h1 className="forum-topic__title">{currentTopic?.name}</h1>
        <Breadcrumbs variant={BreadcrumbsVariant.Normal} />
        <div className="forum-topic__container">
          <div className="forum-topic__messages">
            <ForumTopicDescription
              authorId={userId}
              topicId={currentTopic.id}
              description={currentTopic.content}
              date={currentTopic.created_at}
              displayName={currentTopic.user.display_name}
            />

            {topicMessages
              ? topicMessages.map(row => (
                  <ForumMessage key={row.id} message={row} deleteMessageHandler={deleteMessage} />
                ))
              : null}
          </div>
          <form onSubmit={submitHandler} className="forum-topic__new-message">
            <div className="textarea__container">
              <textarea
                onChange={textareaChangeHandler}
                name="message"
                id="message"
                value={formMessage}
                className="forum-topic__textarea textarea"
                rows={4}
                placeholder="Текст сообщения"
                data-testid="topic-textarea"
              />
              <EmoteMenu onEmojiSelect={pasteEmojiHandler} />
            </div>

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
