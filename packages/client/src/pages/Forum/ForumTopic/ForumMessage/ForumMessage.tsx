import './ForumMessage.css';

import { type FC, memo, useCallback, useState } from 'react';

import defaultAvatarPath from '/assets/img/default-avatar.png';

import { forumAPI } from '../../../../api/forumAPI';
import { Button } from '../../../../components/Button';
import { ButtonVariant } from '../../../../components/Button/data';
import { Dropdown } from '../../../../components/Dropdown';
import { type DropdownMenuItems } from '../../../../components/Dropdown/typings';
import simplifyDate from '../../../../utils/dateUtils';
import { type ForumMessageProps } from './typings';

export const ForumMessage: FC<ForumMessageProps> = memo(props => {
  const [message, setMessage] = useState(props.message);
  const [isEditMessage, setIsEditMessage] = useState<boolean>(false);

  console.log(message);
  const displayName = message.user.display_name ?? message.user.login;

  const editMessage = () => {
    console.log('Редактировать');
    setIsEditMessage(true);
  };

  const menuItems: DropdownMenuItems[] = [
    { onClick: editMessage, title: 'Редактировать' },
    { onClick: () => props.deleteMessageHandler(message.id), title: 'Удалить' },
  ];

  const [messageInput, setMessageInput] = useState('');

  const messageChangeHandler = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      const { value } = event.target;
      console.log(value);

      setMessageInput(value);
    },
    [messageInput]
  );

  const submitHandler = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      forumAPI.editMessage(message.id, { content: messageInput }).then(res => {
        setMessage(res.data);
      });
      setIsEditMessage(false);
    },

    [messageInput]
  );

  const formattedDate = simplifyDate(new Date(message.updated_at).toString());

  return (
    <div id={`forum-message-${message.id}`} className="forum-message" data-testid="forum-message">
      <div className="forum-message__avatar">
        <img alt={`${displayName} user avatar`} className="forum-message__avatar-image" src={defaultAvatarPath} />
      </div>
      <div className="forum-message__content">
        <div className="forum-message__meta">
          <span className="forum-message__username">{displayName}</span>
          <time className="forum-message__date">{formattedDate}</time>
        </div>
        {isEditMessage ? (
          <form onSubmit={submitHandler}>
            <textarea
              rows={4}
              name="message"
              id="message"
              className="forum-topic__textarea"
              onChange={messageChangeHandler}
              defaultValue={message.content}
            />
            <Button type="submit" text="Изменить сообщение" variant={ButtonVariant.Secondary} />
          </form>
        ) : (
          <div className="forum-message__text">{message.content}</div>
        )}
      </div>
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
    </div>
  );
});
