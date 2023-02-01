import { type FC, useCallback, useState } from 'react';

import defaultAvatarPath from '/assets/img/default-avatar.png';

import { forumAPI } from '../../../../api/forumAPI';
import { Button } from '../../../../components/Button';
import { ButtonVariant } from '../../../../components/Button/data';
import { Dropdown } from '../../../../components/Dropdown';
import { type DropdownMenuItems } from '../../../../components/Dropdown/typings';
import simplifyDate from '../../../../utils/dateUtils';
import { type ForumTopicDescriptionProps } from './typings';

export const ForumTopicDescription: FC<ForumTopicDescriptionProps> = props => {
  const { displayName, date, topicId } = props;
  const [description, setDescription] = useState<string>(props.description);
  const [isEditDescription, setIsEditDescription] = useState<boolean>(false);

  const descriptionChangeHandler = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = event.target;
    setDescription(value);
  }, []);

  const editTopicDescription = () => {
    setIsEditDescription(true);
  };

  const submitHandler = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      forumAPI.editTopic(topicId, { content: description }).then(res => {
        console.log(res.data);

        console.log(res.data.content);

        setDescription(res.data.content);
      });
      setIsEditDescription(false);
    },
    [description]
  );

  const menuItems: DropdownMenuItems[] = [{ onClick: editTopicDescription, title: 'Редактировать' }];

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
        {isEditDescription ? (
          <form onSubmit={submitHandler}>
            <textarea
              rows={4}
              name="description"
              id="description"
              className="forum-topic__textarea"
              onChange={descriptionChangeHandler}
              defaultValue={description}
            />
            <Button type="submit" text="Изменить описание" variant={ButtonVariant.Secondary} />
          </form>
        ) : (
          <div className="forum-message__text">{description}</div>
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
};