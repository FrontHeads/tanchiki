import { type FC } from 'react';

import defaultAvatarPath from '/assets/img/default-avatar.png';

import { Dropdown } from '../../../../components/Dropdown';
import { type DropdownMenuItems } from '../../../../components/Dropdown/typings';
import simplifyDate from '../../../../utils/dateUtils';
import { type ForumTopicDescriptionProps } from './typings';

export const ForumTopicDescription: FC<ForumTopicDescriptionProps> = ({ displayName, date, content }) => {
  const editMessage = () => {
    console.log('Редактировать');
  };

  const menuItems: DropdownMenuItems[] = [{ onClick: editMessage, title: 'Редактировать' }];

  return (
    <div className="forum-message">
      <div className="forum-message__avatar">
        <img alt={`${displayName} user avatar`} className="forum-message__avatar-image" src={defaultAvatarPath} />
      </div>
      <div className="forum-message__content">
        <div className="forum-message__meta">
          <span className="forum-message__username">{displayName}</span>
          <time className="forum-message__date">{simplifyDate(new Date(date).toString())}</time>
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
