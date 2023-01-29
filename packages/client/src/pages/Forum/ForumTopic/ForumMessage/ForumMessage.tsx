import './ForumMessage.css';

import { type FC } from 'react';

import defaultAvatarPath from '/assets/img/default-avatar.png';

import { Dropdown } from '../../../../components/Dropdown';
import { type DropdownMenuItems } from '../../../../components/Dropdown/typings';
import simplifyDate from '../../../../utils/dateUtils';
import { type ForumMessageProps } from './typings';

export const ForumMessage: FC<ForumMessageProps> = ({ message }) => {
  //@ts-ignore
  const { id, username, content, created_at } = message;
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
  console.log(created_at);

  const formattedDate = simplifyDate(created_at);

  // const formattedDate = simplifyDate(new Date());

  console.log('formatted date ', formattedDate);

  return (
    <div id={`forum-message-${id}`} className="forum-message" data-testid="forum-message">
      <div className="forum-message__avatar">
        <img alt={`${username} user avatar`} className="forum-message__avatar-image" src={defaultAvatarPath} />
      </div>
      <div className="forum-message__content">
        <div className="forum-message__meta">
          <span className="forum-message__username">{username}</span>
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
};
