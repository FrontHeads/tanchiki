import './ForumMessage.css';

import cn from 'classnames';
import { type FC, memo, useCallback, useState } from 'react';

import { forumAPI } from '../../../../api/forumAPI/forumAPI';
import { Button } from '../../../../components/Button';
import { ButtonVariant } from '../../../../components/Button/data';
import { Dropdown } from '../../../../components/Dropdown';
import { type DropdownMenuItems } from '../../../../components/Dropdown/typings';
import { ValidationErrors } from '../../../../components/ValidationErrors';
import { authSelectors, useAppSelector } from '../../../../store';
import simplifyDate from '../../../../utils/dateUtils';
import { getAvatar } from '../../../../utils/getAvatar';
import { useValidation } from '../../../../utils/validation';
import { type ValidationErrorList } from '../../../../utils/validation/typings';
import { EmoteMenu } from '../EmoteMenu';
import { type ForumMessageProps } from './typings';

export const ForumMessage: FC<ForumMessageProps> = memo(props => {
  const [message, setMessage] = useState(props.message);
  const [messageContent, setMessageContent] = useState(message.content);
  const [isEditMessage, setIsEditMessage] = useState<boolean>(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrorList>({});
  const [messageHasErrors, setMessageHasErrors] = useState(false);
  const userId = useAppSelector(authSelectors.userProfile)?.id;
  const avatarPath = getAvatar(message.user.avatar);

  // Проверяем, является ли пользователь отправителем сообщения.
  const isAuthor = message.user_id === userId;

  const displayName = message.user.display_name || message.user.login;

  const validation = useValidation([
    {
      title: 'Edit message',
      type: 'text',
      id: 'message',
      validator: 'NotEmpty',
      required: true,
    },
  ]);

  const editMessage = () => {
    setIsEditMessage(true);
  };

  const menuItems: DropdownMenuItems[] = [
    { onClick: editMessage, title: 'Редактировать' },
    { onClick: () => props.deleteMessageHandler(message.id), title: 'Удалить' },
  ];

  const messageChangeHandler = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      const { value } = event.target;
      const validationResult = validation({ message: value });
      setValidationErrors(validationResult.errors);

      setMessageContent(value);
    },
    [messageContent]
  );

  const forumMessageClassNames = cn('forum-message', {
    'form_has-errors': messageHasErrors,
  });

  const submitHandler = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const validationResult = validation({ message: messageContent });

      if (validationResult.hasErrors) {
        setMessageHasErrors(true);
        setValidationErrors(validationResult.errors);
        return;
      }

      forumAPI.editMessage(message.id, { content: messageContent }).then(res => {
        setMessage(res.data);
      });
      setIsEditMessage(false);
    },

    [messageContent]
  );

  const formattedDate = simplifyDate(message.created_at);

  const pasteEmojiHandler = useCallback(
    (emoji: string) => {
      setMessageContent(messageContent + emoji);
    },
    [messageContent]
  );

  return (
    <div id={`forum-message-${message.id}`} className={forumMessageClassNames} data-testid="forum-message">
      <div className="forum-message__avatar">
        <img alt={`${displayName} user avatar`} className="forum-message__avatar-image" src={avatarPath} />
      </div>
      <div className="forum-message__content">
        <div className="forum-message__meta">
          <span className="forum-message__username">{displayName}</span>
          <time className="forum-message__date">{formattedDate}</time>
        </div>
        {isEditMessage ? (
          <>
            {validationErrors.message ? <ValidationErrors errorList={validationErrors.message} /> : null}
            <form onSubmit={submitHandler} className="textarea__container">
              <textarea
                rows={4}
                name="message"
                id="message"
                className="forum-topic__textarea"
                onChange={messageChangeHandler}
                value={messageContent}
              />
              <EmoteMenu onEmojiSelect={pasteEmojiHandler} />

              <Button type="submit" text="Изменить сообщение" variant={ButtonVariant.Secondary} />
            </form>
          </>
        ) : (
          <div className="forum-message__text">{message.content}</div>
        )}
      </div>

      {isAuthor ? (
        <Dropdown
          trigger={
            <div className="forum-message__options">
              <svg
                aria-label="Show options"
                role="img"
                height="16"
                viewBox="0 0 16 16"
                version="1.1"
                width="16"
                data-view-component="true">
                <path d="M8 9a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM1.5 9a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm13 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"></path>
              </svg>
            </div>
          }
          menuItems={menuItems}
        />
      ) : null}
    </div>
  );
});
