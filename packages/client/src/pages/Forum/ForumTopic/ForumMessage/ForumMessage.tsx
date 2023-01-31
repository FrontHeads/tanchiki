import './ForumMessage.css';

import { type FC, memo } from 'react';

import defaultAvatarPath from '/assets/img/default-avatar.png';

import { Dropdown } from '../../../../components/Dropdown';
import { type DropdownMenuItems } from '../../../../components/Dropdown/typings';
import simplifyDate from '../../../../utils/dateUtils';
import { type ForumMessageProps } from './typings';

export const ForumMessage: FC<ForumMessageProps> = memo(({ message }) => {
  const { id, content, created_at } = message;
  console.log(message);
  const displayName = message.user.display_name ?? message.user.login;

  const editMessage = () => {
    console.log('Редактировать');
  };

  const deleteMessage = () => {
    console.log('Удалить');
  };

  const menuItems: DropdownMenuItems[] = [
    { onClick: editMessage, title: 'Редактировать' },
    { onClick: deleteMessage, title: 'Удалить' },
  ];

  const formattedDate = simplifyDate(new Date(created_at).toString());

  return (
    <div id={`forum-message-${id}`} className="forum-message" data-testid="forum-message">
      <div className="forum-message__avatar">
        <img alt={`${displayName} user avatar`} className="forum-message__avatar-image" src={defaultAvatarPath} />
      </div>
      <div className="forum-message__content">
        <div className="forum-message__meta">
          <span className="forum-message__username">{displayName}</span>
          <time className="forum-message__date">{formattedDate}</time>
        </div>
        <div className="forum-message__text">{content}</div>
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
