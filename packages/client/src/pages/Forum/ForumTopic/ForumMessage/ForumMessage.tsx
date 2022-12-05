import './ForumMessage.css';

import { FC } from 'react';

import { Dropdown } from '../../../../components/Dropdown';
import { ForumMessageProps } from './typings';

export const ForumMessage: FC<ForumMessageProps> = ({ id, username, content, time }) => {
  const editMessage = () => {
    console.log('Редактировать');
  };

  const deleteMessage = () => {
    console.log('clicked two');
  };

  return (
    <div id={`${id}`} className="forum-message">
      <div className="forum-message__header">
        <div className="forum-message__meta">
          <div className="forum-message__username">{username}</div>
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
          menu={[
            <button onClick={editMessage}>Редактировать</button>,
            <button onClick={deleteMessage}>Удалить</button>,
          ]}
        />
      </div>
      <div className="forum-message__content">{content}</div>
    </div>
  );
};
